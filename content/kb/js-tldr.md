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

## Equality

**Strict equality (`x === y`)**

- if type(x) is different from type(y), return `false`.
- if type(x) is Number, and x or y is NaN, return `false`.
- check if the value/reference is the same.

**Lose equality (`x == y`)**

Uses coercion.

- if the types are the same: `===`
- if null or undefined: equal
- if non-primitives: ToPrimitve
- prefer: ToNumber

## Scoping

## Hoisting

- `var` variables are hoisted
- `function` declaration are hoisted

## Closure

Closure is when a function "remembers" its lexical scope even when the function is executed outside that lexical scope.

A closure is a function having access to the parent scope, even after the parent function has closed.

A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives you access to an outer function’s scope from an inner function. In JavaScript, closures are created every time a function is created, at function creation time.

Among other things, closures are commonly used to give objects data privacy.

```js
function createMultiplier(a) {
  return function multiply(b) {
    return a * b;
  };
}

const double = createMultiplier(2);
double(3); // => 6
double(5); // => 10

const triple = createMultiplier(3);
triple(4); // => 12
```

## Modules

Modules encapsulate data and behavior (methods) together. The state (data) of a module is held by its methods via closure.

```js
const person = (function Module(prefix) {
  const firstName = "John";
  function print(lastName) {
    console.log(`${prefix} ${firstName} ${lastName}`);
  }
  const publicAPI = {
    print: print,
  };
  return publicAPI;
})("Mr.");

person.print("Doe"); // "Mr. John Doe"
```

Exporting modules (ESM/require) does the encapsulation automatically.

## `this` and binding

Differently from other languages, `this` in JS is aware of the context where it's being used from.

```js
// implicit binding

const person = {
  firstName: "John",
  print(lastName) {
    console.log(`${this.firstName} ${lastName}`);
  },
};

person.print("Doe"); // "John Doe"
```

```js
// dynamic binding

function print(lastName) {
  console.log(`${this.firstName} ${lastName}`);
}

const person1 = {
  firstName: "John",
  print: print,
};

const person2 = {
  firstName: "Paul",
  print: print,
};

person1.print("Doe"); // "John Doe"

person2.print("McDonald"); // "Paul McDonald"
```

```js
// explicit binding

function print(lastName) {
  console.log(`${this.firstName} ${lastName}`);
}

const person1 = {
  firstName: "John",
  print: print,
};

const person2 = {
  firstName: "Paul",
  print: print,
};

print.call(person1, "Doe"); // "John Doe"

print.call(person2, "McDonald"); // "Paul McDonald"
```

```js
// hard binding

const person = {
  firstName: "John",
  print(lastName) {
    console.log(`${this.firstName} ${lastName}`);
  },
};

setTimeout(person.print, 1000, "Doe"); // "undefined Doe" (in this case the context is the window object)

setTimeout(person.print.bind(person), 1000, "Doe"); // "John Doe" (in this case the context is the window object)
```
