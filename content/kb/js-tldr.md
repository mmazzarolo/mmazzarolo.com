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

## Special Cases

### Typeof

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

### NaN

Special value: NaN -> "invalid number"

- `2 - "one"; // NaN`
- `0 / 0; // NaN`
- `Number("not a number") // NaN`;
- `typeof NaN; // "number"`
- `NaN === NaN; // false`
- `isNaN(NaN); // true`
- `isNaN("not a number"); // true ⚠️`
- `Number.isNaN("not a number"); // false ❌`

## Coercion

In JavaScript type coercion is

Coerction can be explicit or implicit.

There are only three types coerction in JavaScript:

- to string
- to boolean
- to number

### String coercion

Explicit: `String()`

Implicit: using the `+` operator when _any_ operand is a string.

```
String(123)                   // '123'
String(-12.3)                 // '-12.3'
String(null)                  // 'null'
String(undefined)             // 'undefined'
String(true)                  // 'true'
String(false)                 // 'false'
```

### Boolean coercion

Expliti: `Boolean()`

Implicit: In logical contexts (e.g.: `if`) or when logical operators are used (`||`, `&&`, `!`).

It's easier to just learn the falsy values:

- `""`
- `0`
- `-0`
- `NaN`
- `null`
- `undefined`
- `false`

Anything else is `true`.

```
Boolean({})             // true
Boolean([])             // true
Boolean(Symbol())       // true
!!Symbol()              // true
Boolean(function() {})  // true
```

### Numeric coercion

Explicit: `Number()`

Implicit:

```
Number(null)                   // 0
Number(undefined)              // NaN
Number(true)                   // 1
Number(false)                  // 0
Number(" 12 ")                 // 12
Number("-12.34")               // -12.34
Number("\n")                   // 0
Number(" 12s ")                // NaN
Number(123)                    // 123
```

- comparison operators (`>`, `<`, `<=`,`>=`)
- bitwise operators (`|`, `&`, `^`, `~`)
- arithmetic operators (`-`, `+`, `*`, `/`, `%` ). Note, that binary+ does not trigger numeric conversion, when any operand is a string.
- unary `+` operator
- loose equality operator `==` (incl. `!=`).

```
Number(null)                   // 0
Number(undefined)              // NaN
Number(true)                   // 1
Number(false)                  // 0
Number(" 12 ")                 // 12
Number("-12.34")               // -12.34
Number("\n")                   // 0
Number(" 12s ")                // NaN
Number(123)                    // 123
```

### Coercion with objects

Whenever the JS engine finds an expression like `{} + { "hello": "world" }` it converts each object to a primitive value, which is then converted to the final type.

Objects are converted to primites via the internal `[[ToPrimitive]]` method this way:

- If he input is already a primitive, return it as it is.
- Call `input.toString()`, if the result is a primitve, return it.
- Call `input.valueOf()`, if the result is a primitve, return it.
- throw `TypeError`

### Boxing

JS knows when you’re trying to access a method on a primitive and behind the scenes, it will use the constructor to make an object out of your primitive. Once it runs the method that object is then garbage collected. ( removed from memory )

Strings are in fact primitives as described in the article, not entire objects. JS knows when you try to access a method on the String object and coerces your primitive into a string object. When it’s done the temporary object is garbage collected and life continues as usual.
