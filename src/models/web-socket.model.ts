export type Message<T = unknown> = {
  id: string | null;
  type: MessageType;
  payload: T;
};

export enum MessageType {
  ERROR = "ERROR",
  USER_LOGIN = "USER_LOGIN",
  USER_LOGOUT = "USER_LOGOUT",
  USER_EXTERNAL_LOGIN = "USER_EXTERNAL_LOGIN",
  USER_EXTERNAL_LOGOUT = "USER_EXTERNAL_LOGOUT",
  USER_ACTIVE = "USER_ACTIVE",
  USER_INACTIVE = "USER_INACTIVE",
  MSG_FROM_USER = "MSG_FROM_USER",
  MSG_SEND = "MSG_SEND",
  MSG_DELETE = "MSG_DELETE",
  MSG_READ = "MSG_READ",
  MSG_EDIT = "MSG_EDIT",
}

export enum ErrorType {
  ALREADY_AUTHORIZED = "a user with this login is already authorized",
  INCORRECT_PASSWORD = "incorrect password"
}

export type ErrorPayload = {
  error: string
}



