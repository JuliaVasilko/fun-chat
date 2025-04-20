export type User = {
  isLogined: boolean,
  login: string
}

export type UserPayload = {
  user: User
};

export type UsersPayload = {
  users: User[]
};
