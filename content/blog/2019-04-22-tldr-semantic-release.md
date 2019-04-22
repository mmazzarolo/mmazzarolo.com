---
date: "2019-04-22"
title: "TLDR: Semantic Release"
tags: [programming]
---

The more an NPM library becomes "stable", the more publishing a new version of it on NPM becomes quite a boring task:

- Someone sends a PR for a small bugfix/improvement
- The PR gets reviewed and merged
- The library version number gets bumped and released
- Someone writes the changelog

Enter [`semantic-release`](https://github.com/semantic-release/semantic-release), an powerful set of tools for _fully automating version management and package publishing_.

With `semantic-release` you can easily automate the flow described above by letting it handle for you the release process in your Continuous Integration.

First, install `semantic-release`:

```bash
npm install --save-dev semantic-release
```

The `semantic-release` package has **almost** everything you need... but to get the most of it you'll also need an additional plugin (that for some reason is not included by default):

```bash
npm install --save-dev @semantic-release/git
```

Next step, create the `semantic-release` configuration file, which is a JSON file name `.releaserc` file at the root of you project:

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    "@semantic-release/github",
    "@semantic-release/git"
  ]
}
```

Let's now move to the CI setup.
In my case I'm using [CircleCI](https://circleci.com), but `semantic-release` is unopinionated on this subject.

Create (or update) a `.circle/config.yml` file for running `semantic-release` after your tests:

```yaml
# Example config
version: 2

jobs:
  test:
    docker:
      - image: circleci/node:10
    steps:
      - checkout
      - run: npm install
      - run: npm test

  release:
    docker:
      - image: circleci/node:10
    steps:
      - checkout
      - run: npm install
      - run: npx semantic-release

workflows:
  version: 2
  test_and_release:
    # Run the test jobs first, then the release only when all the test jobs are successful
    jobs:
      - test
      - release:
          requires:
            - test
```

`semantic-release` requires two environment variables to run:

- **`GH_TOKEN`**: An NPM token [NPM token create](https://docs.npmjs.com/getting-started/working_with_tokens#how-to-create-new-tokens).
- **`NPM_TOKEN`**: GitHub [personal authentication token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line).

Now, whenever a new PR gets merged in your `master` branch your CI runs the tests and, if they succesfull, it runs the `semantic-release` process, which:

1. **Checks the commit message (`@semantic-release/commit-analyzer`)**: `semantic-release` determines how to bump the library version (major/minor/patch, following the [semver](https://semver.org)) based on the commit messages used in the merged PR. This means that when merging a PR you should make sure it follows the [Angular Comment Message Convention](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines), which is the [default convention used by `semantic-release`](https://github.com/semantic-release/semantic-release#commit-message-format).
2. **Creates a changelog (`@semantic-release/release-notes-generator`)**: based on the commit messages above, `semantic-release` generates a changelog.
3. **Bumps and publish the new version on NPM (`@semantic-release/npm`)**: `semantic-release` bumps the version number of the library and publishes it on NPM (thanks to the `NPM_TOKEN` env var)
4. **Publish the release on GitHub (`@semantic-release/github`)**: `semantic-release` publishes on GitHub a new [release](https://help.github.com/articles/about-releases) with the changelog that was previously generated
5. **Commit the bumped package version (`@semantic-release/git`)**: `semantic-release` commits on the repo the changes generated in the CI (the most important one is the `package.json` version bump)

That's it!

> I tried to keep this post as short as possible, you can find more information in the [semantic-release GitBook](https://semantic-release.gitbook.io/semantic-release/).
