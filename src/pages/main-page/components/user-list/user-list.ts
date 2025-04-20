import "./user-list.css";

import { EventType } from "@/models/event-types";
import { User } from "@/models/user.model";
import { UserListItem } from "@/pages/main-page/components/user-list-item/user-list-item";
import { AuthPayload } from "@/services/auth.service";
import { Component } from "@/utils/component";
import { userService, authService } from "@@/src";

export class UserList extends Component {
  userService = userService;
  authService = authService;

  users: User[] | null = null;
  currentUser: AuthPayload | null = null;

  constructor() {
    super({ tag: "ul", className: "user-list" });
    this.addEventSubscribe(EventType.USERS_LOADED, this.userLoadedHandler);
    this.addEventSubscribe(EventType.USER_EXTERNAL_LOGIN, this.userLoginHandler);

    this.userService.getUsers();
    this.currentUser = this.authService.getUser();
  }

  userLoadedHandler = (users: User[]): void => {
    this.users = users.filter(user => user.login !== this.currentUser?.login);
    const userComponents = this.users.map(user => new UserListItem(user));

    this.appendChildren(userComponents);
  };

  userLoginHandler = (loggedUser: User): void => {
    if (this.users && this.users.every((user) => user.login !== loggedUser.login)) {
      this.users.push(loggedUser);
      this.append(new UserListItem(loggedUser));
    }
  };

  remove(): void {
    this.userService.clearUsers();
    super.remove();
  }
}
