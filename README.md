# Vertical Typescript with React/Express/Postgres

Starter app that provides automatic contracts between the ui/api/database. One of the huge problems in TypeScript development is the divergence of types from what the data shapes actually are - for example if you add a column to a table, or change the shape of an api response you have to manually update the models or interfaces covering those shapes. This repo shows one way of solving these problems.

* Generates (useful) Typescript Database wrapper from database meta schemas
* Generates (useful) Typescript REST client from router definitions

# Dependencies

* node.js 8+
* pm2 `npm install -g pm2`
* typescript/tsc `npm install -g typescript`
* [optional] docker & docker-compose
  * alternatively have postgres running locally at 5432

# Run

* Start Postgres
  * `docker-compose up -d`
* Install dependencies
  * `cd backend && npm i`
  * `cd ui && npm i`
* Run initial migrations
  * `cd backend && npm run migrate`
* Start servers
  * `pm2 start process.yml`
* View App at localhost:8082

# Update REST

`cd backend && npm run rest-gen`

# Update DB Interface (After updating migrations and re-running them)

`cd backend && npm run db-gen`

# What is going on!?

There are definition-extractor files in the backend (under http and postgres) which read the code, or the database, and generate definition typescript files, which are read by `db-interface.ts` and `rest-interface.ts` in the backend and ui respectively. The files which read the definition files infer the shapes of things, and enforce those shapes in the methods they expose. This means params/body shapes for the rest client, and the shape of DTOs for the database.

There are also wrappers for the usual express request/response types, these types plug into the template router so that the dynamically generated types in the router layer are enforced immediately in the handlers for a given endpoint.

Play with it and find out :)
