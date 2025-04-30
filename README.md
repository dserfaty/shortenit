# Shorten It!
## An Express/React Typescript Demo Application
 
## Components
- MongoDB database
- API in node/express
- Front End: React app

## Notes

## Future work
- have the database be created/migrated by a separate process that will apply migrations rather than manually as here (for larger codebases I favor migrations being applied separately from the micro-service itself so we can better control when to apply them or rollback if needed, especially since we could be running several versions concurrently during rolling deployments or testing features
- allow loading all of a user’s urls, but it would require api pagination
- CORS options should allow only origins relevant to the clients instead of * as it is now
- styling | layout is very basic right now but this can take a lot of time to make right - sorry… :)
- there are unit/integration tests, I believe they are essential and should be part of any good application but this is just a prototype 
- do more code review with regard to protecting against NoSQL attacks. At the moment the input is validated, but I would want to be more thorough in my review. 

## Installation
For convenience, the mongodb server and the api server are packaged together.

To start the app cd to the root directory and:

```
cd shorten-it-server
docker-compose up -d
```

Create some users:
```
curl -X POST -H "Content-Type: application/json" http://localhost:8080/api/accounts -d '{"userName": "admin", "password": "abcd1234#"}'
> {"id":"6812ab223dfc1aaa80ed5f56","userName":"admin","createdOn":"2025-04-30T22:58:41.945Z","updatedOn":"2025-04-30T22:58:41.945Z"}%

curl -X POST -H "Content-Type: application/json" http://localhost:8080/api/accounts -d '{"userName": "dserfaty", "password": "abcd1234#"}'
> {"id":"6812abf93dfc1aaa80ed5f59","userName":"dserfaty","createdOn":"2025-04-30T23:02:17.881Z","updatedOn":"2025-04-30T23:02:17.881Z"}%
```

