package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/rs/xid"
)

type Bug struct {
	Id       []byte   `json:"id"`
	Body     string   `json:"body"`
	Open     bool     `json:"is_open"`
	Tags     []string `json:"tags"`
	Comments []string `json:"comments"`
	Date     int64    `json:"date"`
}

type Response struct {
	Ok   bool  `json:"ok"`
	Err  error `json:"err,omitempty"`
	Nest []Bug `json:"nest,omitempty"`
}

var guid xid.ID

func putHandler(w http.ResponseWriter, r *http.Request) {

}

func getHandler(w http.ResponseWriter, r *http.Request) {

}

func delHandler(w http.ResponseWriter, r *http.Request) {

}

func main() {
	var port string

	flag.StringVar(&port, "-p", "80", "Specify the port to use.")
	flag.Parse()

	http.HandleFunc("/put", putHandler)
	http.HandleFunc("/get", getHandler)
	http.HandleFunc("/del", delHandler)

	port = fmt.Sprintf(":%s", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
