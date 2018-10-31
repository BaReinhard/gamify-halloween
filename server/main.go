package main

import (
	"encoding/json"
	"fmt"

	"net/http"

	"github.com/bareinhard/gamify-halloween/server/common"
	"google.golang.org/appengine"
)

var hashmap map[string]bool

func main() {
	hashmap = map[string]bool{}

	http.HandleFunc("/api/addcount", addCountHandler)
	http.HandleFunc("/api/addusername", addUsernameHandler)

	appengine.Main()
}

func addUsernameHandler(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	ctx := appengine.NewContext(r)
	response, err := common.ReadBody(r.Body)
	if err != nil {
		fmt.Printf("%v", err)
	}
	success, err := common.AddUsername(ctx, response.Username)
	if success {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(common.UserNameResponse{Status: "Thank you! We have successfully saved your username"})
		return
	}
	json.NewEncoder(w).Encode(common.UserNameResponse{Status: "Sorry, it looks as though that username has already been taken."})
}
func addCountHandler(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	uniqueID := r.URL.Query().Get("uid")
	addingIP := r.RemoteAddr
	if !hashmap[uniqueID+addingIP] {
		hash, err := common.HashPass(ctx, uniqueID+addingIP)
		if err != nil {
			fmt.Printf("%v", err)
		}
		fmt.Printf("\nUniqueID: %v\nIP: %v", uniqueID, addingIP)
		fmt.Printf("\nHash: %v", hash)

		exists, err := common.CheckForUIDHashMatch(ctx, hash)
		if err != nil {
			fmt.Printf("%v", err)
		}
		if exists {
			fmt.Printf("Already exists")
		} else {
			fmt.Printf("Doesn't exist, lets add it")
			err = common.AddPoint(ctx, hash, uniqueID)
			if err != nil {
				fmt.Printf("%v", err)
			}
		}
		hashmap[uniqueID+addingIP] = true
	} else {
		fmt.Printf("Already Exists")
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Success"))
	return
}
