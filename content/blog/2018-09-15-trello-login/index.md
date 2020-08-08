---
date: "2018-09-15"
title: "Trello authentication in React-Native"
tags: [javascript, react, react-native, trello]
redirect_from:
  - /2018/09/15/trello-authentication-in-react-native/
---

If you'll ever find yourself needing to use Trello's APIs on React-Native you'll quickly realize that to do so you'll first have to go through the [Trello authentication process to obtain an authentication token](https://developers.trello.com/page/authorization).

There are currently two different ways to authorize a client and receive an authentication token: the first is via the Trello's official authorize route, the second is via basic OAuth1.0.
Using the basic OAuth solution is probably the safest way to obtain an API token but the former might be enough for smaller applications (making sure the obtained authentication tokens are not shared publicly).

Authorizing a user using Trello's official authorization route consists in showing to the user the Trello login webpage and, once the user login succeeds, intercept the authentication token.

Before doing so though you'll need a Trello API key. Every Trello user is given an API key. You can retrieve your API key by logging into Trello and visiting https://trello.com/app-key/.

# Setting up the Trello login page

Once you obtained a Trello API key, showing the Trello login webpage can be easily achieved with a bit of HTML + [the Trello JS client](https://developers.trello.com/docs/clientjs):

```html
<html>
  <head>
    <script
      src="https://code.jquery.com/jquery-3.3.1.min.js"
      integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
      crossorigin="anonymous"
    ></script>
    <script src="https://api.trello.com/1/client.js?key=[YOUR_API_KEY]"></script>
  </head>

  <body>
    <script>
      var authorize = function () {
        window.Trello.authorize({
          type: "redirect",
          persist: true,
          interactive: true,
          name: "Trello login example",
          scope: {
            read: "true",
            write: "true",
          },
          expiration: "never",
          success: function () {
            var trelloToken = localStorage.getItem("trello_token");
            alert("User login success, auth token: " + trelloToken);
          },
          error: function () {
            alert("Authentication failure");
          },
        });
      };
      authorize();
    </script>
  </body>
</html>
```

Opening the created HTML page in your browser should show you the Trello login page and, after logging in, you should be able to see the authentication token in the alert.

Consuming the HTML page in React-Native is pretty straight forward using the [React-Native WebView](https://facebook.github.io/react-native/docs/webview):

```javascript
import React from "react";
import { View, WebView } from "react-native";
import trelloLoginWebsiteHtml from "./trelloLoginWebsite.html";

export default class TrelloLoginExample extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <WebView
          style={(styles.webView, style)}
          source={trelloLoginWebsiteHtml}
          javaScriptEnabled
        />
      </View>
    );
  }
}
```

# Send the token to React Native

The next step involves making the Trello HTML page communicate its authentication result with React-Native.  
To do so we can use the `onMessage`/`postMessage` API: with it you can send messages between the WebView and React Native by calling `postMessage` in the sender and implementing `onMessage` on the receiving side to handle the message.

```html
<html>
  <head>
    <script
      src="https://code.jquery.com/jquery-3.3.1.min.js"
      integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
      crossorigin="anonymous"
    ></script>
    <script src="https://api.trello.com/1/client.js?key=[YOUR_API_KEY]"></script>
  </head>

  <body>
    <script>
      var sendToReactNative = function (data) {
        // React-Native can only handle string messages.
        // In order to distinguish a success message from a failure one our best
        // bet is sending a stringified JSON data with a field that marks
        // the type of message (e.g.: { type: "AUTH_SUCCESS"/"AUTH_FAILURE" }).
        var stringData = JSON.stringify(data);
        window.postMessage(stringData, "*");
      };
      var authorize = function () {
        window.Trello.authorize({
          type: "redirect",
          persist: true,
          interactive: true,
          name: "Trello login example",
          scope: {
            read: "true",
            write: "true",
          },
          expiration: "never",
          success: function () {
            var trelloToken = localStorage.getItem("trello_token");
            sendToReactNative({ type: "AUTH_SUCCESS", authToken: trelloToken });
          },
          error: function () {
            sendToReactNative({ type: "AUTH_FAILURE" });
          },
        });
      };
      authorize();
    </script>
  </body>
</html>
```

```js
import React from "react";
import { Alert, View, WebView } from "react-native";
import trelloLoginWebsiteHtml from "./trelloLoginWebsite.html";

export default class TrelloLoginExample extends React.Component {
  handleWebViewMessage = (e) => {
    let data;
    try {
      data = JSON.parse(e.nativeEvent.data);
      console.log("Received webview message with type: ", data.type);
    } catch (err) {
      Alert.alert("Error", "Unable to parse webview message");
    }

    if (data.type === "AUTH_SUCCESS") {
      const authToken = data.authToken;
      // You now have the token!
    } else if (data.type === "AUTH_FAILURE") {
      Alert.alert("Error", "Authentication failed");
    } else {
      Alert.alert("Error", `Invalid webview message type: ${data.type}`);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <WebView
          style={(styles.webView, style)}
          source={trelloLoginWebsiteHtml}
          onMessage={this.handleWebViewMessage}
          javaScriptEnabled
        />
      </View>
    );
  }
}
```

And that's it, you can now use the `authToken` (received in an `AUTH_SUCCESS` message) to make Trello API calls!

# TLDR: react-native-trello-login

To make your life easier I created a small npm module that encapsulates the logic we just wrote: [react-native-trello-login](https://github.com/mmazzarolo/react-native-trello-login).  
It also has a few major improvements (e.g.: instead of hardcoding the Trello API key in the HTML file, you can simply pass it as a prop to the `<TrelloLogin />` component), so, if you're interested, I suggest you to give it a try.
