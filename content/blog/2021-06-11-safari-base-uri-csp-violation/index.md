---
date: "2021-06-11"
title: "Yet another browser-specific CSP quirk: Safari and the base-uri directive"
tags: [web, csp]
description: I just discovered yet another browser-specific Content Security Policy quirk — Safari reports a violation if a <base> element is removed when a CSP base-uri directive is set on the page.
---

It might not be worth a blog post, but I couldn't find any discussion about this issue online...

I just discovered yet another browser-specific [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) quirk: in Safari, removing a [`<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base) element from a page with a [CSP `base-uri` directive](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/base-uri) causes a CSP violation — regardless of the value set in `base-uri`. 

> The `base-uri` directive restricts the URLs that can be used to specify the document base URL.

I created [a small example](https://mmazzarolo.com/content-security-policy-safari-base-uri-violation) that you can use to reproduce the issue in your browser.  
It's an HTML page served with a `base-uri 'self'` CSP, which means that only `<base>` elements pointing at the current origin are allowed.  
In the example, there's a `<base>` element pointing at a valid location (the origin), and you can validate it by checking the DevTools console, where you won't find any report of CSP violations.   

Click the "Remove base element" button in the example: a JavaScript listener will remove the `<base>` element from the page and boom: **Safari will report a CSP violation**.  

![](/images/safari-screenshot.png)

The violation is triggered and reported only in Safari.  

From my understanding of the [Content Security Policy level 2](https://www.w3.org/TR/CSP2/#directive-base-uri) spec and [the algorithm defined in the HTML5 spec to obtain a document’s base](https://www.w3.org/TR/CSP2/#parse-a-source-list), the issue should be on Safari's end: if no `<base>` element is available on the page, the document's base should fallback to the document URL (which in this case would satisfy the CSP).
