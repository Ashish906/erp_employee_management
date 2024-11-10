## Environment Variable

Create a .env file in the root directory making sure it has all env variable available from .env.development if you want to run the app in production mode.

## Installation

```bash
$ npm install
```

# Migration

```bash
$ npm run migrate:production
```
Before running this command, please make sure src/database/config.js has correct credentials.

# Data seeding

```bash
$ npm run seed:prod-all
```
This command will create one admin and one employee, some position and some employee in DB.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run build
$ npm run start:prod
```

## Login credentials
```
Admin: super.admin@gmail.com Password: 123456
Employee: sse1@gmail.com Password: 123456
```

## Endpoints
```
    /auth/login (POST)
    /employees (POST)
    /employees (GET)
    /employees/organogram/:employee_id (GET)
    /employees/:id (GET)
    /employees/:id (PATCH)
    /employees/:id (DELETE)
```

## Technique

[Mike Hillyer's awesome technique](https://mikehillyer.com/articles/managing-hierarchical-data-in-mysql/)

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment process

1. Create two branch named version0.0.1 and production. Version branch is just for keep code of a version.
2. Create a docker file. I will go for dockerized deployment since it is best for app scalability and versioning.
3. Create CI/CD pipeline using github actions.
4. CI/CD would be like when we deploy our code in production branch then it CI/CD come into action and run some steps like check lint errors -> run all test cases -> If all test cases pass, then deploy the code in the server.

## Area of improvement

I was trying to do e2e testing with database connection instead of mocking some functions
or database operations. Also I tried to create only on app instance for all test files so that I can reduce test execution time.
I tried setupFiles, setupFilesAfterEnv, globalSetup, globalTeardown options in jest configuration. But Still I am struggling to solve this case.

## License

Nest is [MIT licensed](LICENSE).
