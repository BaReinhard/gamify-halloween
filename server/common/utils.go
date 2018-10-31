package common

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"time"

	"cloud.google.com/go/datastore"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/crypto/scrypt"
	"golang.org/x/oauth2/google"
	cloudkms "google.golang.org/api/cloudkms/v1"
	"google.golang.org/appengine/log"
)

func AddUsername(ctx context.Context, username string) (bool, error) {
	client, err := datastore.NewClient(ctx, os.Getenv("PROJECT_ID"))
	if err != nil {
		return false, err
	}
	_, err = client.RunInTransaction(ctx, func(tx *datastore.Transaction) error {
		var irrelevantInterface *DatastoreUsername
		key := datastore.NameKey("GamifyHalloweenUsernames", username, nil)
		err := tx.Get(key, irrelevantInterface)
		if err != nil && err == datastore.ErrNoSuchEntity {
			irrelevantInterface = &DatastoreUsername{Added: time.Now().Unix()}
			_, err := tx.Put(key, irrelevantInterface)
			if err != nil {
				log.Infof(ctx, "Error: %v", err)
				return err
			}
		} else if err != nil {
			log.Infof(ctx, "Error: %v", err)

			return err
		}
		return nil
	})
	if err != nil {
		log.Infof(ctx, "Error: %v", err)

		return false, err
	}

	return true, nil
}

func HashPass(ctx context.Context, password string) (string, error) {
	hash, err := scrypt.Key([]byte(password), []byte(os.Getenv("SALT")), 1<<14, 8, 1, 24)
	if err != nil {
		return "", fmt.Errorf("Error Hashing Key: %v", err)
	}

	fmt.Printf("%x\n", base64.URLEncoding.EncodeToString(hash))
	return base64.URLEncoding.EncodeToString(hash), nil
}
func ReadBody(body io.ReadCloser) (*FrontEndRequest, error) {
	var br *FrontEndRequest
	b, err := ioutil.ReadAll(body)
	if err != nil {
		return nil, fmt.Errorf("Error Reading Body: %v", err)
	}
	err = json.Unmarshal(b, &br)
	if err != nil {
		return nil, fmt.Errorf("Error Unmarshalling Body Bytes: %v", err)
	}
	return br, nil
}
func Encrypt(ctx context.Context, snippet string) (string, error) {
	client, err := google.DefaultClient(ctx, cloudkms.CloudPlatformScope)
	if err != nil {
		return "", err
	}
	// Create the KMS client.

	kmsService, err := cloudkms.New(client)
	if err != nil {
		return "", err
	}
	req := &cloudkms.EncryptRequest{
		Plaintext: base64.StdEncoding.EncodeToString([]byte(snippet)),
	}
	parentName := fmt.Sprintf("projects/%s/locations/%s/keyRings/%s/cryptoKeys/%s", os.Getenv("PROJECT_ID"), os.Getenv("LOCATION"), os.Getenv("KEYRING"), os.Getenv("CRYPTO_KEY"))
	response, err := kmsService.Projects.Locations.KeyRings.CryptoKeys.Encrypt(parentName, req).Do()
	if err != nil {
		return "", fmt.Errorf("Error Requesting Encryption: %v", err)
	}

	fmt.Printf("%+v", response)
	// Print the returned key rings.
	b, err := base64.StdEncoding.DecodeString(response.Ciphertext)
	if err != nil {
		return "", err
	}
	return string(b), nil
}
func CheckPass(password string, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func CheckForUIDHashMatch(ctx context.Context, hash string) (bool, error) {
	client, err := datastore.NewClient(ctx, os.Getenv("PROJECT_ID"))
	if err != nil {
		return false, err
	}
	_, err = client.RunInTransaction(ctx, func(tx *datastore.Transaction) error {
		var irrelevantInterface *DatastorePoint
		key := datastore.NameKey(os.Getenv("DATASTORE_KIND"), hash, nil)
		err := tx.Get(key, irrelevantInterface)
		if err != nil {
			return err
		}
		return nil
	})
	if err != nil && err != datastore.ErrNoSuchEntity {
		return false, err
	} else if err != nil && err == datastore.ErrNoSuchEntity {
		return false, nil
	}

	return true, nil
}
func AddPoint(ctx context.Context, hash, UID string) error {
	client, err := datastore.NewClient(ctx, os.Getenv("PROJECT_ID"))
	if err != nil {
		return err
	}
	cmt, err := client.RunInTransaction(ctx, func(tx *datastore.Transaction) error {
		point := &DatastorePoint{UniqueID: UID, Point: 1}
		key := datastore.NameKey(os.Getenv("DATASTORE_KIND"), hash, nil)
		_, err := tx.Put(key, point)
		if err != nil {
			return err
		}
		return nil
	})
	if err != nil && err != datastore.ErrNoSuchEntity {
		return err
	} else if err != nil && err == datastore.ErrNoSuchEntity {
		return nil
	}
	fmt.Printf("%+v", cmt)

	return nil
}
