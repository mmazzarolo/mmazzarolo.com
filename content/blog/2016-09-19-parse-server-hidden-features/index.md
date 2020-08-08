---
date: "2016-09-19"
title: Parse-Server hidden features
tags: [react, react-native, node, javascript]
redirect_from:
  - /2016/09/19/parse-server-hidden-features
---

I've been a [parse-server](https://github.com/ParsePlatform/parse-server) user since its public release-date and I must admit that it has been a fun ride, parse-server really shines when you need to create small applications or prototypes. Think about it: right now you're just [one click away](https://github.com/ParsePlatform/parse-server#parse-server-sample-application) from deploying on your favorite PaaS an express server with built-in authentication, authorization and storage support.  
Do not get me wrong here, I know that parse-server still has a lot of stuff that can be improved/fixed, but most of the time you'll be able to find alternative solutions to its quirks easily.

Some days ago I noticed that one thing that is really missing from parse-server documentation is a declarative way for re-creating the same setup (classes, permissions, roles and so on) on multiple server instances.
The lacking of documentation of a feature like this can be a nightmare, especially if you're ready to move your server to production or if you want to test permissions and roles.  
Having said that, here are three snippets that can make your parse-server setup a bit more consistent and maintainable.

> One thing I learned the hard way by using Parse-Server is that the only true documentation you can trust is [the spec dir][8], and I'll show you why in a moment.

<!--more-->

## The battle plan

In this post I'll show you 3 functions with the following goals:

- Programmatically create an administrator role
- Programmatically create a class
- Programmatically set the class level permissions

These functions can be invoked like scripts just after the server startup.

> Please keep in mind that I'm using ES6 with async/await, but you can easily switch to promises if you want.

## Creating roles

The creation of roles is pretty straightforward because `Parse.Role` is just [an enhanced `Parse.Object`](https://parseplatform.github.io/Parse-SDK-JS/api/classes/Parse.Role.html).  
Here is the complete function for creating an administrator role:

```javascript
export const createAdminRole = async () => {
  const Role = Parse.Object.extend("_Role");
  // Check if the admin role already exists
  const existingAdminRole = await new Parse.Query(Role)
    .equalTo("name", "admin")
    .first();
  // If the admin role already exists we have nothing to do here
  if (existingAdminRole) {
    logger.log('Role "admin" already exists');
    // If the admin role does not exist create it and set the ACLs
  } else {
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    const adminRole = new Role();
    adminRole.set("name", "admin");
    adminRole.setACL(acl);
    await adminRole.save({}, { useMasterKey: true });
  }
};
```

## Creating classes

Class creation is another kind of beast, because changing the database schema programmatically requires the use of the [parse-server config][4].
Luckily in [this issue][5] there's a hint on how to obtain the config object and the schema:

```javascript
import Config from "parse-server/lib/Config";
const config = new Config(APP_ID, PARSE_MOUNT);
const schema = await config.database.loadSchema();
```

For the schema APIs you can take a look at the [holy bible for the schema APIs: the schema specs][6].  
By studying a bit this file you'll notice the use of `schema.addClassIfNotExists`, which is exactly what we're interested on.  
Strong of this information we can create our class:

```javascript
import Config from "parse-server/lib/Config";

export const createClasses = async () => {
  const config = new Config(APP_ID, PARSE_MOUNT);
  const schema = await config.database.loadSchema();
  try {
    await schema.addClassIfNotExists("Product", {
      name: { type: "String" },
      activationDate: { type: "Date" },
      isActive: { type: "Boolean" },
      owner: { type: "Pointer", targetClass: "_User" },
    });
  } catch (err) {
    if (err.code === 103) {
      // Class already exists
      console.warn(err.message);
    } else {
      throw err;
    }
  }
};
```

> It might sound a bit weird, but `addClassIfNotExists` throws an error (103) if the class already exists, hence you should catch it.

## Setting class-level permissions

Strong of the information we acquired in the previous step, setting CLPs will be a breeze.  
This time we're interested on `schema.setPermissions`, which you can always find in the [schema spec][6].

```javascript
import Config from "parse-server/lib/Config";

export const setCLPs = async () => {
  const config = new Config(APP_ID, PARSE_MOUNT);
  const schema = await config.database.loadSchema();
  await schema.setPermissions("Product", {
    get: { "*": true, "role:admin": true },
    find: { "*": true, "role:admin": true },
    create: { "role:admin": true },
    update: { "role:admin": true },
    delete: { "role:admin": true },
    addField: {},
  });
};
```

## Conclusion

These functions can be executed after your parse-server startup and they're pretty simple, so you can customize them easily.  
As you can see, under the hood parse-server offers a lot of freedom in its configuration, and it's a perfect example of the [spec tests][8] fulfilling their original purpose.

[1]: https://github.com/ParsePlatform/parse-server
[2]: https://github.com/ParsePlatform/parse-server#parse-server-sample-application
[3]: https://parseplatform.github.io/Parse-SDK-JS/api/
[4]: https://github.com/ParsePlatform/parse-server/blob/master/src/Config.js
[5]: https://github.com/ParsePlatform/parse-server/issues/891
[6]: https://github.com/ParsePlatform/parse-server/blob/master/spec/Schema.spec.js
[8]: https://github.com/ParsePlatform/parse-server/tree/master/spec
