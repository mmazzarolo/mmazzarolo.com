```bash
#!/bin/bash
# script source: https://gist.github.com/mbohun/b161521b2440b9f08b59

if [ ${#@} -lt 2 ]; then
    echo "usage: $0 [your github credentials as 'user:token'] [REST expression]"
    exit 1;
fi

GITHUB_CREDENTIALS=$1
GITHUB_API_REST=$2

GITHUB_API_HEADER_ACCEPT="Accept: application/vnd.github.v3+json"

temp=`basename $0`
TMPFILE=`mktemp /tmp/${temp}.XXXXXX` || exit 1

function rest_call {
    curl -s -u $GITHUB_CREDENTIALS $1 -H "${GITHUB_API_HEADER_ACCEPT}" >> $TMPFILE
}

# single page result-s (no pagination), have no Link: section, the grep result is empty
last_page=`curl -s -I -u $GITHUB_CREDENTIALS "https://api.github.com${GITHUB_API_REST}?per_page=200" -H "${GITHUB_API_HEADER_ACCEPT}" | grep '^Link:' | sed -e 's/^Link:.*page=//g' -e 's/>.*$//g'`

# does this result use pagination?
if [ -z "$last_page" ]; then
    # no - this result has only one page
    rest_call "https://api.github.com${GITHUB_API_REST}?per_page=200"
else
    # yes - this result is on multiple pages
    for p in `seq 1 $last_page`; do
        rest_call "https://api.github.com${GITHUB_API_REST}?per_page=200&page=$p"
    done
fi

cat $TMPFILE
```

```bash
githubapi-get.sh "{USERNAME}:{TOKEN}" "/user/repos" | jq '.[] | "\(.full_name)\(.name);\(.description)"' > ~/my-github-repos.txt
```

```bash
githubapi-get.sh "{USERNAME}:{TOKEN}" "/orgs/{ORGANIZATION}/repos" | jq '.[] | "\(.name);\(.description)"' > ~/my-company-repos.txt
```

```bash
jq --slurp --raw-input --raw-output \
  'split("\n") | .[1:] | map(split(";")) |
      map({"arg": .[0],
           "uid": .[0],
           "title": .[0],
           "subtitle": .[1]})' \
  ~/my-github-repos.txt > ~/my-github-repos.json
```

```py
#!/usr/bin/python

from __future__ import print_function

theFile="list.csv"
fieldnames=["arg", "title","subtitle"]

json_filename = theFile.split(".")[0]+".json"

import csv
import sys
import json
import os

def convert(csv_filename, json_filename, fieldnames):
	f=open(csv_filename, 'r')
	csv_reader = csv.DictReader(f,fieldnames, delimiter=";")

	jsonf = open(json_filename,'w')
	jsonf.write('{"items":[')

	data=""

	for r in csv_reader:
		r['uid']=r['arg']
		r['arg']=r['arg']
		data = data+json.dumps(r)+",\n"

	jsonf.write(data[:-2])

	jsonf.write(']}')
	f.close()
	jsonf.close()

if (not os.path.isfile(json_filename)) or (os.path.getmtime(theFile) > os.path.getmtime(json_filename)) :
	convert(theFile, json_filename, fieldnames)

with open(json_filename, 'r') as fin:
	print(fin.read(), end="")
```
