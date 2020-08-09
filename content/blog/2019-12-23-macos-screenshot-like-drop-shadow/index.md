---
date: "2019-12-23"
title: "Apply a MacOS-like drop shadow to any image"
tags: [macos, utility]
description: The MacOS screenshot utility adds a nice drop shadow to your screenshots. Here's how you can apply a similar drop shadow to any image using ImageMagick.
---

The MacOS screenshot utility adds a nice drop shadow to your screenshots.

![](/images/screenshot.png)

You can apply a similar drop shadow to any image using [ImageMagick](https://imagemagick.org/index.php).

Make sure ImageMagick is installed:

```bash
brew install imagemagick
```

Then, run:

```bash
convert screenshot-without-shadow.png \( +clone -background black -shadow 80x20+0+15 \) +swap -background transparent -layers merge +repage screenshot-with-shadow.png
```

That's it!

Source: [Stephen's Java Adventures](http://javaadventure.blogspot.com/2011/10/how-to-add-mac-like-shadow-to-your.html).
