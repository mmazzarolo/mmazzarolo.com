---
date: "2019-11-20"
title: "React-Native cross-platform shadows"
tags: [programming, react, react-native]
description: A set of cross-platform React-Native elevation definitions to make your components shadow look the same on iOS and Android.
---

Here's a set of cross-platform React-Native elevation/shadow definitions.

Why should you use them? To provide the same user shadow settings on iOS and Android.

`gist:mmazzarolo/84b36e89180a9ba22a32de5cdf813eb7`

You can use them this way:

```js
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { elevations } from "./elevations";

const ElevatedView: React.FC = function () {
  return (
    <View style={styles.root}>
      <Text>👋! My shadow now looks the same on iOS and Android</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    // Assuming you want a shadow that looks like and Android elevation of 2:
    ...elevations[2],
  },
});
```
