import "./login.css";

import { EventType } from "@/models/event-types";
import { AuthPayload } from "@/services/auth.service";
import { routerService } from "@/services/router.service";
import { Button } from "@/ui/button/button";
import { Input } from "@/ui/input/input";
import { Link } from "@/ui/link/link";
import { Component } from "@/utils/component";
import { authService } from "@@/src";

export class LoginComponent extends Component {
  loginForm = new Component({
    tag: "form",
    className: "login-form",
  });

  nameInputHandler = (event: Event) => {
    console.log(event);
  };

  nameInput = new Input({
    id: "login-input",
    placeholder: "Name",
    type: "text",
    validators: [
      { name: "minLength", value: "4" },
      { name: "maxLength", value: "8" },
      { name: "required", value: "true" },
    ],
    name: "login",
    callback: this.nameInputHandler,
  });

  passwordInputHandler = (event: Event) => {
    console.log(event);
  };

  passwordInput = new Input({
    id: "password-input",
    placeholder: "Password",
    type: "password",
    validators: [
      { name: "minLength", value: "4" },
      { name: "maxLength", value: "8" },
      { name: "required", value: "true" },
      { name: "pattern", value: "^(?=.*[a-z])(?=.*[A-Z]).*$" },
    ],
    name: "password",
    callback: this.passwordInputHandler,
  });

  submitButton = new Button({
    text: "Submit",
  });

  constructor() {
    super({ className: "login" });

    this.loginForm.appendChildren([
      this.nameInput,
      this.passwordInput,
      this.submitButton,
    ]);

    this.loginForm.addListener("submit", this.submitHandler);

    this.appendChildren([
      this.loginForm,
      new Link({ url: "about-us", text: "About Us!" }),
    ]);
    this.addEventSubscribe(EventType.USER_LOGIN, this.userLoginHandler);
  }

  submitHandler = (event?: Event): void => {
    if (event) {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);

      const formObject: Record<string, FormDataEntryValue> = {};
      formData.forEach((value, key) => {
        formObject[key] = value;
      });

      authService.login(formObject as AuthPayload);
    }
  };

  private userLoginHandler = (): void => {
    routerService.navigate("/main");
  };
}
