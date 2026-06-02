import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  Length,
} from "class-validator";

export type CreateUserPostRequest = {
  password: string;
  email: string;
};

export type ConfirmUserPostRequest = {
  username: string;
  code: string;
};

export type LoginPostRequest = {
  password: string;
  email: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ConfirmForgotPasswordRequest = {
  email: string;
  code: string;
  newPassword: string;
};

export type ConfirmUserInput = {
  username: string;
  code: string;
};

//Validation class

export class CreateUserPost {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      "Password must include uppercase, lowercase, number, and special character",
  })
  password: string;

  constructor(data: CreateUserPostRequest) {
    this.email = data.email;
    this.password = data.password;
  }
}

export class ConfirmUserPost {
  @IsNotEmpty({ message: "Username is required" })
  @IsEmail({}, { message: "Username must be a valid email" })
  username: string;

  @IsNotEmpty({ message: "Code is required" })
  @Length(6, 6, { message: "Code must be exactly 6 digits" })
  @Matches(/^\d{6}$/, { message: "Code must be a 6-digit number" })
  code: string;

  constructor(data: ConfirmUserPostRequest) {
    this.username = data.username;
    this.code = data.code;
  }
}

export class LoginPost {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid emaail format" })
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  password: string;

  constructor(data: LoginPostRequest) {
    this.email = data.email;
    this.password = data.password;
  }
}

export class ForgotPasswordPost {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  constructor(data: ForgotPasswordRequest) {
    this.email = data.email;
  }
}

export class ConfirmForgotPasswordPost {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsNotEmpty({ message: "Code is required" })
  @Length(6, 6, { message: "Code must be exactly 6 digits" })
  @Matches(/^\d{6}$/, { message: "Code must be a 6-digit number" })
  code: string;

  @IsNotEmpty({ message: "New password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      "Password must include uppercase, lowercase, number, and special character",
  })
  newPassword: string;

  constructor(data: ConfirmForgotPasswordRequest) {
    this.email = data.email;
    this.code = data.code;
    this.newPassword = data.newPassword;
  }
}
