#!/usr/bin/env python3

import sys
import time
import requests as req

mock = {
	"body": "",
	"open": True,
	"tags": [
		"font-end",
		"back-end",
		"angular",
		"cazzi-magici"
	],
	"date": 1234567890,
	"comments": [
		{
			"date": 221229132,
			"text": "il mio mirabolante commento",
			"author": "NicoNex"
		},
		{
			"date": 221229132,
			"text": "Altro mirabolante permesso",
			"author": "Giuseppe"
		}
	]
}

def put_bug(bug: dict) -> int:
	resp = req.post("http://localhost:8080/put", json=bug)
	return resp

start = time.time()
for i in range(1000):
	# print(f"Put bug #{i}")
	mock["body"] = f"bench_{i}"
	resp = put_bug(mock)
	if resp.status_code != 200:
		print(f"Failed to put bug #{i}", resp.content)

print(f"Elapsed time: {time.time() - start}s")
