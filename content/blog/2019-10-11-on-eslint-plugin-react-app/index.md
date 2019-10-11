---
date: "2019-10-11"
title: "On eslint-plugin-react-app"
tags: [programming]
description: eslint-plugin-react-app is a minimal set of easy to install ESLint rules for your project. Just install a single NPM package, add it to your .eslintrc, and you'll be all set.
---

The more time I spend in the JavaScript ecosystem, the more I enjoy using opinionated solutions to solve common problems.

A couple of years ago I created [eslint-plugin-react-app](https://github.com/mmazzarolo/eslint-plugin-react-app): a minimal set of unobtrusive ESLint rules that can be installed trough a single npm package.  
I can just run `yarn add eslint-plugin-react-app`, add it to my `.eslintrc` config, and I'm ready to go.  
It works on React and React-Native codebases and I always pair it with TypeScript and Prettier.

Bascially, what `eslint-plugin-react-app` does is exposing [the ESLint configuration used by Create React App](https://github.com/facebook/create-react-app/tree/master/packages/eslint-config-react-app) without the need of declaring all its dependencies.

I'm still using this plugin on a daily basis, mostly because I almost never want to enforce strict linting rules.  
A set of simple common rules is enough these days.  
TypeScript takes care of the typing issues. Prettier makes bikeshedding a thing of the past. ESLint can finally focus on what it does better: warn you about unsafe instructions and stupid mistakes.

The currently included plugins are the following:

- [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import)
- [eslint-plugin-flowtype](https://github.com/gajus/eslint-plugin-flowtype)
- [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y)
- [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)
- [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint)

And [here's the list of its currently enabled rules](https://github.com/facebook/create-react-app/blob/master/packages/eslint-config-react-app/index.js).
