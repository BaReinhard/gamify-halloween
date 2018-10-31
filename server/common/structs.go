package common

type DatastorePoint struct {
	UniqueID string
	Point    int
}
type DatastoreUsername struct {
	Added int64
}

type FrontEndRequest struct {
	Username string `json:"username"`
}

type UserNameResponse struct {
	Status string `json:"status"`
}
