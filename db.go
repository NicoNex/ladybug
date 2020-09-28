package main

import (
	"bytes"
	"encoding/gob"
	"sync"

	"github.com/prologic/bitcask"
)

// Just the nest of all the bugs.
type Nest struct {
	path string
	buf  bytes.Buffer
	enc  *gob.Encoder
	dec  *gob.Decoder
	mux  *sync.Mutex
}

func NewNest(path string) Nest {
	n := Nest{path: path, mux: new(sync.Mutex)}
	n.enc = gob.NewEncoder(&n.buf)
	n.dec = gob.NewDecoder(&n.buf)
	return n
}

// Saves the bug into the nest.
func (n Nest) Put(key []byte, b Bug) error {
	// defer n.buf.Reset()
	defer n.mux.Unlock()
	if err := n.enc.Encode(b); err != nil {
		return err
	}

	n.mux.Lock()
	db, err := bitcask.Open(n.path)
	if err != nil {
		return err
	}
	defer db.Close()
	return db.Put(key, n.buf.Bytes())
}

// Retrieves a bug from the nest.
func (n Nest) Get(key []byte) (Bug, error) {
	// defer n.buf.Reset()
	defer n.mux.Unlock()
	var bg Bug

	n.mux.Lock()
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

// Returns the next bug id.
func (n Nest) NextId() (int64, error) {
	var key = []byte("id_counter")

	db, err := bitcask.Open(n.path)
	if err != nil {
		return 0, err
	}
	defer db.Close()

	if !db.Has(key) {
		go func() {
			val := itob(0)
			db.Put(key, val[:])
		}()
		return 0, nil
	}

	b, err := db.Get(key)
	if err != nil {
		return 0, nil
	}

	var raw [8]byte
	copy(raw[:], b[0:8])
	ret := btoi(raw) + 1
	val := itob(ret)
	if err = db.Put(key, val[:]); err != nil {
		return 0, err
	}

	return ret, nil
}
