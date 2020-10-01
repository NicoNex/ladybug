package main

import (
	"bytes"
	"encoding/gob"
	"fmt"
	"log"

	"github.com/prologic/bitcask"
)

// Just the nest of all the bugs.
type Nest struct {
	buf bytes.Buffer
	enc *gob.Encoder
	dec *gob.Decoder
	db  *bitcask.Bitcask
}

var COUNTER_KEY = []byte("id_counter")

func NewNest(path string) *Nest {
	db, err := bitcask.Open(path, bitcask.WithSync(true))
	if err != nil {
		log.Fatal(err)
	}

	var n Nest
	n.enc = gob.NewEncoder(&n.buf)
	n.dec = gob.NewDecoder(&n.buf)
	n.db = db
	return &n
}

// Saves the bug into the nest.
func (n Nest) Put(key []byte, b Bug) error {
	// n.enc = gob.NewEncoder(&n.buf) // With this line it works.
	if err := n.enc.Encode(b); err != nil {
		return err
	}
	fmt.Println("before put", n.buf.Len())
	err := n.db.Put(key, n.buf.Bytes())
	fmt.Println("after put", n.buf.Len())
	return err
}

// Retrieves a bug from the nest.
func (n Nest) Get(key []byte) (Bug, error) {
	var bg Bug
	// n.dec = gob.NewDecoder(&n.buf) // With this line it works.
	b, err := n.db.Get(key)
	if err != nil {
		return bg, err
	}

	fmt.Println("before write", n.buf.Len())
	if _, err = n.buf.Write(b); err != nil {
		return bg, err
	}
	fmt.Println("after write", n.buf.Len())
	return bg, n.dec.Decode(&bg)
}

// Deletes a bug from the nest.
func (n Nest) Delete(key []byte) error {
	return n.db.Delete(key)
}

// Returns all the bugs' keys.
func (n Nest) Keys() chan []byte {
	return n.db.Keys()
}

// Returns the next bug id.
func (n Nest) NextId() (int64, error) {
	if !n.db.Has(COUNTER_KEY) {
		go n.db.Put(COUNTER_KEY, atob(itoa(0)))
		return 0, nil
	}

	b, err := n.db.Get(COUNTER_KEY)
	if err != nil {
		return 0, err
	}

	ret := atoi(btoa(b)) + 1
	val := atob(itoa(ret))
	if err = n.db.Put(COUNTER_KEY, val); err != nil {
		return 0, err
	}

	return ret, nil
}

func (n Nest) Close() error {
	return n.db.Close()
}

func (n Nest) Fold(fn func(key []byte) error) error {
	return n.db.Fold(fn)
}

func (n Nest) sync() {
	if err := n.db.Sync(); err != nil {
		log.Println(err)
	}
}
