---
date: "2019-10-19"
title: "Developing a browser extension with Create React App"
tags: [programming]
description: Create React App is a great tool for developing React applications for the web. With a couple of tweaks it can also become one of the best ways to create browser extensions.
---

Create React App is a great tool for developing React applications for the web.  
Did you know that with a couple of tweaks it can also become one of the best ways to create browser extensions?

Here's how:

### 1. Create a new app with Create React App

Let's start by creating a new React app:

```bash
npx create-react-app my-extension
```

### 2. Setup the manifest

By default Create React App creates a [Web App manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) in the `/public` dir.  
We don't need it: a browser extension requires a [WebExtension API manifest](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json), which follows a completely different standard.

Replace the content of `public/manifest.json` with your own extension manifest.  
For example:

```json
{
  "name": "My Extension",
  "version": "1.0.0",
  "manifest_version": 2,
  "browser_action": {
    "default_popup": "index.html"
  }
}
```

P.S.: While we're at it, I would also clean up the `public` dir, making sure we keep there only `manifest.json` and `index.html`.

### 3. Setup the production build step

Creating a production build of the browser extensions works _almost_ out of the box with Create React App, we have to make a small change to the `build` step.

By default, Create React App embeds an inline script into `index.html` of the production build.  
This is a small chunk of Webpack runtime logic used to load and run the application. It is embedded in your `build/index.html` file by default to save an additional network request on web apps... but it also breaks the extension usage because it goes against the its CSP (Content Security Policy).  
The easiest way to solve this issue is by turning off the inline script.

Setting the [`INLINE_RUNTIME_CHUNK`](https://facebook.github.io/create-react-app/docs/advanced-configuration) environment variable to `false` is enough to tell Create React App to not embed the script.

In your `package.json`, change your build step from:

```json
"build": "react-scripts build"
```

to

```json
"build": "INLINE_RUNTIME_CHUNK=false react-scripts build"
```

This is enough for creating a production build of your extension 👍

### 4. Setup the development environment

There's one last important step we need to take care of: setting up the development environment for our extension.  
There are several tutorials online about building browser extensions using Create React App, but I wasn't able to find one that explains you how to develop the extension without ejecting **and** without forcing you to manually refresh the extension from the browser extension page.

By mixing a few different approaches, I created a short script that you can use to get a live-reloading environment without ejecting.

First, install [the Webpack extension reloader plugin](https://github.com/rubenspgcavalcante/webpack-extension-reloader), a great plugin to automatically reload browser extensions during development:

```bash
yarn add webpack-extension-reloader --dev
```

Then, put the following script in `scripts/watch.js`.
I won't delve deep into details, but I think the comments should be enough to give you an high-level idea of what it does.

`gist:mmazzarolo/0bec410e071a39d54d780abfcf3b72e7`

And finally, add a `watch` script to your `package.json`:

```json
"watch": "./scripts/watch.js"
```

> If you're not able to run the script, try running `chmod +x ./scripts/watch.js` to make it executable.

### Start the development

That's it! 🎉
From now on you can run `yarn watch` to develop your extension with live-reloading, or `yarn build` to create a production build.

### Acknowledgments

Thanks to:

- [Hitesh Kumar](https://hiteshkumar.dev/) for [the `watch` script idea](https://smellycode.com/chrome-extension-live-reloading-with-react/)
- [Rubens Pinheiro](https://github.com/rubenspgcavalcante) for [the Webpack extension reloader plugin](https://github.com/rubenspgcavalcante/webpack-extension-reloader)
- [Nina Shahri](https://medium.com/@nrshahri?source=post_page-----324dd83fe5ff----------------------) for [this article on CSP](https://medium.com/@nrshahri/csp-cra-324dd83fe5ff)
- [JP Pincheira](https://twitter.com/restrex) for the `chmod -x` tip
