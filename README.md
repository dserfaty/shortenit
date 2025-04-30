# Shorten It!
## An Express/React Typescript Demo Application
 
**Components**
- MongoDB database
- API in node/express
- Front End: React app

**Notes**

**Future work:**
- have the database be created/migrated by a separate process that will apply migrations rather than manually as here (for larger codebases I favor migrations being applied separately from the micro-service itself so we can better control when to apply them or rollback if needed, especially since we could be running several versions concurrently during rolling deployments or testing features
- allow loading all of a user’s urls, but it would require api pagination
- CORS options should allow only origins relevant to the clients instead of * as it is now
- styling | layout is very basic right now but this can take a lot of time to make right - sorry… :)
- there are unit/integration tests, I believe they are essential and should be part of any good application but this is just a prototype 
- do more code review with regard to protecting against NoSQL attacks. At the moment the input is validated, but I would want to be more thorough in my review. 

**Installation**
