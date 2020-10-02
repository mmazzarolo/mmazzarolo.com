# Offline testing

Not sure if it's an well-known thing... but to simulate an offline network condition while working on a service worker on Chrome I had to uncheck "Update on reload" because the service worker was still going trough the network (just in a few cases) while it was checked.

![](./images/service-workers-offline-update-on-reload)
