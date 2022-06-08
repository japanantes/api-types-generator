# ATGen (API Types Generator)

This is a library from JapaNantes that helps to abstract api calls behind functions.
This library generates a typescript file containing types and functions for each route automatically.

## Installation

You can install it with `npm` like : `npm install @japanantes/atgen`.

## How to use

This is a simple step by step explanation for more details refer to the doc : [ATGen Docs](https://japanantes.github.io/api-types-generator/docs/).

This library works with `ExpressJS`, you must first configure it as followed :

```ts
import { ExpressProvider } from "@japanantes/atgen/dist";
import express from "express";

const app = express();

ExpressProvider.setLogger(console);
ExpressProvider.getInstance().setApp(app);
ExpressProvider.getInstance().setAuthMiddleware((req, res, next) => {
    next();
});
```

Once configured, you can add routes by using the provided function decorator :

```ts
@route({
        method: Method.POST,
        path: "/login",
        required: { body: true },
})
async function login(req, res) {}

```

The decorator will be called on import/load of the module/file.
After creating all your routes, you can generate the output file with the following :
```ts
import { ApiGenerator } from "@japanantes/atgen/dist";

ApiGenerator.getInstance().generateApiRegister();

```

**The path of the output file must be configured in `process.env.ATGEN_TYPES_FOLDERPATH`.**
