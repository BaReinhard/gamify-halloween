package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"net/http"

	"github.com/bareinhard/gamify-halloween/server/common"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
)

var hashmap map[string]bool

func main() {
	hashmap = map[string]bool{}

	http.HandleFunc("/api/addcount", addCountHandler)
	http.HandleFunc("/api/addusername", addUsernameHandler)
	http.HandleFunc("/api/leaderboard", retrieveLeaderboard)

	appengine.Main()
}
func retrieveLeaderboard(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte(""))
		return
	}
	referer := r.Referer()
	userAgent := r.UserAgent()
	log.Infof(ctx, "Visitor: %v", r.RemoteAddr)
	log.Infof(ctx, "Referer: %v", referer)
	log.Infof(ctx, "Agent: %v", userAgent)
	if !strings.HasPrefix(referer, os.Getenv("HOST_URL")) {
		log.Errorf(ctx, "Bad Referer: %v", referer)
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Unauthorized"))
		return
	}
	users, err := common.GetUsernames(ctx)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(""))
		return
	}
	resp := common.LeaderboardResponse{Users: users}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(resp)
	return
}
func addUsernameHandler(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	ctx := appengine.NewContext(r)
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte(""))
		return
	}
	referer := r.Referer()
	userAgent := r.UserAgent()
	log.Infof(ctx, "Visitor: %v", r.RemoteAddr)
	log.Infof(ctx, "Referer: %v", referer)
	log.Infof(ctx, "Agent: %v", userAgent)
	if !strings.HasPrefix(referer, os.Getenv("HOST_URL")) {
		log.Errorf(ctx, "Bad Referer: %v", referer)
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Unauthorized"))
		return
	}
	response, err := common.ReadBody(r.Body)
	if err != nil {
		log.Errorf(ctx, "%v", err)
		json.NewEncoder(w).Encode(common.LeaderboardResponse{Error: err.Error()})
		return
	}
	log.Infof(ctx, "Here is the response: %+v", response)
	success, err := common.AddUsername(ctx, response.Username)
	if success {
		log.Infof(ctx, "SUCCESS: %v", success)
		json.NewEncoder(w).Encode(common.UserNameResponse{Status: "Thank you! We have successfully saved your username"})
		return
	}
	log.Infof(ctx, "FAIL: %v %v", success, err)
	json.NewEncoder(w).Encode(common.UserNameResponse{Status: "Sorry, it looks as though that username has already been taken."})
}
func addCountHandler(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte(""))
		return
	}
	referer := r.Referer()
	userAgent := r.UserAgent()
	log.Infof(ctx, "Visitor: %v", r.RemoteAddr)
	log.Infof(ctx, "Referer: %v", referer)
	log.Infof(ctx, "Agent: %v", userAgent)
	if !strings.HasPrefix(referer, os.Getenv("HOST_URL")) {
		log.Errorf(ctx, "Bad Referer: %v", referer)
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Unauthorized"))
		return
	}
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
