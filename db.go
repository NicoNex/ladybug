package main

import (
	"bytes"
	"encoding/gob"
	"fmt"
	"log"

	"github.com/prologic/bitcask"
)

// type Nest struct {
// 	db *bitcask.Bitcask
// }

type Nest string

const Mask = 0xff

var COUNTER_KEY = []byte("id_counter")

// Returns the slice of bytes resulting from the conversion of an int64.
func itosl(i int64) (sl []byte) {
	for j := 0; j < 8; j++ {
		shift := j * 8
		sl = append(sl, byte(i&(Mask<<shift)>>shift))
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
		ret = fmt.Errorf("%s: %w", n, e)
	}
	return
}

func NewNest(path string) Nest {
	return Nest(path)
}

// Saves the bug into the nest.
func (n Nest) Put(id int64, b Bug) error {
	var buf bytes.Buffer
	var enc = gob.NewEncoder(&buf)

	if err := enc.Encode(b); err != nil {
		return wrap("Put, enc.Encode", err)
	}

	db, err := bitcask.Open(string(n))
	if err != nil {
		return wrap("Put, bitcask.Open", err)
	}
	defer db.Close()

	return wrap("Put, bitcask", db.Put(itosl(id), buf.Bytes()))
}

// Retrieves a bug from the nest.
func (n Nest) Get(id int64) (Bug, error) {
	var bg Bug
	var buf bytes.Buffer

	db, err := bitcask.Open(string(n))
	if err != nil {
		return Bug{}, wrap("Get, bitcask.Open", err)
	}
	defer db.Close()

	b, err := db.Get(itosl(id))
	if err != nil {
		return bg, wrap("Get, bitcask", err)
	}
	if _, err = buf.Write(b); err != nil {
		return bg, wrap("Get, buffer", err)
	}
	dec := gob.NewDecoder(&buf)
	return bg, wrap("Get, decoder", dec.Decode(&bg))
}

// Deletes a bug from the nest.
func (n Nest) Delete(id int64) error {
	db, err := bitcask.Open(string(n))
	if err != nil {
		return wrap("Delete, bitcask.Open", err)
	}
	defer db.Close()

	return wrap("Delete, bitcask", db.Delete(itosl(id)))
}

// Returns all the bugs' keys.
func (n Nest) Keys() chan []byte {
	db, err := bitcask.Open(string(n))
	if err != nil {
		return nil
	}
	defer db.Close()
	return db.Keys()
}

// Returns the next bug id.
func (n Nest) NextId() (int64, error) {
	db, err := bitcask.Open(string(n))
	if err != nil {
		return 0, wrap("NextId, bitcask.Open", err)
	}
	defer db.Close()

	if !db.Has(COUNTER_KEY) {
		db.Put(COUNTER_KEY, itosl(0))
		return 0, nil
	}

	b, err := db.Get(COUNTER_KEY)
	if err != nil {
		return 0, wrap("NextId, bitcask", err)
	}

	id := sltoi(b) + 1
	if err = db.Put(COUNTER_KEY, itosl(id)); err != nil {
		return 0, wrap("NextId, bitcask", err)
	}
	return id, nil
}

// Fold iterates over all keys in the database calling the function `fn` for
// each key. If the function returns an error, no further keys are processed
// and the error returned.
func (n Nest) Fold(fn func(key int64) error) error {
	db, err := bitcask.Open(string(n))
	if err != nil {
		return wrap("Fold, bitcask.Open", err)
	}
	defer db.Close()

	return db.Fold(func(k []byte) error {
		if string(k) != "id_counter" {
			return fn(sltoi(k))
		}
		return nil
	})
}
