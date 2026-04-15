import { Controller, Get, Post, UseBefore, Req } from "routing-controllers";
import { Request } from "express";
import { AuthMiddleware } from "../middleware/authMiddleware";
import HealthManager from "../managers/healthManager";

@Controller()
export class HealthController {
  healthManager = new HealthManager();

  @Get("/health")
  getHealth() {
    return this.healthManager.healthMessage();
  }

  @Get("/protected")
  @UseBefore(AuthMiddleware)
  getProtected(@Req() req: Request) {
    return {
      message: "Protected route success",
      user: (req as any).user,
    };
  }

  @Post("/test")
  test() {
    return "working";
  }
}