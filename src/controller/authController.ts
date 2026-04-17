import { Request, Response } from "express";
import { AuthManager } from "../managers/authManager";
import { Body, Controller, JsonController, Post } from "routing-controllers";
import { RegisterUserInput } from "../models/authenticationModels";
import 'reflect-metadata';

const authManager = new AuthManager();

@JsonController('/auth')
export class AuthController {
  
    @Post('/create-user')
    createUser(@Body() body: RegisterUserInput) {
        console.log('body', body)
        return authManager.registerUser(body)
    }

    @Post('/confirm-user')
    confirmUser(@Body() body: { username: string; code: string }) {
        return authManager.confirmUser(body);
    }
@Post('/login')
loginUser(@Body() body: { email: string; password: string }) {
    return authManager.loginUser(body.email, body.password);
}

}