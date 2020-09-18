package main

import (
	"bytes"
	"encoding/gob"

	"github.com/prologic/bitcask"
)

// Just the nest of all the bugs.
type Nest string

// Saves the bug into the nest.
func (n Nest) Put(key string, b Bug) error {
	var buf bytes.Buffer
	var enc = gob.NewEncoder(&buf)

	err := enc.Encode(b)
	if err != nil {
		return err
	}

	db, err := bitcask.Open(string(n))
	if err != nil {
		return err
	}
	defer db.Close()

	return db.Put([]byte(key), buf.Bytes())
}

// Retrieves a bug from the nest.
func (n Nest) Get(key string) (Bug, error) {
	var buf bytes.Buffer
	var bg Bug
	var dec = gob.NewDecoder(&buf)

	db, err := bitcask.Open(string(n))
	if err != nil {
		return bg, err
	}
	defer db.Close()

	b, err := db.Get([]byte(key))
	if err != nil {
		return bg, err
	}

	_, err = buf.Write(b)
	if err != nil {
		return bg, err
	}

	err = dec.Decode(&bg)
	return bg, err
}

// Deletes a bug from the nest.
func (n Nest) Delete(key string) error {
	db, err := bitcask.Open(string(n))
	if err != nil {
		return err
	}
	defer db.Close()
	return db.Delete([]byte(key))
}

// Returns all the bugs' keys.
func (n Nest) Keys() (chan []byte, error) {
	db, err := bitcask.Open(string(n))
	if err != nil {
		return nil, err
	}
	defer db.Close()
	return db.Keys(), nil
}
