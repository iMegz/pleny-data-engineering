# Pleny - Data Engineering Task

This is a my solution to data engineering task by **Pleny**

## Tech Stack

[![Tech Stack](https://skillicons.dev/icons?i=typescript,nestjs,mongodb)](https://github.com/iMegz/pleny-data-engineering) <img src="https://zod.dev/logo.svg" alt="zod" height="48">

## Folder Structure

```
├── src
│   ├── brands
│   │   ├── brands.module.ts        # Brands module
│   │   ├── brands.controller.ts    # Brands controller
│   │   ├── brands.service.ts       # Brands service
│   │   ├── brands-schema.ts        # Given mongoose schema
│   │   └── brand-zod-schema.ts     # Zod validation schema
│   │
│   ├── database
│   │   ├── database.module.ts      # Database module
│   │   └── database.service.ts     # Database service
│   │
│   └── utils
│      └── transformer.ts           # General transformer
└── ...
```

## How it works

### brands

- `brand-zod-schema.ts` : Contains Zod schema for validating documents

- `brands.controller.ts` : Has 4 end points :

  - `GET /brands` : Get all brands (Raw data retrieval)
  - `GET /brands/validate` : Get all brands validated in form of

  ```
  {
      original: [...original data before transformation],
      transformed : [...data after transformation]
  }
  ```

  - `PATCH /brands` : Transform brands and update them in the database

  - `POST /brands` : Extend brands collection with random data matching brands schema

### utils

- `transformer.ts` : Has Transformer class with 1 public property and 2 methods :

  - `result` : will hold the result of transformation

  - `altKey(prop, regex, condition, [{[deep], [defaultValue], [transformValue]}])` : try to find alternative key holding a proper value for the property `prop` using `regex` to find a key similar in name then filter keys based on `condition` function.
    `deep` if set `true` will search for nested keys `ex: {brand : {name : "Value"}}`.

  `defaultValue` if set, it will be used in case no key matched conditions otherwise will not make any changes

  `transformValue` if set, will apply it to found values before setting the the prop `ex : (value) => +value` will convert the value to number before settign to prop

  - `cleanObject(keysToKeep)` : will remove all properties in the result that are not in the array `keysToKeep`

## Files

- All attached files are found at `./files`
  - `transformed.brands.json` : data after transformation
  - `extended.brands.json` : extended data only
  - `final.brands.json` : transformed + extended data

## Authors

- [Ahmed Magdi](https://github.com/imegz)
