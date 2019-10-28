---
date: "2019-10-28"
title: "Searching Jira tickets with Alfred"
tags: [programming, automation, jira]
description: I can't stand Jira slowness, so I created an Alfred workflow to search for Jira tickets.
---

I can't stand Jira slowness.  
To me, the worst part of it is using Jira cloud's sluggish UI when I'm looking for a specific ticket.  
That's why yesterday I created an Alfred workflow to search for Jira tickets.

![](/images/jira-multi.png)

![](/images/jira-single.png)

The workflow is triggered by the **jira** keyword, followed by the search query.

You can download it [here](https://github.com/mmazzarolo/alfred-jira-search/releases/latest).

Under the hood the workflow uses the [`/rest/api/3/issue/picker`](https://developer.atlassian.com/cloud/jira/platform/rest/v3/?utm_source=%2Fcloud%2Fjira%2Fplatform%2Frest%2F&utm_medium=302#api-rest-api-3-issue-picker-get) endpoint to return a list of issues matching the Alfred query.  
It's smart enough to return a list of issues if your query is a word, or a specific issue if your query is a ticket number.

The workflow setup still has a huge margin for improvement: I haven't built an authentication flow, so it requires some manual setup (that I abstracted into two workflow environment variables).

**A `domain` variable**  
Part of the Jira URL.  
E.g. `helloworld`, for `https://helloworld.atlassian.net`.

**A `header` variable**  
HTTP header used in the API requests.  
You should add here your authentication token (JWT or cookie).  
Personally, using the cookie session token is enough for me for now.  
E.g.: `cookie:cloud.session.token=eyJraWQiOiJj...`.

I'm using the workflow on macOS.  
It also need [jq](https://stedolan.github.io/jq/) to be installed.

You can find the workflow source code [here](https://github.com/mmazzarolo/alfred-jira-search).
