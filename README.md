# Shorten It!
## An Express/React Demo Application in Typescript

This is sample demo application that lets users shorten urls.
 
## Components
The app has three components:
- a MongoDB database
- an API in node/express
- a front end which is React app served by nginx

## Notes
For testing convenience, the api and mongo db app are in the same docker compose.

## Future work
Here is some of the work I did not have time to complete or make nice enough to be production ready.

- allow loading all of a user’s urls, but it would require api pagination
- allow editing the slug, it would not be hard because the database structure already allows for easy update as the field is unique.
- CORS options should allow only origins relevant to the clients instead of * as it is now
- styling | layout is very basic right now but this can take a lot of time to make right - sorry… :)
- there are no unit/integration tests, although I wanted to have some as I believe they are essential and should be part of any good application. However I had to sacrifice those in order to have time to add more features for the demo. 
- do more code review with regard to protecting against NoSQL attacks. At the moment the input is validated, but I would want to be more thorough in my review.
- not everything is in configuration as it should. Mea maxima culpa!
 
## Installation
For convenience, the mongodb server and the api server are packaged together.

To start the app clone the repository and:
```
cd shortenit
cd shortenit-server
docker-compose up -d
```

Verify that the api is running:
```
curl "http://localhost:8081/"
> {"message":"Welcome to Shorten It API (v: 0.1)"}%
```

Create some users manually:
```
curl -X POST -H "Content-Type: application/json" http://localhost:8081/api/accounts -d '{"userName": "demouser1", "password": "abcd1234#"}'
> {"id":"6812ab223dfc1aaa80ed5f56","userName":"demouser1","createdOn":"2025-04-30T22:58:41.945Z","updatedOn":"2025-04-30T22:58:41.945Z"}%

curl -X POST -H "Content-Type: application/json" http://localhost:8081/api/accounts -d '{"userName": "demouser2", "password": "abcd1234#"}'
> {"id":"6812abf93dfc1aaa80ed5f59","userName":"demouser2","createdOn":"2025-04-30T23:02:17.881Z","updatedOn":"2025-04-30T23:02:17.881Z"}%
```

Deploy the client application:
```
cd ../shortenit
docker-compose up -d
```

And bring up the UI in a browser by going to:
```
http://localhost:5173/
```

And test the application. You should be able to :
- login with demouser1/abcd1234#
- shorten some urls and copy them
- paste each urls in another tab several times
- go to the dashboard and see the ranked list of links for your account
- logout and try with the second demo user


Happy testing!

 