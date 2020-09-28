package main

import (
	"bytes"
	"encoding/gob"
	"log"
	// "sync"

	"github.com/prologic/bitcask"
)

// Just the nest of all the bugs.
type Nest struct {
	buf bytes.Buffer
	enc *gob.Encoder
	dec *gob.Decoder
	db  *bitcask.Bitcask
}

func NewNest(path string) Nest {
	db, err := bitcask.Open(path, bitcask.WithSync(true))
	if err != nil {
		log.Fatal(err)
	}

	var n Nest

	n.enc = gob.NewEncoder(&n.buf)
	n.dec = gob.NewDecoder(&n.buf)
	n.db = db
	return n
}

// Saves the bug into the nest.
func (n Nest) Put(key []byte, b Bug) error {
	if err := n.enc.Encode(b); err != nil {
		return err
	}
	err := n.db.Put(key, n.buf.Bytes())
	// go n.sync()
	return err
}

// Retrieves a bug from the nest.
func (n Nest) Get(key []byte) (Bug, error) {
	var bg Bug

	b, err := n.db.Get(key)
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
	err := n.db.Delete(key)
	// go n.sync()
	return err
}

// Returns all the bugs' keys.
func (n Nest) Keys() (chan []byte, error) {
	return n.db.Keys(), nil
}

// Returns the next bug id.
func (n Nest) NextId() (int64, error) {
	var key = []byte("id_counter")

	if !n.db.Has(key) {
		go func() {
			val := itob(0)
			n.db.Put(key, val[:])
		}()
		return 0, nil
	}

	b, err := n.db.Get(key)
	if err != nil {
		return 0, nil
	}

	var raw [8]byte
	copy(raw[:], b[0:8])
	ret := btoi(raw) + 1
	val := itob(ret)
	if err = n.db.Put(key, val[:]); err != nil {
		return 0, err
	}

	// go n.sync()
	return ret, nil
}

func (n Nest) Close() error {
	return n.db.Close()
}

func (n Nest) sync() {
	if err := n.db.Sync(); err != nil {
		log.Println(err)
	}
}
