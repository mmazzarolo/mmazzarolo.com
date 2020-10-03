# Service Workers Tips

## Reloading a service worker

Reloading a page won't update/remove the previous version of its service worker.
To make sure you're using the latest version of your service worker, make sure to check the "Update on reload" toggle in the "Application" ⭢ "Service Workers" section of the Chrome DevTools.

## Simulate a network condition

To simulate a network condition (e.g.: offline, 3g, etc...) in a service worker on Chrome, uncheck the "Update on reload" toggle.

> Not sure why this needs to be done, but a few cases when the toggle was checked and I was simulating an offline mode the service worker was still going through the network.

## Service workers don't intercept other service worker registration events

Service workers can't intercept network requests made by the `navigator.serviceWorker.register('sw.js)` API. So you shouldn't worry about service workers caching themselves.

## Testing exceeded quota errors on service workers

Each browser has a different limit on the cache storage available for a service worker.
On desktop browsers, it will be based on the percentage of available space on disk, so testing (in development) what happens when the cache quota exceeds can be tricky.

A possible workaround is:

1. Use Chrome in incognito mode, which has a hard limit of 100mb.
2. Manually cache huge assets (e.g.: 8k resolution images).
3. Watch the quota exceed.

## Service workers don't run in Firefox private mode

In Firefox, Service Worker APIs are hidden and cannot be used when the user is in [private browsing mode](https://support.mozilla.org/en-US/kb/private-browsing-use-firefox-without-history).

## Service workers registration fails on Firefox if cookies are disabled or set to be cleared on quit

Registering a Service Worker in Firefox [throws a "The operation is insecure." exception if cookies are disabled or set to be cleared on quit](https://stackoverflow.com/q/49539306).

## Service workers and Chrome incognito mode

You may find it useful to test your service worker in an Incognito window so that you can close and reopen knowing that the previous service worker won't affect the new window. Any registrations and caches created from within an Incognito window will be cleared out once that window is closed.

That said, please keep in mind that [single incognito tabs and windows are not sandboxed](https://bugs.chromium.org/p/chromium/issues/detail?id=24690), so if you have two different incognito windows opened at the same time, they'll share cookies, storage data, and service workers.

## Shift-reload

[If you force-reload the page (shift-reload) it bypasses the service worker entirely.](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#shift-reload) It'll be uncontrolled. This feature is in the spec, so it works in other service-worker-supporting browsers.

## Serving a service worker on immutable paths

[It's against best practices to use an immutable path for service workers](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#avoid-url-change) (e.g.: if the service worker has a hash in its name).
That said, if you're not using the service worker to cache the HTML that serves it, you shouldn't have to worry about it.

## How often is a service worker updated

A service worker will update every 24 hours or when all pages/instances are closed.

## Keep a no-op service worker handy

If you don't want to leave your users running a buggy service worker code while you take the time to work out a solution, it's a good idea to keep a simple, [no-op](https://en.wikipedia.org/wiki/NOP) service-worker.js handy, like the following:

```js
// A simple, no-op service worker that takes immediate control.

self.addEventListener("install", () => {
  // Skip over the "waiting" lifecycle state, to ensure that our
  // new service worker is activated immediately, even if there's
  // another tab open controlled by our older service worker code.
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  // Optional: Get a list of all the current open windows/tabs under
  // our service worker's control, and force them to reload.
  // This can "unbreak" any open windows/tabs as soon as the new
  // service worker activates, rather than users having to manually reload.
  self.clients.matchAll({ type: "window" }).then((windowClients) => {
    windowClients.forEach((windowClient) => {
      windowClient.navigate(windowClient.url);
    });
  });
});
```

Related post on StackOverflow [here](https://stackoverflow.com/a/38980776).

## Get the "client" sender instance from a postMessage

In a service worker message listener, `event.source` is the [client](https://developer.mozilla.org/en-US/docs/Web/API/Clients) instance of the sender.

```js
self.addEventListener("message", (event) => {
  const senderClient = event.source;
  // This allows you (for example) to easily send back a message to the client.
  senderClient.postMessage("👋");
});
```

## Clean old cache

It's a good idea to version the service worker cache by hardcoding a version number in the service worker. You can then bump it whenever you want to clear the old cache (e.g.: because you added a new caching logic).

Here's an example of how you can clean your cache (using [Workbox](https://github.com/GoogleChrome/workbox)):

```js
import { cacheNames } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

const SERVICE_WORKER_VERSION = "v1"; // Bump it manually when needed.

const caches = [
  {name: 'images', matcher: new RegExp('/static/images')},
  {name: 'fonts', matcher: new RegExp('/static/fonts')}
];

caches.forEach({name, matcher} => {
  registerRoute(
    matcher,
    new CacheFirst({ cacheName: `${name}-${SERVICE_WORKER_VERSION}` })
  )
});

self.addEventListener('activate', (event) => {
  async function cleanupOldCaches() {
    // Keep caches supported by the current version of the service worker
    const cachesToKeep = caches.map(({ name }) => `${name}-${SERVICE_WORKER_VERSION}`);
    // Also keep caches that Workbox uses internally
    cachesToKeep.push(cacheNames.precache, cacheNames.runtime, cacheNames.googleAnalytics);
    const allCaches = await caches.keys();
    const cachesToCleanup = allCaches.filter((cache) => !cachesToKeep.includes(cache));
    for (const cacheToCleanup of cachesToCleanup) {
      // Delete the cache
      await caches.delete(cacheToCleanup);
      // Delete the IDB cache expiration informations used by Workbox.
      // See this comment on why we need to set "maxEntries" to 1:
      // https://github.com/GoogleChrome/workbox/issues/2234
      const cacheExpiration = new CacheExpiration(cacheToCleanup, { maxEntries: 1 });
      cacheExpiration.delete();
    }
  }
  // Keep the service worker alive until all caches are deleted.
  event.waitUntil(cleanupOldCaches());
});
```

Related discussion in the Workbox repo [here](https://github.com/GoogleChrome/workbox/issues/2234).
