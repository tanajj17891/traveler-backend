# traveler-backend

# What is a Route?

- A URL + A FUNCTION THAT RUNS WHEN SOMEONE VISITS A SITE, when someone hits the url, run this code and send back a response
- if someone hits a / or something then server decides where to go

# TYPES OF ROUTES

- GET (reads data)
- POST()
- PUT(updates)
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
- It runs BEFORE controller

# What is a controller?

- An array that tells the server where to find your logic.
- Where routes live + how requests are handled

# What does createExpressserver() mean?

- This is the core function from the routing-controllers library. It creates a new Express app instance and automatically mounts your controllers.

# Backend Logic

# Server.ts

- Server.ts starts ther backend
- uses routing controllers :explained above
- automatically routes controllers hence no manual express set up needed

# Controller

- defines API routes using decorators

# Middleware

- verifies cognito token
- blocks or allows requests

# Manager

- business logic
- keeps controller clean

# What is async?

- When you put async in front of a function it means the function will do something that takes time — like waiting for a response from AWS. Instead of freezing everything while it waits, it lets the rest of your app keep running.

# What is await?

- The await says "pause here and wait for this to finish before moving on." Without it, your code would move to the next line before AWS even responded.

# Difference between class-validators and cognito

- class-validator is the receptionist who checks if you filled out the form correctly before it goes anywhere. Missing your name? Sent back instantly.
- Cognito runtime errors are what happens after the form is submitted and HR actually reviews it. Everything was filled out, but your references didn't check out.
