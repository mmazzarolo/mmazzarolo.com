---
date: "2019-12-27"
title: "Browse and open VSCode projects using Alfred"
tags: [macos, utility, alfred, productivity]
description: Here's an Alfred workflow that you can use to browse and open VSCode projects (or any other IDE projects).
---

Here's an Alfred workflow that you can use to browse and open VSCode projects (or any other IDE projects).  
It returns a list of projects available from a list of paths that you can specify in its configuration.

![](/images/screenshot.png)

Since the code required to run it is minimal, I'm not sharing the compiled workflow, but you can build it this way:

### 1. Create a "Script Filter" input:

![](/images/script-filter.png)

```bash
python -c '
import os, json
paths = [
	"/Users/matteomazzarolo/workspace-personal"
]
output = { "items": [] }
for path in paths:
  file_name_list = os.listdir(path)
  for file_name in file_name_list:
    file_full_path = path + "/" + file_name
    if (os.path.isdir(file_full_path)):
      output["items"].append({ "title": file_name, "subtitle": file_full_path, "arg": file_full_path })
print json.dumps(output)
'
```

The `paths` variable is a list of paths where you have your projects.

### 2. Create a "Run Script" action:

![](/images/run-script.png)

```bash
path=$1
# Change this to whatever IDE you want to use
open -a "Visual Studio Code" $path
```

![](/images/flow.png)

Et voilà, you can now use Alfred to browse and open your VSCode projects.

> Yeah... this workflow can be optimized in several ways (e.g.: using env vars instead of hardcoded paths), but it is working good enough for my use case.
