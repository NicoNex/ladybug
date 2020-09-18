// +build !windows

package main

import (
	"os"
	"path/filepath"
)

var path = filepath.Join(os.Getenv("HOME"), ".cache", "ladybug")
