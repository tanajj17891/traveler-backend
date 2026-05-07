import dotenv from "dotenv";
import { AuthController } from "./controller/authController";
import { HealthController } from "./controller/healthController";
import { createExpressServer } from "routing-controllers";
import serverless from "serverless-http";

dotenv.config();

const app = createExpressServer({
  cors: {
    origin: /^http:\/\/localhost:\d+$/,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  controllers: [AuthController, HealthController],
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
