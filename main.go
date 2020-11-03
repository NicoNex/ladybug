package main

import (
	"encoding/json"
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
	Open     bool      `json:"open"`
	Tags     []string  `json:"tags"`
	Date     int64     `json:"date"`
	Comments []Comment `json:"comments"`
	Author   string    `json:"author"`
}

func (b Bug) String() string {
	return fmt.Sprintf("%d %s %s", b.Id, b.Body, b.Author)
}

type Response struct {
	Ok   bool   `json:"ok"`
	Err  string `json:"err,omitempty"`
	Bug  *Bug   `json:"bug,omitempty"`
	Bugs []Bug  `json:"bugs,omitempty"`
}

type InvalidRequest struct {
	s string
}

func newInvalidRequest(msg string) error {
	return &InvalidRequest{msg}
}

func (i InvalidRequest) Error() string {
	return i.s
}

func InvalidMethod(exp, got string) error {
	msg := fmt.Sprintf("invalid method: expected '%s', got '%s'", exp, got)
	return newInvalidRequest(msg)
}

const (
	OK                    = 200
	INTERNAL_SERVER_ERROR = 500
)

const MASK = 0xff

var nest Nest

// Returns a Response object with the data in input.
func NewResponse(b *Bug, n []Bug, e error) Response {
	return Response{
		Ok:   e == nil,
		Err:  etos(e),
		Bug:  b,
		Bugs: n,
	}
}

// Returns the JSON of a new Response object with the data in input.
func NewResponseJson(b *Bug, n []Bug, e error) []byte {
	j, err := json.Marshal(NewResponse(b, n, e))
	if err != nil {
		log.Println(err)
	}
	return j
}

// Returns the string containing the error mesage or an empty string if the
// error is nil.
func etos(e error) string {
	if e != nil {
		return e.Error()
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

	if r.Method != "PUT" {
		err := InvalidMethod("PUT", r.Method)
		go log.Println(err)
		writeResponse(w, nil, err)
		return
	}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		go log.Println(err)
		writeResponse(w, nil, err)
		return
	}

	if err := json.Unmarshal(body, &bug); err != nil {
		go log.Println(err)
		writeResponse(w, nil, err)
		return
	}

	id, err := getQuery("id", r.URL.RawQuery)
	// If the error is not nil it means the bug doesn't exist yet, thus needs to
	// be created.
	if err != nil {
		if key, err = nest.NextId(); err != nil {
			go log.Println(err)
			writeResponse(w, nil, err)
			return
		}
		bug.Id = key
	} else if key, err = strconv.ParseInt(id, 10, 64); err != nil {
		go log.Println(err)
		writeResponse(w, nil, err)
		return
	}

	if err := nest.Put(key, bug); err != nil {
		go log.Println(err)
		writeResponse(w, nil, err)
		return
	}

	writeResponse(w, nil, nil)
}

// Handles the /get endpoint.
func getHandler(w http.ResponseWriter, r *http.Request) {
	var bugs []Bug

	if r.Method != "GET" {
		err := InvalidMethod("GET", r.Method)
		go log.Println(err)
		writeResponse(w, nil, err)
		return
	}

	err := nest.Fold(func(k int64) error {
		bug, err := nest.Get(k)
		if err != nil {
			go log.Println(err)
			return err
		}
		bugs = append(bugs, bug)
		return nil
	})
	writeResponse(w, bugs, err)
}

// Handles the /del endpoint.
func delHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "DELETE" {
		err := InvalidMethod("DELETE", r.Method)
		go log.Println(err)
		writeResponse(w, nil, err)
		return
	}

	qry, err := getQuery("id", r.URL.RawQuery)
	if err != nil {
		go log.Println(err)
		writeResponse(w, nil, err)
		return
	}

	id, err := strconv.ParseInt(qry, 10, 64)
	if err != nil {
		go log.Println(err)
		writeResponse(w, nil, err)
		return
	}

	err = nest.Delete(id)
	if err != nil {
		go log.Println(err)
		writeResponse(w, nil, err)
		return
	}

	writeResponse(w, nil, nil)
}

func enableCors(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS, PUT, DELETE")
}

func main() {
	var port string

	flag.StringVar(&port, "p", "8080", "Specify the port to use.")
	flag.Parse()

	http.HandleFunc("/put", func(w http.ResponseWriter, r *http.Request) {
		enableCors(w)
		if r.Method == "OPTIONS" {
			writeResponse(w, nil, nil)
			return
		}
		putHandler(w, r)
	})
	http.HandleFunc("/get", func(w http.ResponseWriter, r *http.Request) {
		enableCors(w)
		if r.Method == "OPTIONS" {
			writeResponse(w, nil, nil)
			return
		}
		getHandler(w, r)
	})
	http.HandleFunc("/del", func(w http.ResponseWriter, r *http.Request) {
		enableCors(w)
		if r.Method == "OPTIONS" {
			writeResponse(w, nil, nil)
			return
		}
		delHandler(w, r)
	})

	nest = NewNest(path)
	log.Printf("running on port %s...", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), nil))
}
