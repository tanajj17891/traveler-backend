export type RegisterUserInput = {
  username: string;
  password: string;
  email: string;
};

export type confirmUser = {
  username: string;
  password: string;
  email: string;
};

export type login = {
  
  password: string;
  email: string;
};

export type forgotPassword = {
  email: string;
};

export type confirmForgotPassword = {
  email: string;
  code: string;
  newPassword: string;
};