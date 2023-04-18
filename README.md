## Description

[OMDB](https://www.omdbapi.com/) API integration using [Nest](https://github.com/nestjs/nest) framework.

--

## [API Docs](https://documenter.getpostman.com/view/2943788/2s93Xzy3ZX#intro)

--


## How to run
1. Install npm packages
```
npm i
```

2. Create `.env` file
```
SERVER_PORT=
OMDB_API_BASE=http://www.omdbapi.com
OMDB_API_KEY=
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=
JWT_SECRET=
```
3. Run containers
```
docker-compose up
```

## How to run in `dev mode`
1. Install npm packages
```
npm i
```
2. Create `.env` file
```
OMDB_API_BASE=http://www.omdbapi.com
OMDB_API_KEY=
```

3. Create `.env.development` file
```
SERVER_PORT=
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=
JWT_SECRET=
```

4. Make sure your MySQL database instance

5. Execute dev script
```
npm run start:dev
```

## How to run in `tests`
1. Install npm packages
```
npm i
```
2. Create `.env` file
```
OMDB_API_BASE=http://www.omdbapi.com
OMDB_API_KEY=
```

3. Create `.env.test` file
```
SERVER_PORT=
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=
JWT_SECRET=
```

4. Make sure your MySQL database instance

5. Execute test script
```
npm run test:watch
```