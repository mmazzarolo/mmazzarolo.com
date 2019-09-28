---
date: "2017-03-06"
title: "Middlewares: The underrated Redux strength"
tags: [react, react-native, redux, javascript]
redirect_from:
  - /2017/03/06/middlewares-the-underrated-redux-strength/
---

In this post I'd like to talk a bit about what I think is a key feature of Redux that is not discussed enough: its middlewares.

## What's a Redux middleware?

Quoting the Redux docs:

_A Redux middleware provides a third-party extension point between dispatching an action, and the moment it reaches the reducer. People use Redux middleware for logging, crash reporting, talking to an asynchronous API, routing, and more._

Simply put: You can think of a Redux middleware as a simple function that runs whenever you dispatch an action, before it gets handled by a reducer.

This function can use this three parameters:

- **store**: The store instance, so that you can call `getState()` on it and obtain the current store state;
- **action**: The action that is being dispatched, the one that triggered the middleware;
- **next**: A function that when its called it passes the execution to the next middleware.

## Why should I use a Redux middleware?

You should use Redux middlewares because they're probably the most powerful, flexible and testable place to put your custom logic and side-effects.

Just think about it: If you're treating Redux as the single source of truth of your application, then the middleware's `store` and the `action` parameters alone are more then enough to **control your entire application logic**.

Another strong point in favor of Redux middlewares is that they can be chained and called
sequentially until the action finally reach the reducer.

## How do I write a Redux middleware?

I can't stress this enough: Even if there are already many different middlewares already available on npm (which is one of the reason Redux is so strong right now) you can and **you should** create your own middlewares.

The Redux documentation [on middlewares](http://redux.js.org/docs/advanced/Middleware.html) explains
in an extremely detailed way how to use middlewares, but it might be a bit hard to digest if you're
new to the scene.

Actually, writing a Redux middleware is not that hard:

```javascript
// This middleware just prints the dispatched action name
const myMiddleware = store => next => action => {
  console.log("dispatching:", action);
  let result = next(action);
  return result;
};
```

The most confusing part of the above middleware is probably its firm:

```javascript
const myMiddleware = store => next => action => {
```

The `store => next => action` statement is a mix of [currying](https://en.wikipedia.org/wiki/Currying) and the ES6 syntax, which can be also written this way:

```javascript
const myMiddleware = function(store) {
 return function(next) {
   return function(action) {
     ...
   }
 }
}
```

You're basically building a chain of functions, which allows you to pass the interested parameters
to the logic you'll write.  
If you're new to this kind of stuff, my suggestion is to learn the principles behind the currying and
to stick with the `store => next => action`, starting by treating this three parameters just like normal function parameters.

The other key concept you need to understand is the purpose of the `next` parameter.  
Calling `next(action)` inside a middleware passes the action to the next middleware in the chain.  
If there are no other middleware it calls the actual `store.dispatch(action)`.  
You can call it like a classic callback at the end of your logic inside the middleware, but you can
also use it for more interesting stuff like obtaining the next state of your store.

## What can I do with a Redux middlewares?

Almost anything.  
I'll suggest you to start using them for handling side-effects or asynchronous code, but the limit is only your imagination.  
Here's list of some simple middlewares that you can take as an example.

```javascript
/**
 * Logs all actions and states after they are dispatched.
 */
const logger = store => next => action => {
  console.group(action.type);
  console.info("dispatching", action);
  let result = next(action);
  console.log("next state", store.getState());
  console.groupEnd(action.type);
  return result;
};
```

```javascript
/**
 * Lets you dispatch promises in addition to actions.
 * If the promise is resolved, its result will be dispatched as an action.
 * The promise is returned from `dispatch` so the caller may handle rejection.
 */
const vanillaPromise = store => next => action => {
  if (typeof action.then !== "function") {
    return next(action);
  }

  return Promise.resolve(action).then(store.dispatch);
};
```

```javascript
/**
 * Shows an alert when an user doesn't have an high enough permission level.
 */
const permissionChecker = store => next => action => {
  if (!action.permissionLevel) {
    return next(action);
  }
  const userPermissionLevel = store.getState().user.permissionLevel;
  if (userPermissionLevel < action.permissionLevel) {
    Alert.alert("Error", "Your permission level is too low for this command");
  } else {
    return next(action);
  }
};
```

## Wrapping up

Hopefully this little post highlighted some of the strengths of the Redux middlewares.  
I know that they might be a bit daunting at first, but with a bit of practice you'll be able to
grasp the beauty behind their concept.

If you need any help or if you've found any mistake in my post feel free to drop me a comment!

And, as always, thanks to all the people who worked and are currently working on Redux and its wonderful ecosystem!
