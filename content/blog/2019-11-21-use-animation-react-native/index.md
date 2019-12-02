---
date: "2019-11-21"
title: "A simple React-Native Animated hook"
tags: [programming, react, react-native]
description: A basic "useAnimation" hook for React-Native animations
---

Here's a React-Native hook that I've been using for a while to animate views trough the Animated API.

`gist:mmazzarolo/62697ec43b85b8cda1d28331ab49b9cc`

Its usage should be straightforward:

```js
import React, { useEffect } from "react";
import { View } from "react-native";
import { useAnimation } from "./useAnimation";

const FadeInOnMount: React.FC = function() {
  const fadeAnim = useAnimation();

  useEffect(() => {
    fadeAnim.setup().start();
  }, []);

  const style = {
    opacity: fadeAnim.value,
    width: 50,
    height: 50,
    backgroundColor: "red"
  };
  return <View style={style} />;
};
```

By default the animation goes from `0` to `1` using an easing-in-out timing. This settings suit 90% of my animation use cases; if I need a fine-grained control on the animation style I tweak the style interpolation.  
However, you can still manually configure the animation settings by passing your preferences to the `setup()` function.
