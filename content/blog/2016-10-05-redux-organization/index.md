---
date: "2016-10-05"
title: My journey toward a maintainable project structure for React/Redux
tags: [react, react-native, node, javascript]
redirect_from:
  - /2016/10/05/my-journey-toward-a-maintainable-project-structure-for-react/redux
---

When I started learning Redux I was shocked by the number of discussions and “best practice” you could find online about it, but it didn’t take me too much time to understand why: Redux is not very opinionated about the way of structuring a project around it, and this can lead to some annoyance when you’re trying figure out what kind of structure suits better your style and your project.

In this post I’d like to share some information on my journey to achieving a comfortable Redux project structure.

> This is not an introduction/tutorial, a bit of knowledge of Redux is required to understand it entirely.
> Also, apart from redux-sagas (which can be replaced by redux-thunk or by your favorite library for handling asynchronous actions), I won't use any other external Redux library/utility.

Hope you find it interesting!

<!--more-->

## First stop: grouping files by “type”

When I started using Redux I studied the [official docs](https://redux.js.org/docs) from top to bottom and I organized my project this way:

```
src
 ├── components
 │
 ├── containers
 │   ├── auth.js
 │   └── product.js
 │
 ├── actions (action creators)
 │   ├── auth.js
 │   └── product.js
 │
 ├── types (action types)
 │   ├── auth.js
 │   └── product.js
 │
 └── reducers
      ├── auth.js
      └── product.js
```

This structure is promoted by the [official Redux repository examples](https://github.com/reactjs/redux/tree/master/examples/todos/src) and in, my opinion, it's still a pretty solid option.  
The main drawback of this structure is that even adding a small feature might end up in editing many different files.  
For example, adding a field (that is updated by an action) to the product store means that you'll have to:

- add the action type in `types/product.js`
- add the action creator in `actions/products.js`
- add the field in `reducers/product.js`

And it doesn't end here! When the app grows you'll probably add other directories to the mix:

```
├── sagas
│   ├── auth.js
│   └── product.js
└── selectors
    ├── auth.js
    └── product.js
```

So, after introducing redux-saga in my project I realized that it was becoming too hard to maintain and I started looking for alternatives.

## A different approach: grouping files by feature

An alternative to the structure above consists in grouping files by feature:

```
src
 ├── components
 │
 ├── auth
 │   ├── container.js
 │   ├── actions.js
 │   ├── reducers.js
 │   ├── types.js
 │   ├── sagas.js
 │   └── selectors.js
 │
 └── product
     ├── container.js
     ├── actions.js
     ├── reducers.js
     ├── types.js
     ├── sagas.js
     └── selectors.js
```

This approach has been promoted by various interesting articles in the React community, and it is used in [one of the most common React boilerplate](https://github.com/mxstbr/react-boilerplate).

At first glance this structure seemed reasonable to me because I was encapsulating a component (the container), its state (the store) and its behavior (the actions) in a single folder, following the React's component concept.  
After using it in a bigger project thought I discovered that it is not all sunshine and rainbows: if you're using Redux you're probably doing it for sharing a slice of store across you're app... and you can see easily that this clashes with the encapsulation concept promoted by this structure.  
For example dispatching an action from the `product` container might produce side effects on the `cart` container (if the `cart` reducer reacts in some way to the action).

You must also be careful not to be caught in another conceptual trap: don't feel forced to tie a slice of the Redux store to a container, because otherwise you'll probably end up using Redux even when you should have opted for the simple `setState`.

## Ducks to the rescue

After the short adventure of grouping by feature I went back to my initial project structure and I noticed that using Sagas for handling the asynchronous flow has the interesting side effect of turning 90% of your action creators in one-liner:

```javascript
const login = (email, password) => ({ type: LOGIN_REQUEST, email, password });
```

In such situation, having a dedicated file for each action creator, action type and reducer seemed a bit overkill, so I decided to try out the "Ducks" approach.
[Ducks](https://github.com/erikras/ducks-modular-redux) is a proposal for bundling reducers, action types and actions in the same file, leading to a reduced boilerplate:

```javascript
// src/ducks/auth.js
const AUTO_LOGIN = 'AUTH/AUTH_AUTO_LOGIN'
const SIGNUP_REQUEST = 'AUTH/SIGNUP_REQUEST'
const SIGNUP_SUCCESS = 'AUTH/SIGNUP_SUCCESS'
const SIGNUP_FAILURE = 'AUTH/SIGNUP_FAILURE'
const LOGIN_REQUEST = 'AUTH/LOGIN_REQUEST'
const LOGIN_SUCCESS = 'AUTH/LOGIN_SUCCESS'
const LOGIN_FAILURE = 'AUTH/LOGIN_FAILURE'
const LOGOUT = 'AUTH/LOGOUT'

const initialState = {
  user: null,
  isLoading: false,
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SIGNUP_REQUEST:
    case actionTypes.LOGIN_REQUEST:
      return { ...state, isLoading: true, error: null }

    case actionTypes.SIGNUP_SUCCESS:
    case actionTypes.LOGIN_SUCCESS:
      return { ...state, isLoading: false, user: action.user }

    case actionTypes.SIGNUP_FAILURE:
    case actionTypes.LOGIN_FAILURE:
      return { ...state, isLoading: false, error: action.error }

    case actionTypes.LOGOUT:
      return { ...state, user: null }

    default:
      return state
  }
}

export const signup = (email, password) => ({
  type: SIGNUP_REQUEST, email, password
})
export const login = (email, password) => ({
  type: LOGIN_REQUEST, email, password
})
export const logout = () => ({
  type: LOGOUT
})

// src/ducks/product.js
const GET_PRODUCTS_REQUEST = 'PRODUCT/GET_PRODUCTS_REQUEST'
const GET_PRODUCTS_SUCCESS = 'PRODUCT/GET_PRODUCTS_SUCCESS'
const GET_PRODUCTS_FAILURE = 'PRODUCT/GET_PRODUCTS_FAILURE'

const initialState = {
  products: null,
  isLoading: false,
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_PRODUCTS_REQUEST:
      return { ...state, isLoading: true, error: null }

    case actionTypes.GET_PRODUCTS_SUCCESS:
      return { ...state, isLoading: false, user: action.products }

    case actionTypes.GET_PRODUCTS_FAILURE:
      return { ...state, isLoading: false, error: action.error }

    default:
      return state
  }
}

export const getProducts = () => ({
  type: GET_PRODUCTS_REQUEST
})
```

The first time I adopted this syntax I fell in love with it.  
It's clean, it removes a lot of unnecessary boilerplate and you can easily add an action or a field to the reducer by changing a single file.

Unfortunately thought, using ducks started showing quickly its limits because exporting individually every single action creator and action type has some nasty side effects.

- In bigger containers you'll end up having a huge list of imported actions that are only used one time (for feeding `mapDispatchToProps`):
  `import { signup, login, resetPassword, logout, ... } from 'ducks/authReducer'`
- You won't be able to pass to `mapDispatchToProps` directly all the actions of a duck.
  Using `import * as actions from 'ducks/authReducer'` won't work, because you'll import even the reducer this way.
- You'll waste a super precious variable name just for passing it to `mapDispatchToProps`.  
  Think about it, you won't even be able do something like this: `const { login } = this.props` because you already defined the `login` variable by assigning it to the action creator imported from the duck.
- In bigger sagas you'll end up using a lot of different actions without knowing their context (you'll have to scroll to the top imports every time).

## Customizing the ducks

My solution to the above issues is simple: instead of exporting individually action types and action creators I group and export them inside a `types` and `actions` object:

```javascript
// src/ducks/auth.js
export const types = {
  AUTO_LOGIN: 'AUTH/AUTH_AUTO_LOGIN',
  SIGNUP_REQUEST: 'AUTH/SIGNUP_REQUEST',
  SIGNUP_SUCCESS: 'AUTH/SIGNUP_SUCCESS',
  SIGNUP_FAILURE: 'AUTH/SIGNUP_FAILURE',
  LOGIN_REQUEST: 'AUTH/LOGIN_REQUEST',
  LOGIN_SUCCESS: 'AUTH/LOGIN_SUCCESS',
  LOGIN_FAILURE: 'AUTH/LOGIN_FAILURE',
  LOGOUT: 'AUTH/LOGOUT'
}

export const initialState = {
  user: null,
  isLoading: false,
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SIGNUP_REQUEST:
    case types.LOGIN_REQUEST:
      return { ...state, isLoading: true, error: null }

    case types.SIGNUP_SUCCESS:
    case types.LOGIN_SUCCESS:
      return { ...state, isLoading: false, user: action.user }

    case types.SIGNUP_FAILURE:
    case types.LOGIN_FAILURE:
      return { ...state, isLoading: false, error: action.error }

    case types.LOGOUT:
      return { ...state, user: null }

    default:
      return state
  }
}

export const actions = {
  signup: (email, password) => ({
    type: SIGNUP_REQUEST, email, password
  })
  login: (email, password) => ({
    type: actionTypes.LOGIN_REQUEST, email, password
  }),
  logout: () => ({
    type: actionTypes.LOGOUT
  })
}
```

If you structure the ducks this way you'll be able to import the `actionCreators` easily inside your components:

```javascript
import { actions } from 'ducks/auth'

...

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(actions, dispatch)
})
```

Now you may ask: what if inside a component I need to dispatch actions of different ducks?  
Well, you can always do something like this:

```javascript
import { actions as ticketActions } from 'ducks/ticket'
import { actions as messageActions } from 'ducks/message'
import { actions as navigationActions } from 'ducks/navigation'

...

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    ...ticketActions,
    ...messageActions,
    ...navigationActions
  }, dispatch)
})
```

I know, it's a bit uglier, but any other solution is well accepted!

> Originally I opted for the name `actionTypes/actionCreators` instead of `types/actions`, but on the long run I refactored to the latter because the first option was too much verbose for my taste.

> P.S.: From now on for simplicity I'll keep calling the files with actions/reducers/types "ducks", but in my current projects I have them in the "reducers" folder.

## Selectors

In my opinion selectors are the most overlooked feature of Redux.  
I must admit that I started used them a bit too late, but reading [this tweet by Dan Abramov](https://twitter.com/dan_abramov/status/730933179511640064) opened my eyes and I begun viewing selectors as interfaces that expose the store to the containers.

- Need to display a list in a certain order? Define the `getProductOrderedByName` selector.
- Need to get a specific element of a list? Define the `getProductById` selector.
- Need to get a filter for the list? Define the `getExpiredProducts` selector.

Following this strategy most of the selectors you'll define will be strongly tied to a specific reducer, so the right place for defining them is the file containing the reducer itself.

```javascript
// src/ducks/product.js
import { filter, find, sortBy } from 'your-favorite-library'
export const types = {
  ...
}

export const initialState = {
  products: [],
  isLoading: false,
  error: null
}

export default (state = initialState, action) => {
  ...
}

export const actions = {
  ...
}

export const getProduct = (state) => state.product.products
export const getProductById = (state, id) => find(state.product.products, id)
export const getProductSortedByName = (state) => sortBy(state.product.products, 'name')
export const getExpiredProducts = (state) => filter(state.product.products, { isExpired: true })
```

> Sometimes you'll need to define more complex selectors that handle the input from different slice of the store.  
> In this situations I define them in `reducers/index.js`, but I'm still trying to figure out a better location.

## The sagas

Sagas are really powerful and testable, but being used for managing asynchronous actions and side effects make it a bit hard to reason on how to add them to your project structure.  
My suggestion is to start grouping sagas that are triggered by a single redux action in the same action domain.  
This means that if you have a reducer that handles the authentication in `ducks/auth.js`, you can create `sagas/auth.js`, containing the sagas that are triggered by `authTypes.SIGNUP_REQUEST`, `authTypes.LOGIN_REQUEST` and so on...

Sometimes thought you'll need to trigger the same saga from with different actions. In this case you can create a more generic file containing this kind of sagas.
For example this simple saga for React Native shows an alert when it intercepts an error:

```javascript
// sagas/index.js
takeEvery(authTypes.LOGIN_FAILURE, uiSagas, showErrorAlert),
  takeEvery(menuTypes.GET_MENU_ERROR_FAILURE, uiSagas.showErrorAlert);

// sagas/ui.js
import { call } from "redux-saga/effects";
import { Alert } from "react-native";

export function* showErrorAlert(action) {
  const { error } = action;
  yield call(Alert.alert, "Error", error);
}
```

If the generic file (in this case i called it `sagas/ui.js`) grows too much you can always refactor it later being more specific.

Another thing worth nothing is that in `sagas/index.js` I have a file that links the `take...` instruction of every saga to its implementation:

```javascript
import { types as authTypes } from 'ducks/auth'
import { types as productTypes } from 'ducks/product'
import { * as authSagas } from 'sagas/auth'
import { * as productSagas } from 'sagas/product'

export default function* rootSaga () {
  yield [
    takeEvery(authTypes.AUTO_LOGIN, authSagas.autoLogin),
    takeEvery(authTypes.SIGNUP_REQUEST, authSagas.signup),
    takeEvery(authTypes.LOGIN_REQUEST, authSagas.login),
    takeEvery(authTypes.PASSWORD_RESET_REQUEST, authSagas.resetPassword),
    takeEvery(authTypes.LOGOUT, authSagas.logout),

    takeEvery(productTypes.GET_PRODUCTS_REQUEST, productSagas.getTickets)
  ]
}
```

In this way I'm able to track down every saga easily by associating the saga with action types that trigger it.

## Edit#1 Where do you place actions/types that are not tied to a reducer?

In most of my project I have one or more generic ducks that handles this kind of actions.  
For example if the project is small enough I simply create `ducks/app.js`, a duck file containing 1) all the actions creators and action types that are not reducer specific and 2) the state of the ui/app:

```javascript
export const types = {
  LOAD_DATA: "APP/LOAD_DATA", // Triggers a saga that makes some HTTP requests and then update other reducers
  SHOW_SNACKBAR: "APP/SHOW_SNACKBAR",
  HIDE_SNACKBAR: "APP/HIDE_SNACKBAR",
  SHOW_DRAWER: "APP/SHOW_DRAWER",
  HIDE_DRAWER: "APP/HIDE_DRAWER"
};

export const initialState = {
  snackbarMessage: null,
  isDrawerVisible: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SHOW_SNACKBAR:
      return { ...state, snackbarMessage: action.snackbarMessage };

    case types.HIDE_SNACKBAR:
      return { ...state, isSnackbarVisible: false };

    case types.SHOW_DRAWER:
      return { ...state, isDrawerVisible: true };

    case types.HIDE_DRAWER:
      return { ...state, isDrawerVisible: false };
    default:
      return state;
  }
};

export const actions = {
  loadData: () => ({ type: types.LOAD_DATA_REQUEST }),
  showSnackbar: snackbarMessage => ({
    type: types.SHOW_SNACKBAR,
    snackbarMessage
  }),
  hideSnackbar: () => ({ type: types.HIDE_SNACKBAR }),
  showDrawer: () => ({ type: types.SHOW_DRAWER }),
  hideDrawer: () => ({ type: types.HIDE_DRAWER })
};
```

Please keep in mind that these ducks may not need a reducer: they can contains just action creators and action types.

## Edit#2 A more explicit approach

Some comments on Reddit and Twitter hinted that ducks may promote the idea that the relation between actions and reducers is many:1, when it actually is many:many. I agree with them.  
In my opinion in fact a structure that follows the Redux philosophy even more than the one I showed you would be the following:

```javascript
src
 ├── actions
 │   ├── index.js (action types + action creators)
 │   ├── auth.js (action types + action creators)
 │   ├── other.js (action types + action creators)
 │   └── product.js (action types + action creators)
 │
 ├── reducers
 │   ├── index.js (combineReducers + complex selectors)
 │   ├── auth.js (reducer + specific reducer selectors)
 │   └── product.js (reducer + specific reducer selectors)
 │
 └── sagas
     ├── index.js (root saga/table of content of all the sagas)
     ├── auth.js
     └── product.js
```

I still prefer to use the customized ducks though, and when I have actions that are not tied to a reducer (or the opposite) I adopt the solution I explained above in the edit#1.
In the end you might need to test different structures by yourself for finding the tradeoff between explicitness and comfort that suits better your style and your project.

Thanks to [@mxstbr](https://twitter.com/mxstbr) and [https://www.reddit.com/user/joshwcomeau](https://www.reddit.com/user/joshwcomeau) for the hint on this small edit.

## Conclusion

That's it!
Here is my current project structure (as I anticipated above I renamed the "ducks" folder to "reducers"):

```
src
 ├── components
 │
 ├── containers
 │   ├── auth.js
 │   ├── productList.js
 │   └── productDetail.js
 │
 ├── reducers (aka ducks)
 │   ├── index.js (combineReducers + complex selectors)
 │   ├── auth.js (reducers, action types, actions creators, selectors)
 │   └── product.js (reducers, action types, actions creators, selectors)
 │
 ├── sagas
 │   ├── index.js (root saga/table of content of all the sagas)
 │   ├── auth.js
 │   └── product.js
 │
 └── services
     ├── authenticationService.js
     └── productsApi.js
```

This structure might work nicely on some project and poorly on others, but I'm aware that it's still far from perfect.
I just hope that some parts of this post helped you in developing a comfortable project structure!

If you have any tips or critics just drop me a comment!

Thanks to/useful links:

- [The Redux bible](https://github.com/markerikson/react-redux-links) by Marker Erikson
- [This discussion](https://github.com/infinitered/ignite/pull/356) in a pull request of the awesome Ignite boilerplate repository (which uses a structure just like the one I showed you)
- [Steve Kellock](https://github.com/skellock), because he inspired me to write this post and because we had an interesting discussion on Redux that you can find [here](https://github.com/infinitered/ignite/issues/158)
- [Dan Abramov](https://twitter.com/dan_abramov), because all the stuff he posts is super-interesting and well written
- [This baby boilerplate](https://github.com/mmazzarolo/react-native-boilerplate), a bit outdated but I'll try update it as soon as possible
