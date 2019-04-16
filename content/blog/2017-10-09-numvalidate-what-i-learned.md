---
date: "2017-10-09"
title: "NumValidate: open source phone number validation REST API"
tags: [node, koa, react, next, auth0, stripe]
---

I recently published [NumValidate](https://numvalidate.com), a fully featured open source phone number validation REST API service.

![](https://github.com/mmazzarolo/numvalidate/raw/master/.github/website-screenshot.png)

NumValidate might not be a big project, but from my point of view it can be used as an example of how you can build a “complete” application from the ground up using modern Javascript.

In this post I'll try to highlight some features of NumValidate and to share what I learned while working on it.  
The complete repository is available on [GitHub](https://github.com/mmazzarolo/numvalidate).

Here is a small overview of NumValidate:

- Plain simple phone number validation rest API, powered by [Google LibPhoneNumber](https://github.com/googlei18n/libphonenumber) and [documented](https://github.com/mmazzarolo/numvalidate-docs) with [Slate](https://github.com/lord/slate)
- Server-side rendered responsive React website/landing-page (~160kb GZipped) using [NextJS](https://github.com/zeit/next.js/)
- Private API tokens generation and management for authenticated users through the Dashboard
- Fully featured authentication for accessing the Dashboard: email + password, Github and Google login thanks to [Auth0](https://auth0.com/)
- API requests with different rate limits for unauthenticated user, free user and pro user, updated in real time after a subscription change
- Rate limits can be increased by subscribing to a paid account: The secure payment is handled by [Stripe](https://stripe.com) and its settings can be changed at any given time
- API tokens cached with Redis for faster response time on consecutive requests
- Production ready logging and error reporting using Winston, [Sentry](https://sentry.io) and [Papertrail](https://papertrailapp.com/)

That’s it!  
If you’re interested in the setup of the project and in the more technical details you should also take a look at [the README on GitHub](https://github.com/mmazzarolo/numvalidate).

> P.S.: As you may already have noticed by [the small size of the validation-related code](https://github.com/mmazzarolo/numvalidate/blob/master/server/routes/api.js), I didn’t even start working on NumValidate with the aim of validating phone numbers: I was more interested in a way to distribute an API using api-tokens and paid subscriptions, which has indeed been the most fun part of the project.
