export type CreateUserPostRequest = {
  username: string;
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

export type forgotPassword = {
  email: string;
};

export type confirmForgotPassword = {
  email: string;
  code: string;
  newPassword: string;
};

export type ConfirmUserInput = {
  username: string;
  code: string;
};
