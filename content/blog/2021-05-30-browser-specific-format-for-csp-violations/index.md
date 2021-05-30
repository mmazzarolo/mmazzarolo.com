---
date: "2021-05-30"
title: "Content Security Policy violation inconsistencies across different browsers"
tags: [web, csp]
description: I recently learned that Content Security Policy (CSP) violations are reported differently depending on the browser being used, so I created a small webpage to test these differences.
---

I recently learned that [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) violations are reported differently depending on the browser being used.  

To demonstrate the violation differences, I created [an example HTML file](/content-security-policy-violation-examples/external-script) with the following CSP: 
```
script-src 'unsafe-inline';
``` 
This CSP allows only the use of inline resources, such as inline `<script>` elements, inline event handlers, and inline `<style>` elements.  
In the example, I'm loading an external script (`<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js">`) to force a [SecurityPolicyViolationEvent](https://developer.mozilla.org/en-US/docs/Web/API/SecurityPolicyViolationEvent) and I'm showing its details by listening to `securitypolicyviolation` events.  

> You can also use [this other example](/content-security-policy-violation-examples/external-script) to test an "eval" clause violation.

You can try opening it on multiple browsers to see how the event is implemented differently across them. 

The main differences I noticed by running the examples in Chrome (`v90.0.4430.212`), Safari (`v14.1`), and Firefox (`v88.0.1`) are the following.

**`blockedURI`**

URI of the resource that was blocked because it violates a policy.  
- In Chrome and Firefox, it's the full URI of the resource. In the example, this is `https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js`. 
- In Safari, it's the origin of the resource. In the example, this is `https://ajax.googleapis.com`.

**`disposition`**

How the violated policy is configured to be treated by the user agent. This should be `enforce` or `report`.  
In Safari, this is not implemented yet, so it's always `undefined`.

**`originalPolicy`**

Policy whose enforcement uncovered the violation.  

**`effectiveDirective`**

Directive whose enforcement uncovered the violation.  
To me, this is the biggest difference in violation even implementation. 
- In Firefox and Safari, this is the policy directive that was violated. In the example, this is `script-src`. 
- In Chrome, this is the most "specific" directive that was violated. In the example, this is `script-src-elem` — even if we haven't declared this directive — because this is where the violation would have occurred if such directive was present in the policy. 

**`violatedDirective`**

Directive whose enforcement uncovered the violation. Following the [CSP3 spec](https://www.w3.org/TR/CSP3/), this is "A copy of the `effective-directive` property, kept for historical reasons".  
It's still interesting to notice that:
- In Chrome and Firefox, this is the policy directive that was violated. In the example, this is `script-src`. 
- In Safari, this is the directive and the value that were violated. In the example, this is `script-src 'unsafe-inline'`.

