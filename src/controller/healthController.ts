import { Controller, Get, Post, UseBefore, Req } from "routing-controllers"; //useBefore attaches middleware to a route

import HealthManager from "../managers/healthManager"; //business logic layer
import "reflect-metadata";

@Controller()
export class HealthController {
  healthManager = new HealthManager(); //this class is relling routing controllers to scan the class for routes, creates an object

  @Get("/health")
  getHealth() {
    // throw new BadRequestError({description: "its a bad request"})

    return this.healthManager.healthMessage();
  }

  // @Get("/protected")
  // @UseBefore(AuthMiddleware)
  // getProtected(@Req() req: Request) {
  //   return {
  //     message: "Protected route success",
  //     user: (req as any).user,
  //   };
  // }

  @Post("/test")
  test() {
    return "working";
  }
}
