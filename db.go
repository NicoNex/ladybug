package main

import (
	"bytes"
	"encoding/gob"
	"fmt"
	"log"
	"sync"

	"github.com/prologic/bitcask"
)

// Just the nest of all the bugs.
type Nest struct {
	buf bytes.Buffer
	dec *gob.Decoder
	enc *gob.Encoder
	db  *bitcask.Bitcask
	sync.Mutex
}

var COUNTER_KEY = []byte("id_counter")

// Returns the slice of bytes resulting from the conversion of an int64.
func itosl(i int64) (sl []byte) {
	for j := 0; j < 8; j++ {
		shift := j * 8
		sl = append(sl, byte(i&(MASK<<shift)>>shift))
	}
	return
}

// Returns the int64 obtained from the byte slice given in input.
func sltoi(sl []byte) (i int64) {
	if len(sl) != 8 {
		log.Printf("Invalid ID slice '%v'.\n", sl)
		return
	}
	for j, v := range sl {
		shift := j * 8
		i |= int64(v) << shift
	}
	return
}

// Returns a wrapped error.
func wrap(n string, e error) (ret error) {
	if e != nil {
		ret = fmt.Errorf("%s: %v", n, e)
	}
	return
}

func NewNest(path string) *Nest {
	db, err := bitcask.Open(path, bitcask.WithSync(true))
	if err != nil {
		log.Fatal(wrap("NewNest", err))
	}

	var n Nest
	n.dec = gob.NewDecoder(&n.buf)
	n.enc = gob.NewEncoder(&n.buf)
	n.db = db

	return &n
}

// Saves the bug into the nest.
func (n *Nest) Put(id int64, b Bug) error {
	n.Lock()
	defer n.Unlock()
	if err := n.enc.Encode(b); err != nil {
		return wrap("Put, encoder", err)
	}
	defer n.buf.Reset()
	return wrap("Put, bitcask", n.db.Put(itosl(id), n.buf.Bytes()))
}

// Retrieves a bug from the nest.
func (n *Nest) Get(id int64) (Bug, error) {
	var bg Bug

	b, err := n.db.Get(itosl(id))
	if err != nil {
		return bg, wrap("Get, bitcask", err)
	}
	n.Lock()
	defer n.Unlock()
	if _, err = n.buf.Write(b); err != nil {
		return bg, wrap("Get, buffer", err)
	}
	defer n.buf.Reset()
	return bg, wrap("Get, decoder", n.dec.Decode(&bg))
}

// Deletes a bug from the nest.
func (n Nest) Delete(id int64) error {
	return wrap("Delete, bitcask", n.db.Delete(itosl(id)))
}

// Returns all the bugs' keys.
func (n Nest) Keys() chan []byte {
	return n.db.Keys()
}

// Returns the next bug id.
func (n Nest) NextId() (int64, error) {
	if !n.db.Has(COUNTER_KEY) {
		n.db.Put(COUNTER_KEY, itosl(0))
		return 0, nil
	}

	b, err := n.db.Get(COUNTER_KEY)
	if err != nil {
		return 0, wrap("NextId, bitcask", err)
	}

	id := sltoi(b) + 1
	if err = n.db.Put(COUNTER_KEY, itosl(id)); err != nil {
		return 0, wrap("NextId, bitcask", err)
	}
	return id, nil
}

// Closes the db.
func (n Nest) Close() error {
	return wrap("Close, bitcask", n.db.Close())
}

// Fold iterates over all keys in the database calling the function `fn` for
// each key. If the function returns an error, no further keys are processed
// and the error returned.
func (n Nest) Fold(fn func(key int64) error) error {
	return n.db.Fold(func(k []byte) error {
		if string(k) != "id_counter" {
			return fn(sltoi(k))
		}
		return nil
	})
}

// Syncs the in-memory db with the disk.
func (n Nest) sync() {
	if err := n.db.Sync(); err != nil {
		log.Println(err)
	}
}
