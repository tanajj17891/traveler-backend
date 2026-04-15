import { ExpressMiddlewareInterface, Middleware } from "routing-controllers"; // lets me create a class for middleware, decorator to register it
import { Request, Response, NextFunction } from "express"; // express objects
import { CognitoJwtVerifier } from "aws-jwt-verify"; //verifies cognito tokens
import dotenv from "dotenv"; // loads .env

dotenv.config(); // loads the env file

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  tokenUse: "access", // validates access token
  clientId: process.env.COGNITO_CLIENT_ID!,
}); // creates a token validator, checks if token belongs to user pool

@Middleware({ type: "before" })
export class AuthMiddleware implements ExpressMiddlewareInterface {
  async use(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const authHeader = req.headers.authorization; // looks for auth bearer token

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      } //if header is missing then it rejects it same for not bearer

      const token = authHeader.split(" ")[1]; //extracts token

      const payload = await verifier.verify(token); // it checks for valid signature, if token is expired, issued by cognito pool, matches client ID

      (req as any).user = payload;
      next();
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  }
}