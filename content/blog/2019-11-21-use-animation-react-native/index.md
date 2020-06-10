---
date: "2019-11-21"
title: "A simple React-Native Animated hook"
tags: [programming, react, react-native]
description: A basic "useAnimation" hook for React-Native animations
---

Here's a React-Native hook that I've been using for a while to animate views trough the Animated API.

```js
import { useRef } from "react";
import { Animated, Easing } from "react-native";

export const useAnimation = function (initialValue: number = 0) {
  const endValue = initialValue === 0 ? 1 : 0;
  const animationValueRef =
    useRef < Animated.Value > new Animated.Value(initialValue);

  const setup = (config: Partial<Animated.TimingAnimationConfig> = {}) =>
    Animated.timing(animationValueRef.current, {
      toValue: endValue,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.quad),
      ...config,
    });

  return {
    value: animationValueRef.current,
    setup: setup,
  };
};
```

Its usage should be straightforward:

```js
import React, { useEffect } from "react";
import { View } from "react-native";
import { useAnimation } from "./useAnimation";

const FadeInOnMount: React.FC = function () {
  const fadeAnim = useAnimation();

  useEffect(() => {
    fadeAnim.setup().start();
  }, []);

  const style = {
    opacity: fadeAnim.value,
    width: 50,
    height: 50,
    backgroundColor: "red",
  };
  return <View style={style} />;
};
```

By default the animation goes from `0` to `1` using an easing-in-out timing. These settings suit 90% of my animation use cases; if I need a fine-grained control on the animation style I tweak the style interpolation.  
However, you can still manually configure the animation settings by passing your preferences to the `setup()` function.
