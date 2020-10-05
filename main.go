package main

import (
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"
)

type Comment struct {
	Date   int64  `json:"date"`
	Text   string `json:"text"`
	Author string `json:"author"`
}

type Bug struct {
	Id       int64     `json:"id"`
	Body     string    `json:"body"`
	Open     bool      `json:"is_open"`
	Tags     []string  `json:"tags"`
	Date     int64     `json:"date"`
	Comments []Comment `json:"comments"`
	Author   string    `json:"author"`
}

type Response struct {
	Ok   bool   `json:"ok"`
	Err  string `json:"err,omitempty"`
	Bug  *Bug   `json:"bug,omitempty"`
	Nest []Bug  `json:"nest,omitempty"`
}

const (
	OK                    = 200
	INTERNAL_SERVER_ERROR = 500
)

const MASK = 0xff

var nest *Nest

func (b Bug) String() string {
	return fmt.Sprintf("%d %s %s", b.Id, b.Body, b.Author)
}

// Returns a Response object with the data in input.
func NewResponse(b *Bug, n []Bug, e error) Response {
	return Response{
		Ok:   e == nil,
		Err:  etos(e),
		Bug:  b,
		Nest: n,
	}
}

// Returns the JSON of a new Response object with the data in input.
func NewResponseJson(b *Bug, n []Bug, e error) []byte {
	resp := NewResponse(b, n, e)
	j, err := json.Marshal(resp)
	if err != nil {
		log.Println(err)
	}
	return j
}

// Returns the string containing the error mesage or an empty string if the
// error is nil.
func etos(err error) string {
	if err != nil {
		return err.Error()
	}
	return ""
}

// Returns the value of an url raw query or error if missing.
func getQuery(name string, rawQuery string) (string, error) {
	for _, q := range strings.Split(rawQuery, "&") {
		tokens := strings.Split(q, "=")
		if tokens[0] == name {
			return tokens[1], nil
		}
	}
	return "", fmt.Errorf("%s: query not found", name)
}

// Creates the response to send back and writes it in w.
func writeResponse(w http.ResponseWriter, b []Bug, e error) {
	var status = OK
	resp := NewResponseJson(nil, b, e)
	if e != nil {
		status = INTERNAL_SERVER_ERROR
	}
	w.WriteHeader(status)
	fmt.Fprintln(w, string(resp))
}

// Handles the /put endpoint.
func putHandler(w http.ResponseWriter, r *http.Request) {
	var key int64
	var bug Bug

	if r.Method != "POST" {
		writeResponse(w, nil, errors.New("Invalid request"))
		return
	}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		writeResponse(w, nil, err)
		return
	}

	if err := json.Unmarshal(body, &bug); err != nil {
		writeResponse(w, nil, err)
		return
	}

	id, err := getQuery("id", r.URL.RawQuery)
	// If the error is not nil it means the bug doesn't exist yet, thus needs to
	// be created.
	if err != nil {
		if key, err = nest.NextId(); err != nil {
			writeResponse(w, nil, err)
			return
		}
		bug.Id = key
	} else if key, err = strconv.ParseInt(id, 10, 64); err != nil {
		writeResponse(w, nil, err)
		return
	}

	if err := nest.Put(key, bug); err != nil {
		writeResponse(w, nil, err)
		return
	}

	writeResponse(w, nil, nil)
}

// Handles the /get endpoint.
func getHandler(w http.ResponseWriter, r *http.Request) {
	var bugs []Bug

	if r.Method != "GET" {
		writeResponse(w, nil, errors.New("Invalid request"))
		return
	}

	err := nest.Fold(func(k []byte) error {
		if string(k) != "id_counter" {
			bug, err := nest.Get(sltoi(k))
			if err != nil {
				return err
			}
			bugs = append(bugs, bug)
		}
		return nil
	})

	writeResponse(w, bugs, err)
}

// Handles the /del endpoint.
func delHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "DELETE" {
		writeResponse(w, nil, errors.New("Invalid request"))
		return
	}

	qry, err := getQuery("id", r.URL.RawQuery)
	if err != nil {
		writeResponse(w, nil, err)
		return
	}

	id, err := strconv.ParseInt(qry, 10, 64)
	if err != nil {
		writeResponse(w, nil, err)
		return
	}

	err = nest.Delete(id)
	if err != nil {
		writeResponse(w, nil, err)
		return
	}

	writeResponse(w, nil, nil)
}

func main() {
	var port string

	flag.StringVar(&port, "-p", "8080", "Specify the port to use.")
	flag.Parse()

	http.HandleFunc("/put", putHandler)
	http.HandleFunc("/get", getHandler)
	http.HandleFunc("/del", delHandler)

	nest = NewNest(path)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), nil))
}
