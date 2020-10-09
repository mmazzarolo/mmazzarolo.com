# Types

## Primitive types

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures

There are six primitive types. A primitive is an immutable value that has no methods of its own.

- `undefined`
- `null`
- `string`
- `number`
- `boolean`
- `symbol`

Everything else is an Object type.

The `typeof` operator can help you to find the type of a value, but has some edge cases.
| Type | Result |
| Undefined | `undefined` |
| Null | `object` |
| Boolean | `boolean` |
| Number | `number` |
| BigInt | `bigint` |
| String | `string` |
| Symbol | `symbol` |
| Function | `function` |
| Object | `object` |

- `typeof null === "object"` is mostly regarded as an historical error in.

In JavaScript, variables don't have types, values do.

Special value: NaN -> "invalid number"

- `2 - "one"; // NaN`
- `0 / 0; // NaN`
- `Number("not a number") // NaN`;
- `typeof NaN; // "number"`
- `NaN === NaN; // false`
- `isNaN(NaN); // true`
- `isNaN("not a number"); // true ⚠️`
- `Number.isNaN("not a number"); // false ❌`
