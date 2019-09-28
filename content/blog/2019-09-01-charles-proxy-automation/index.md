---
date: "2019-09-01"
title: "Charles Proxy automation"
tags: [programming]
description: Automating Charles usage trough the CLI
twitter_image: images/twitter-card.jpg
redirect_from:
  - /2019/09/01/charles-proxy-automation
---

<img src="images/featured-image.jpg" style="width:40%;" />

[Charles Proxy](https://www.charlesproxy.com) is fantastic a cross-platform HTTP/HTTPS debugging proxy server application, probably the most user friendly of its genre. Its initial setup is painless and it can be configured trough a nice user interface.

I've recently started to use it a lot more than what I was used to at my daily job, so today I've spent some time checking in what way the Charles usage can be automated trough a command line interface.

> Being cross-platform, Charles is compatible with MacOS, Linux and Windows. The instructions shown in this post are based on MacOS, so if you're planning to follow it on another OS they might need some minor adjustments.

<br />

`gist:mmazzarolo/5eb88f68865a7bf9c2ec99b16286435b`

<br />

### 2019-10-07 update:

After publishing this post I got in touch with [@charlesproxy on Twitter](https://twitter.com/charlesproxy) to start a discussion about what we can do to allow editing settings (e.g.: adding new rewrite rules) trough the CLI:

https://twitter.com/charlesproxy/status/1170108587978313728
