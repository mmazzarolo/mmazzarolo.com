---
date: "2020-11-15"
title: "Media queries of <source> elements should be used only in <picure> elements"
tags: [web, programming]
description: You should set the media attribute of a <source> element only inside <picture> elements. So you can't switch a <video> source based on the preferred color scheme for dark/light mode support.
---

TL;DR: [You should set the `media` attribute of a `<source>` element only inside `<picture>` elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source). So you can't switch a `<video>` source based on the preferred color scheme for dark/light mode support.

---

A neat use case of the `media` attribute on a `<source>` element is to toggle images based on the [preferred colors scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme).

```html
<picture>
  <source srcset="dark.png" media="(prefers-color-scheme: dark)" />
  <img src="light.png" />
</picture>
```

> A nice plus of this approach is that there won't be any waste of bandwidth: the browser will download only the image associated with the current theme.

Unfortunately, you can't use the `media` attribute on `<video>` sources — it would get ignored in most major browsers.

```html
<!-- Won't work -->
<video>
  <source
    src="dark.mp4"
    type="video/mp4"
    media="(prefers-color-scheme: dark)"
  />
  <source src="light.mp4" type="video/mp4" />
</video>
```

So you'll still need to do it with some CSS (or JS).

```html
<video class="dark" src="dark.mp4" />
<video class="light" src="light.mp4" />

<style>
  .light {
    display: block;
  }

  .dark {
    display: none;
  }

  @media (prefers-color-scheme: dark) {
    .light {
      display: none;
    }

    .dark {
      display: block;
    }
  }
</style>
```
