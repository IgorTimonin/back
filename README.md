## Задачи:

1) Описать ошибку БД при попытке создать запись с дублем в поле с уникальными данными (uniq)
ERROR [ExceptionsHandler] E11000 duplicate key error collection: online-cinema.Actor index: slug_1 dup key: { slug: "" }
2) ~~Обработать ситуации, когда в ответе приходит пустой массив (неверно указан id  в запросе к api)~~
3) Сделать поиск по части title или slug

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
