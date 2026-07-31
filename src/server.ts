import "reflect-metadata";
import dotenv from "dotenv";
import { AuthController } from "./controller/authController";
import { HealthController } from "./controller/healthController";
import { createExpressServer } from "routing-controllers";
import serverless from "serverless-http";
import { ErrorMiddleware } from "./middleware/errorMiddleware";
import { ProfileController } from "./controller/profileController";
import { AuthMiddleware } from "./middleware/authMiddleware";
import { TripController } from "./controller/tripController";
import { LocationController } from "./controller/locationController";
import { BudgetController } from "./controller/budgetController";

dotenv.config();

const app = createExpressServer({
  cors: {
    origin: [
      "http://localhost:5173",
      "https://littletraveler.net",
      "https://www.littletraveler.net",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  controllers: [
    AuthController,
    HealthController,
    ProfileController,
    TripController,
    LocationController,
    BudgetController,
  ],
  middlewares: [ErrorMiddleware],
  defaultErrorHandler: false,
});

const PORT = process.env.PORT || 5001;

// for local development
if (process.env.IS_LOCAL) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

// for Lambda
export const handler = serverless(app);
