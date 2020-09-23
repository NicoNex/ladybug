package main

import (
	"bytes"
	"encoding/gob"

	"github.com/prologic/bitcask"
)

// Just the nest of all the bugs.
type Nest struct {
	path string
	buf  bytes.Buffer
	enc  *gob.Encoder
	dec  *gob.Decoder
}

func NewNest(path string) Nest {
	n := Nest{path: path}
	n.enc = gob.NewEncoder(&n.buf)
	n.dec = gob.NewDecoder(&n.buf)
	return n
}

// Saves the bug into the nest.
func (n Nest) Put(key []byte, b Bug) error {
	defer n.buf.Reset()
	if err := n.enc.Encode(b); err != nil {
		return err
	}

	db, err := bitcask.Open(n.path)
	if err != nil {
		return err
	}
	defer db.Close()
	return db.Put(key, n.buf.Bytes())
}

// Retrieves a bug from the nest.
func (n Nest) Get(key []byte) (Bug, error) {
	defer n.buf.Reset()
	var bg Bug

	db, err := bitcask.Open(n.path)
	if err != nil {
		return bg, err
	}
	defer db.Close()

	b, err := db.Get(key)
	if err != nil {
		return bg, err
	}

	if _, err = n.buf.Write(b); err != nil {
		return bg, err
	}

	err = n.dec.Decode(&bg)
	return bg, err
}

// Deletes a bug from the nest.
func (n Nest) Delete(key []byte) error {
	db, err := bitcask.Open(n.path)
	if err != nil {
		return err
	}
	defer db.Close()
	return db.Delete(key)
}

// Returns all the bugs' keys.
func (n Nest) Keys() (chan []byte, error) {
	db, err := bitcask.Open(n.path)
	if err != nil {
		return nil, err
	}
	defer db.Close()
	return db.Keys(), nil
}
