# traveler-backend
# What is a Route?
- A URL + A FUNCTION THAT RUNS WHEN SOMEONE VISITS A SITE, when someone hits the url, run this code and send back a response
- if someone hits a / or something then server decides where to go
# TYPES OF ROUTES
- GET (reads data)
- POST(reads data)
- PUT
- DELETE

# What is express router?
- a mini app that lives inside the main web application
- we define our routes in a new file
- we can use router.get() or router.post() just like we'd use it in the main app

# Middleware logic 
- Frontend → sends request with token
        ↓
Middleware runs
        ↓
Check header
        ↓
Verify token with Cognito
        ↓
IF valid → next()
IF invalid → 401
        ↓
Controller runs (only if valid)

- Middleware is like a security gate before API runs

# What is a controller?
- An array that tells the server where to find your logic.
# What does createExpressserver() mean?
- This is the core function from the routing-controllers library. It creates a new Express app instance and automatically mounts your controllers.
