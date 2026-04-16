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
        //TODO: validate request input
        console.log('body', body)
        return authManager.registerUser(body)
    }
}