---
date: "2018-10-08"
title: "Styling the React Native TextInput on Android"
tags: [programming, javascript, react, react-native]
redirect_from:
  - /2018/10/08/styling-the-react-native-textinput-on-android/
---

This is how a React Native TextInput looks like on Android if you don’t apply any custom style on it:

![](/images/initial-state.png)

Can we safely say that nobody will ever ship a production app with such a TextInput?

Specifying the `height` (I’d say `height: 40`) on the component’s style should be the first thing to do here:

![](/images/with-height.png)

Ok, that’s better, but for some reasons the Email placeholder is slightly misaligned. We can fix it by adding a `paddingLeft` of `6` to its `style`:

![](/images/with-padding.png)

It looks nice now!

…until you focus it and you notice that its underline color and cursor color is green.

![](/images/underline-default.gif)

> The default color (green) is defined in the Android theme and can be changed with a few lines of native code… but let’s keep this discussion for another post.

Of course everybody loves green but what if the main theme color of my app is blue?

Well, the official React Native TextInput documentation says that we can specify our color in the `selectionColor` and `underlineColorAndroid` props:

![](/images/underline-blue.gif)

Hm… Am I the only one who didn’t expect this behaviour? Why is the underline color blue even when the field is not focused?

Don’t get me wrong, I actually prefer this behaviour because now I know that I can programmatically change the underline color… but it is still different from the default one 🤷‍♀️

Oh, whatever, let’s customize it for the last time by turning it blue (`#428AF8`) only when focused. While we’re at it, we may as well change the underline color to light gray (`#D3D3D3`, the same color of the placeholder) when the input is not focused.

To do so our TextInput must be aware of being focused and then change its `underlineColorAndroid`accordingly; I would suggest creating a custom TextInput (let’s call it `MyTextInput`) which will be smart enough to keep track of its focus state:

```javascript
import * as React from "react";
import { StyleSheet, TextInput } from "react-native";

const BLUE = "#428AF8";
const LIGHT_GRAY = "#D3D3D3";

class MyTextInput extends React.Component {
  state = {
    isFocused: false
  };

  handleFocus = event => {
    this.setState({ isFocused: true });
    // Remember to propagate the `onFocus` event to the
    // parent as well (if set)
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  handleBlur = event => {
    this.setState({ isFocused: false });
    // Remember to propagate the `onBlur` event to the
    // parent as well (if set)
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  render() {
    const { isFocused } = this.state;
    // We want to change the color of the input underline
    // when it is focused. To do so this component
    // must be aware of being focused, so we'll use the
    // TextInput `onFocus` and `onBlur` callbacks to set
    // a variable in the state that keeps track of when the
    // TextInput is focused.
    // We should also make sure to remove the `onFocus` and
    // `onBlur` props from the `...otherProps`, otherwise
    // they would override our own handlers.
    const { onFocus, onBlur, ...otherProps } = this.props;
    return (
      <TextInput
        selectionColor={BLUE}
        underlineColorAndroid={isFocused ? BLUE : LIGHT_GRAY}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        style={styles.textInput}
        {...otherProps}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    paddingLeft: 6
  }
});

export default MyTextInput;
```

And here is the result:

![](/images/result.gif)

That’s it 🎉!

You can now enhance the TextInput as much as you want, for example by passing the red color to theunderlineColorAndroid prop when the input is not valid or by adding a bit of color to an input icon when the input is focused.

- [Expo snack of MyTextInput](https://snack.expo.io/SJFUngI5X)
- [MyTextInput gist](https://gist.github.com/mmazzarolo/77407406eea9a574c060662ab1bcac1f)
- [MyTextInput gist (TypeScript version)](https://gist.github.com/mmazzarolo/1966b9333ed5c6b4fd0be3ec6bcdb1df)

> Disclaimer: The default style of the React Native TextInput has been tested on a few flagship devices on recent versions of Android… but you already know that the result may vary depending on the device used.
