package common

type DatastorePoint struct {
	UniqueID string
	Point    int
}
type DatastoreUsername struct {
	Added int64
	Name  string
}

type FrontEndRequest struct {
	Username string `json:"username"`
}

type UserNameResponse struct {
	Status string `json:"status"`
}

type UsernamesResponse struct {
	Name   string            `json:"name"`
	Treats []*DatastorePoint `json:"treats"`
}

type LeaderboardResponse struct {
	Users []*UsernamesResponse `json:"users"`
	Error string               `json:"error,omitempty"`
}
