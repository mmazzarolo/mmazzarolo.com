---
date: "2020-08-08"
title: "Serverino: tiny CLI-based static server"
tags: [server, node, open-source, productivity]
description: I recently released Serverino, a tiny CLI-based static server.
---

I recently released [Serverino](https://github.com/mmazzarolo/serverino), a tiny CLI-based static server.
Why should you try Serverino instead of the other five thousand static server alternatives?
Mainly because thanks to locally-trusted development certificates it can host your static content on https://localhost out of the box.

If you use [npx](https://blog.npmjs.org/post/162869356040/introducing-npx-an-npm-package-runner), you can run Serverino with a single command without installing it: `npx serverino`.

Check its [GitHub](https://github.com/mmazzarolo/serverino) page for all the available options.

> Serverino is inspired by [Zeit's Serve](https://github.com/zeit/serve) and is powered by [Express](https://expressjs.com/) and [https-localhost](https://github.com/daquinoaldo/https-localhost).
