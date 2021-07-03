---
date: "2021-06-06"
title: "Creating a serverless function to scrape web pages metadata"
tags: [web, vercel, api, node]
description: Nowadays, most websites provide metadata about their content directly in the HTML markup. This post will show you how to create a Vercel serverless function to scrape this data using Metascraper.
---

Nowadays, most websites provide metadata about their content directly in the HTML markup.  
This post will show you how to create a Vercel serverless function to scrape this data using [Metascraper](https://metascraper.js.org/#/).  

## Metascraper overview

[Metascraper](https://metascraper.js.org/#/) is a rule-based system that allows searching over a website content according to a series of rules. It is distributed as [an open-source Node.js library](https://github.com/microlinkhq/metascraper). 

> Metascraper is baked by [Microlink](https://microlink.io), which uses it internally in its browser automation product.

## Project overview

You can use Metascraper in any Node.js application.  
In my opinion, the most convenient way to use it is within a small Node.js server that, given an input URL, will return structured metadata about the target webpage as output.  
The idea is to create an API that:
- Exposes a route that you can use to scrape websites metadata (e.g.: `api/scrape`).
- Checks that a valid URL has been passed as a parameter (e.g.: as a `?url` query-parameter). 
- Fetches the content of the website.
- Invokes Metascraper with the website content to extract the metadata.
- Returns the metadata encoded as `json` in the response body. 

## Setting up a Vercel API project

Given that the goal of this Node.js server is very well-scoped and that we don't expect requests to take a long time to run, this is an excellent fit for deploying it as a serverless/lambda function.  
I'll use [Vercel to deploy a serverless function](https://vercel.com/docs/serverless-functions/introduction), but you can do the same on any other serverless API provider that supports Node.js (e.g., AWS Lambda, Firebase, Netlify, etc...).  
Get started by creating a project directory, `cd` into it, and initialize it using npm:

```bash
mkdir url-metadata-scraper && cd url-metadata-scraper
npm init
```

Next, install [`vercel`](https://github.com/vercel/vercel) as a devDependency:

```bash
npm install -D vercel 
```

And update your start script in your `package.json` to `"start": "vercel dev"`to run your serverless function locally.  

Finally, create an `api` directory and a `scrape.js` file inside of it:

```bash
mkdir api && touch api/scrape.js
```

```javascript
// api/scrape.js
// In Vercel, any file inside the folder "/api" is mapped to "/api/*" and 
// will be treated as an API endpoint.


// For an API route to work, you need to export a function as default (a.k.a request handler),
// which then receives the following parameters:
// - req: The request object.
// - res: The response object.
// See https://vercel.com/docs/serverless-functions/supported-languages#node.js for details.
export default async function handler(req, res) {
  res.status(200).send(`Hello world!`)
}
```

You should now be able to run deploy your code to Vercel (of course, we haven't added any "real" logic in `api/scrape.js`, so it won't do anything now).  
My go-to approach on these occasions is to [create a GitHub repo and connect it to Vercel](https://vercel.com/docs/git/vercel-for-github) so that it will take care of automatically deploying the project on each commit — but [you can also do it manually if you prefer](https://vercel.com/docs).  

## Creating the scraping logic

Let's start working on the scraping logic.  

First of all, we'll use the [got npm package](https://github.com/sindresorhus/got#readme) to fetch the website content (feel free to use any other fetching library), and the [metascraper npm package](https://github.com/microlinkhq/metascraper) to extract the metadata:

```bash
npm i got metascraper
```

Metascraper uses "rules bundles" to extract the metadata. Rules bundles are a collection of HTML selectors around a determinate property.  
The metascraper npm package doesn't include any rule bundle out of the box, so you'll need to install each one you need manually.  
You can check the ["Rules Bundles" section of the metascraper docs](https://github.com/microlinkhq/metascraper#rules-bundles) to see a list of available bundles.  
To make sure we extract as much metadata as we can, let's add (almost) all of them:
```
npm i metascraper-amazon metascraper-audio metascraper-author metascraper-clearbit metascraper-date metascraper-description metascraper-image metascraper-instagram metascraper-lang metascraper-logo metascraper-logo metascraper-publisher metascraper-readability metascraper-soundcloud metascraper-spotify metascraper-telegram metascraper-title metascraper-url metascraper-video metascraper-youtube
```

We're now ready to set up our API logic in `api/scrape.js`.  
For the sake of simplicity, here's the entire code (with comments):

```javascript
// api/scrape.js
// In Vercel, any file inside the folder "/api" is mapped to "/api/*" and 
// will be treated as an API endpoint.

const { parse } = require("url");
const got = require("got");
// Initialize metascraper passing in the list of rules bundles to use.
const metascraper = require("metascraper")([
  require("metascraper-amazon")(),
  require("metascraper-audio")(),
  require("metascraper-author")(),
  require("metascraper-date")(),
  require("metascraper-description")(),
  require("metascraper-image")(),
  require("metascraper-instagram")(),
  require("metascraper-lang")(),
  require("metascraper-logo")(),
  require("metascraper-clearbit-logo")(),
  require("metascraper-logo-favicon")(),
  require("metascraper-publisher")(),
  require("metascraper-readability")(),
  require("metascraper-spotify")(),
  require("metascraper-title")(),
  require("metascraper-telegram")(),
  require("metascraper-url")(),
  require("metascraper-logo-favicon")(),
  require("metascraper-amazon")(),
  require("metascraper-youtube")(),
  require("metascraper-soundcloud")(),
  require("metascraper-video")(),
]);


// For an API route to work, you need to export a function as default (a.k.a request handler),
// which then receives the following parameters:
// - req: The request object.
// - res: The response object.
// See https://vercel.com/docs/serverless-functions/supported-languages#node.js for details.
export default async function handler(req, res) {
  // Parse the "?url" query parameter.
  const targetUrl = parse(req.url, true).query?.url;

  // Make sure the provided URL is valid.
  if (!targetUrl) {
    res
      .status(401)
      .send('Please provide a valid URL in the "url" query parameter.');
    return;
  }

  try {
    // Use the got library to fetch the website content.
    const { body: html, url } = await got(targetUrl);
    // Extract the metadata from the website content.
    const metadata = await metascraper({ html, url });
    // The Vercel Edge Network can cache the response at the edge in order to 
    // serve data to your users as fast as possible.
    // Here we're caching the response at the edge for 1 hour.
    // See https://vercel.com/docs/edge-network/caching for details.
    res.setHeader("Cache-Control", "s-maxage=3600");    
    // Make this API publicly accessible. 
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Return the metadata as JSON
    res.status(200).json(metadata);
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: `Unable to scrape "${url}".` });
  }
}
```

That's it.  
By running `npm start` (or deploying your code) and calling the `/api/scrape` endpoint with a valid URL in the `url` query parameter, you should get a JSON response with the webpage metadata.

For example, `http://localhost:3000/api/scrape?url=https://google.com` should return:

```json
{
  "lang": "en",
  "author": null,
  "title": "Google",
  "publisher": null,
  "image": "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
  "audio": null,
  "date": null,
  "description": "Search the world’s information, including webpages, images, videos and more. Google has many special features to help you find exactly what you’re looking for.",
  "video": null,
  "logo": "https://logo.clearbit.com/www.google.com",
  "url": "https://www.google.com/"
}
```

You can find the entire source code of this project [on GitHub](https://github.com/mmazzarolo/url-metadata-scraper) — feel free to fork it or give it a try!

## Bonus: m3u8 support

The `metascraper-video` package depends on the [`is-video`](https://github.com/sindresorhus/is-video) package to determine if a <meta> tag contains a valid video URL, and `is-video` depends on the [`video-extensions`](https://github.com/sindresorhus/video-extensions) package that holds a list of valid video extensions.  
Unfortunately, the `video-extensions` package hasn't been updated in a while now, so it doesn't support the `m3u8` video extension (which is a popular video extension on the web nowadays).  
Until [this pull request](https://github.com/sindresorhus/video-extensions/pull/5) is released and `is-video` is updated to use the latest version of `video-extensions`, you can use [`patch-package`](https://github.com/ds300/patch-package) with the following diff to manually patch the `m3u8` support into `video-extensions` (by putting it into `patches/video-extensions+1.1.0.patch`).  

```diff
diff --git a/node_modules/video-extensions/video-extensions.json b/node_modules/video-extensions/video-extensions.json
index 0ad84d7..a115959 100644
--- a/node_modules/video-extensions/video-extensions.json
+++ b/node_modules/video-extensions/video-extensions.json
@@ -8,6 +8,7 @@
  "drc",
  "flv",
  "m2v",
+ "m3u8",
  "m4p",
  "m4v",
  "mkv",
```
