export type BaseUserType = {
  email: string;
  password: string;
};

export type SignUpType = BaseUserType & {
  username: string;
};

export type LoginUserType = BaseUserType;

export type ErrorResponse = {
  message: string;
};
