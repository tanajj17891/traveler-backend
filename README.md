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

# Backend connection to my supabase database

- Schema is defined in prisma/schema.prisma with a Profile model containing:
- id — auto generated UUID
- cognitoSub — unique identifier from Cognito (links profile to logged in user)
- firstName, lastName, email, gender, dateOfBirth, state, city
- travelStyle — array of enums (BEACH_AND_SUN, ADVENTURE, CITY_BREAKS, etc.)
- preferences — array of enums (SOLO_TRAVELER, TRAVELING_WITH_KIDS, BUDGET_CONSCIOUS)
- createdAt, updatedAt — auto managed timestamps

# What is CognitoSub

- cognitoSub is the unique ID that Cognito assigns to every user when they sign up. It's like a user ID — we use it to link the profile in our database to the logged in Cognito user. When someone logs in, their access token contains their cognitoSub, so we can look up their profile.

# how to redploy backend

- ## Backend Redeployment

Use these steps whenever backend code changes need to be deployed to AWS Lambda.

### 1. Open the backend project

serverless.yml
package.json
src/
prisma/
.env

````

### 2. Confirm `.env` exists

```bash
ls -la
````

### 2. Confirm `serverless.yml` loads `.env`

### 3. Generate Prisma Client

Run this whenever the Prisma schema or Prisma binary targets change:

npx prisma generate

### 5. Build the backend

```bash
npm run build
```

The build may finish without printing much output. If there are no TypeScript errors, it succeeded.

### 6. Deploy to the existing development environment

```bash
npx serverless deploy --stage dev
```

Wait for output similar to:

```text
Service deployed to stack traveler-backend-dev

endpoint: ANY - https://gwof0lato0.execute-api.us-east-1.amazonaws.com/{proxy+}

functions:
  api: traveler-backend-dev-api
```

### 7. Verify the deployment

Open:

```text
AWS Console
→ Lambda
→ traveler-backend-dev-api
```

Confirm that **Last modified** shows the current time.

### 8. Test the backend

The production API domain is:

```text
https://api.littletraveler.net
```

The frontend Axios configuration should use:

```ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.littletraveler.net",
});

export default api;
```

Open the app and inspect requests in:

```text
Developer Tools
→ Network
→ Fetch/XHR
```

Confirm requests are going to:

```text
https://api.littletraveler.net
```

### 9. Check errors

For Lambda errors:

```text
AWS Console
→ Lambda
→ traveler-backend-dev-api
→ Monitor
→ View CloudWatch logs
```

Open the newest log stream and find the latest error.

## Quick redeployment commands

For a normal backend code change:

```bash
cd /Users/tanajjzahir/development/projects/traveler/traveler-backend
npm run build
npx serverless deploy --stage dev
```

For a Prisma-related change:

```bash
cd /Users/tanajjzahir/development/projects/traveler/traveler-backend
npx prisma generate
npm run build
npx serverless deploy --stage dev
```

For Lambda, use the Supabase transaction-pooler connection string rather than the direct database address.

The URL should include:

```text
pgbouncer=true&connection_limit=1
```

## Frontend Redeployment

1. Open the frontend project:

```bash
cd /Users/tanajjzahir/development/projects/traveler/traveler-frontend
```

2. Confirm the API base URL is:

```ts
baseURL: "https://api.littletraveler.net";
```

3. Build the frontend:

```bash
npm run build
```

4. Open the generated folder:

```bash
open dist
```

5. Open AWS Console → S3 → `littletraveler.net`.

6. Upload the contents inside `dist`, not the `dist` folder itself.

7. Keep this structure in S3:

```text
index.html
favicon.svg
icons.svg
traveler-logo.svg
assets/
```

8. Make sure the generated `.js` and `.css` files are inside:

```text
assets/
```

9. Replace existing files when prompted.

10. Repeat the upload for `www.littletraveler.net` only if that bucket also hosts a full copy of the frontend.

11. In each hosting bucket, open:

```text
Properties → Static website hosting → Edit
```

12. Set:

```text
Index document: index.html
Error document: index.html
```

13. Save.

14. Open AWS Console → CloudFront.

15. Select the distribution for `littletraveler.net`.

16. Open **Invalidations**.

17. Create an invalidation for:

```text
/*
```

18. Wait for the invalidation to complete.

19. Open:

```text
https://littletraveler.net
```

20. Hard refresh:

```text
Command + Shift + R
```
