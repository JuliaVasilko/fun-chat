import './main-header.css'

import { EventType } from "@/models/event-types";
import { routerService } from "@/services/router.service";
import { Button } from "@/ui/button/button";
import { Link } from "@/ui/link/link";
import { Component } from "@/utils/component";
import { authService } from "@@/src";

export class MainHeader extends Component {
  authService = authService;
  routerService = routerService;

  constructor() {
    super({ tag: "header", className: "main-header" });

    const children = [
      new Component({ text: `User: ${this.authService.getUser()?.login}` }),
      new Component({ tag: "h1", text: "Boring Chat" }),
      new Link({ url: "about-us", text: `About Us` }),
      new Button({ text: `Logout`, callback: this.logoutClickHandler }),
    ];

    this.appendChildren(children);

    this.addEventSubscribe(EventType.USER_LOGOUT, this.logoutHandler);
  }

  private logoutClickHandler = (): void => {
    this.authService.logout();
  };

  private logoutHandler = (): void => {
    this.routerService.navigate("/login");
  };
}
