---
date: "2019-07-13"
title: "Testing an Apollo Client mutation effect on the cache"
tags: [programming]
---

I've recently find myself wanting to add unit tests for an Apollo Client mutation that had a complex optimistic update behaviour (where I had to read and write a few fragment manually to apply the updated states) and I wasn't able to find any official docs about how you can test an Apollo client cache update.

After a few tentatives, what I ended up doing is passing to the `cache` field of the `<MockProvider>` a object containing the state of the cache I want to use to test the update.

If you're using the [`apollo-cache-inmemory`](https://www.apollographql.com/docs/react/advanced/caching/) library like I'm doing, I would suggest you to:

1. Run your app in development mode (`process.env.NODE_ENV !== 'production'`) so you'll be able to access the global [`__APOLLO_CLIENT__`](https://www.apollographql.com/docs/react/features/developer-tooling/#configuration) field.
2. Get to the specific state of the app that you want to test.
3. Grab the Apollo cache state from the `InMemoryCache` by running `JSON.stringify(__APOLLO_CLIENT__.cache.read())` in the console.
4. Copy the output from the console, paste it in a `.js` or `.json` file and manually edit it if/where needed.

> If you're not familiar with the state representation used by the Apollo cache I would suggest you to play a bit with the [Apollo Client Devtools](https://www.apollographql.com/docs/react/features/developer-tooling/#apollo-client-devtools) by exploring the "Cache" tab and seeing how it changes when you run an Apollo query on your app.

Now it's all a matter of providing to the `MockProvider`'s `cache` field the data that you just extracted (so that it can be used as its initial cache state) and you'll be all set for testing your cache update.

Here's a simplified example of a unit test:

```javascript
import React from "react";
import { MockedProvider } from "react-apollo/test-utils";
import { UpdateItemMutation, UPDATE_ITEM_MUTATION } from "./UpdateItemMutation";
import initialCacheState from "./my-cache.json".

// Utility that can be used to wait for a response of an Apollo query/mutation.
// See:
// https://www.apollographql.com/docs/react/recipes/testing/#testing-final-state
const waitForResponse = () => new Promise(res => setTimeout(res,0));

describe("<UpdateItemMutation />", () => {
  it("should update the cache correctly when triggered", async () => {
    // 1. Mock the cache mechanism you're using in your app.
    //    In my case I'm using the `InMemoryCache`, which can be rehydrated
    //    using the `restore` method.
    //    If in you're app you're customizing the `InMemoryCache` instance I would
    //    suggest you to export it and import in here.
    const cache = new InMemoryCache().restore(initialCacheState);

    // 2. Setup the data you'll need to test
    const itemId = "abc123"; // ID of the interested item in the cache

    // 3. Mock your mutation.
    const mutationMock = {
      request: {
        query: UPDATE_ITEM_MUTATION,
        variables: { itemId: threadId }
      },
      result: {
        data: {
          __typename: "Mutation",
          // Mock here the expected result of your query.
          updateitem: {
            __typename: "Item",
            id: itemId,
            // ...additional data
          }
        }
      }
    };

    // 4. Render the <UpdateItemMutation /> component
    const { getByTestId, getByText } = render(
      <MockedProvider cache={cache} mocks={[mutationMock]}>
        <UpdateItemMutation id={itemId}>
          {mutate => <div data-testid="button-trigger-mutation" onClick={mutate} />}
        </UpdateItemMutation>
      </MockedProvider>
    );

    // 5. Fire the mutation and wait for it to be completed
    const button = getByTestId("button-trigger-mutation");
    fireEvent.click(button);
    await waitForResponse();

    // 8. You can now extract the updated query and make your assertions based
    //    on what you expect from the result of the mutation.
    const updatedCache = cache.extract();
    expect(updatedCache[`Item:${itemId}`.something]).toBe(true).
  });
});
```
