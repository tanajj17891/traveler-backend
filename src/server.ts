import express from "express";
import dotenv from "dotenv";
import { AuthController } from "./controller/authController";
import { createExpressServer } from "routing-controllers";
import { HealthController } from "./controller/healthController";

dotenv.config();

// creates express app, registers all controller routes and returns you express app instance
const app = createExpressServer({
  controllers: [AuthController, HealthController], // we specify controllers we want to use
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});