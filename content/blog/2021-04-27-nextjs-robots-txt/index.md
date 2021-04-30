---
date: "2021-04-27"
title: 'Generating a robots.txt in Next.js'
tags: [react, nextjs, web]
description: A robots.txt file tells search engine crawlers which pages or files the crawler can or can't request from your site. Next.js does not generate a robots.txt out-of-the-box, so here are a couple options on how to create it. 
---

A `robots.txt` file tells search engine crawlers which pages or files the crawler can or can't request from your site.  
Next.js does not generate a `robots.txt` out-of-the-box.  
You _can_ manually create one in the `/public` directory, but by doing so it will be used in all environments where you deploy your Next.js website — which might be problematic if you want to avoid indexing preview/testing environments. 

To generate a `robots.txt` conditionally, based on the current environment, you can either generate it on the server side or through a build script.  

Here are the two options in detail. 

## Rendering a robots.txt from a Next.js page

This is probably the "proper" Next.js way of handling this use case.  
Just create a new page in `pages/robots.txt` that dynamically returns the `robots.txt` content and Next.js will take care of making it available on the right path: 

```js
import React from 'react';

const crawlableRobotsTxt = `User-agent: *\nAllow: /`;

const uncrawlableRobotsTxt = `User-agent: *\nDisallow: /`;

class Robots extends React.Component {
  public static async getInitialProps({ res }) {
    res.setHeader('Content-Type', 'text/plain');
    // Return a non-crawlable robots.txt in non-production environments
    res.write(process.env.VERCEL_ENV === "production"
      ? crawlableRobotsTxt
      : uncrawlableRobotsTxt
    );
    res.end();
  }
}

export default Robots;
```

One drawback of this approach is that using `getInitialProps` (or `getServerSideProps`) disables [Automatic Static Optimization](https://nextjs.org/docs/api-reference/data-fetching/getInitialProps) and doesn't allow generating a static page (it works only on dynamic pages using Server Side Rendering).  

## Generating a robots.txt in the build process

Alternatively, we can generate the `robots.txt` directly in the build process with a small Node.js script (e.g.: `scripts/generate-robots-txt.js`):

```js
const fs = require("fs");

const crawlableRobotsTxt = `User-agent: *\nAllow: /`;

const uncrawlableRobotsTxt = `User-agent: *\nDisallow: /`;

function generateRobotsTxt() {
  // Create a non-crawlable robots.txt in non-production environments
  const robotsTxt =
    process.env.VERCEL_ENV === "production"
      ? crawlableRobotsTxt
      : uncrawlableRobotsTxt;

  // Create robots.txt file
  fs.writeFileSync("public/robots.txt", robotsTxt);

  console.log(
    `Generated a ${
      process.env.VERCEL_ENV === "production" ? "crawlable" : "non-crawlable"
    } public/robots.txt`
  );
}

module.exports = generateRobotsTxt;
```

You can then run `scripts/generate-robots-txt.js` by invoking it in a `prebuild` script from your `package.json`:

```json
{
  "scripts": {
    "prebuild": "scripts/generate-robots-txt",
    "build": "next build",
  },
}
```

Or by invoking it during the Webpack build step in `next.config.js`:

```js
module.exports = {
  webpack(config, { isServer }) {
    if (isServer) {
      generateRobotsTxt();
    }
    return config;
  },
};
```

For what is worth, ☝ this is the approach I'm currently using in [Remotebear](https://remotebear.io) (source code [here](https://github.com/remotebear-io/remotebear/tree/master/packages/website)).

> You'll probably want to add `public/robots.txt` to your `.gitignore`: since this is generated on each build, there's no need to commit it anymore. 
