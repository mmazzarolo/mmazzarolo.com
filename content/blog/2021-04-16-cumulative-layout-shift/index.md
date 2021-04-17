---
date: "2021-04-16"
title: 'How to disable Google''s "People also search for" box'
tags: [web, chrome, google, performance]
description: Let's see how to disable the annoying "People also search for" box in Google search results. 
twitter_image: images/twitter-card.png
---

Have you ever been reading an article online when something suddenly changes on the page? Without warning, the text moves, and you've lost your place. Or even worse: you're about to tap a link or a button, but in the instant before your finger lands—BOOM—the link moves, and you end up clicking something else! 

Most of the time these kinds of experiences aren't dangerous, but they can be incredibly annoying — **just like the "People also search for" box in Google's search result**.

<div class="float-images">
<video autoplay controls loop muted playsinline>
  <source src="/videos/google-cls.mp4" type="video/mp4" />
</video>
</div>


Nowadays, this annoying behaviour is measured with a metric known as ["Cumulative Layout Shift"](https://web.dev/cls/), which is one of the core pillars of Google's [Core Web Vitals](https://web.dev/vitals/).   
And this year (2021), Core Web Vitals are starting to be used as [a signal for ranking Google Search results](https://developers.google.com/search/blog/2020/11/timing-for-page-experience). 
That's funny, isn't it?

Anyway, I hate this box.  
In this post, I just wanted to point out that I'm keeping track of a few ways you can disable the "People also search for" box in a [GitHub Gist](https://gist.github.com/mmazzarolo/34e5418aade64abe7618885e0c36d8a2).
Comments and contribution are welcome!

<br />

`gist:mmazzarolo/34e5418aade64abe7618885e0c36d8a2`

<br />
