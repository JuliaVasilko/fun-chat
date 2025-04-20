var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const loginPageGuard = async () => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? "main" : true;
};
const mainPageGuard = async () => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? true : "login";
};
class Component {
  constructor({ tag = "div", className = "", text = "" }, children) {
    __publicField(this, "node");
    __publicField(this, "children", []);
    __publicField(this, "disabled", false);
    __publicField(this, "events", []);
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    this.node = node;
    if (children) {
      this.appendChildren(children);
    }
  }
  createElement(tag) {
    const node = document.createElement(tag);
    this.node = node;
  }
  addEventSubscribe(eventName, callback) {
    this.events.push([eventName, callback]);
    eventEmitter.subscribe(eventName, callback);
  }
  appendChildren(children) {
    children.forEach((element) => {
      this.append(element);
    });
  }
  append(child) {
    this.children.push(child);
    this.node.append(child.getNode());
  }
  getNode() {
    return this.node;
  }
  getChildren() {
    return this.children;
  }
  setTextContent(text) {
    this.node.textContent = text;
  }
  setAttribute(attribute, value) {
    this.node.setAttribute(attribute, value);
  }
  removeAttribute(attribute) {
    this.node.removeAttribute(attribute);
  }
  toggleClass(className) {
    this.node.classList.toggle(className);
  }
  addClass(className) {
    this.node.classList.add(className);
  }
  removeClass(className) {
    if (this.node.classList.contains(className)) {
      this.node.classList.remove(className);
    }
  }
  setDisabled(disabled) {
    this.disabled = disabled;
  }
  getDisabled() {
    return this.disabled;
  }
  addListener(event, callback, options) {
    this.node.addEventListener(event, callback, options);
  }
  removeListener(event, callback, options) {
    this.node.removeEventListener(event, callback, options);
  }
  removeChildren() {
    this.children.forEach((child) => {
      child.remove();
    });
    this.children.length = 0;
  }
  remove() {
    this.events.forEach(([eventName, callback]) => {
      eventEmitter.unsubscribe(eventName, callback);
    });
    this.removeChildren();
    this.node.remove();
  }
}
class AboutUsComponent extends Component {
  constructor() {
    super({
      text: "This chat isn’t fun at all. It’s overloaded with irrelevant requirements compared to what we’re actually supposed to be learning in this task — namely WebSockets. And to be honest, I’m really fed up with working with the DOM and interacting with it using native methods. It’s just not relevant in today’s development landscape."
    });
  }
}
class ErrorPage extends Component {
  constructor() {
    super({ className: "error-page" }, [
      new Component({ tag: "h1", text: "Page not found" })
    ]);
  }
}
var EventType = /* @__PURE__ */ ((EventType2) => {
  EventType2["USER_LOGIN"] = "USER_LOGIN";
  EventType2["USER_LOGOUT"] = "USER_LOGOUT";
  EventType2["USER_EXTERNAL_LOGIN"] = "USER_EXTERNAL_LOGIN";
  EventType2["USER_EXTERNAL_LOGOUT"] = "USER_EXTERNAL_LOGOUT";
  EventType2["USERS_LOADED"] = "USERS_LOADED";
  EventType2["GET_MSG_FROM_USER"] = "GET_MSG_FROM_USER";
  EventType2["CHOOSE_USER"] = "CHOOSE_USER";
  EventType2["MSG_DELETED"] = "MSG_DELETED";
  EventType2["MSG_SENT"] = "MSG_SENT";
  EventType2["MSG_READED"] = "MSG_READED";
  EventType2["READ_ALL_MSG"] = "READ_ALL_MSG";
  EventType2["MSG_EDIT"] = "MSG_EDIT";
  EventType2["START_MSG_EDIT"] = "START_MSG_EDIT";
  EventType2["ALL_MSG_READED"] = "ALL_MSG_READED";
  return EventType2;
})(EventType || {});
class Button extends Component {
  constructor(props) {
    super({ tag: "button", className: props.className, text: props.text });
    __publicField(this, "callback");
    if (props.callback) {
      this.callback = props.callback;
      this.addListener("click", (event) => props.callback(event));
    }
  }
  setDisabled(disabled) {
    super.setDisabled(disabled);
    this.getNode().disabled = this.getDisabled();
  }
  remove() {
    if (this.callback) {
      this.removeListener("click", this.callback);
    }
  }
}
class Input extends Component {
  constructor(props) {
    super({ tag: "input", className: "input" });
    this.setInputProperties(props);
  }
  setDisabled(disabled) {
    super.setDisabled(disabled);
    this.getNode().disabled = this.getDisabled();
  }
  setInputProperties({
    type,
    placeholder,
    id,
    validators,
    value = "",
    name,
    callback
  }) {
    const input = this.getNode();
    input.type = type;
    input.placeholder = placeholder ?? "";
    input.value = value;
    if (name) {
      input.name = name;
    }
    if (id) {
      input.id = id;
    }
    if (callback) {
      this.addListener("input", (event) => callback(event));
    }
    validators == null ? void 0 : validators.forEach(
      (validator) => this.setAttribute(validator.name, validator.value)
    );
  }
}
class Link extends Component {
  constructor({ url, className, text, preventedCallback }) {
    super({ tag: "a", className, text });
    this.setAttribute("href", url);
    this.addListener("click", (event) => {
      event == null ? void 0 : event.preventDefault();
      if (preventedCallback) {
        if (preventedCallback(event)) {
          return;
        }
      }
      if (this.getDisabled()) {
        return;
      }
      routerService.navigate(`/${url}`);
    });
  }
}
class LoginComponent extends Component {
  constructor() {
    super({ className: "login" });
    __publicField(this, "loginForm", new Component({
      tag: "form",
      className: "login-form"
    }));
    __publicField(this, "nameInputHandler", (event) => {
      console.log(event);
    });
    __publicField(this, "nameInput", new Input({
      id: "login-input",
      placeholder: "Name",
      type: "text",
      validators: [
        { name: "minLength", value: "4" },
        { name: "maxLength", value: "8" },
        { name: "required", value: "true" }
      ],
      name: "login",
      callback: this.nameInputHandler
    }));
    __publicField(this, "passwordInputHandler", (event) => {
      console.log(event);
    });
    __publicField(this, "passwordInput", new Input({
      id: "password-input",
      placeholder: "Password",
      type: "password",
      validators: [
        { name: "minLength", value: "4" },
        { name: "maxLength", value: "8" },
        { name: "required", value: "true" },
        { name: "pattern", value: "^(?=.*[a-z])(?=.*[A-Z]).*$" }
      ],
      name: "password",
      callback: this.passwordInputHandler
    }));
    __publicField(this, "submitButton", new Button({
      text: "Submit"
    }));
    __publicField(this, "submitHandler", (event) => {
      if (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formObject = {};
        formData.forEach((value, key) => {
          formObject[key] = value;
        });
        authService.login(formObject);
      }
    });
    __publicField(this, "userLoginHandler", () => {
      routerService.navigate("/main");
    });
    this.loginForm.appendChildren([
      this.nameInput,
      this.passwordInput,
      this.submitButton
    ]);
    this.loginForm.addListener("submit", this.submitHandler);
    this.appendChildren([
      this.loginForm,
      new Link({ url: "about-us", text: "About Us!" })
    ]);
    this.addEventSubscribe(EventType.USER_LOGIN, this.userLoginHandler);
  }
}
class MessageComponent extends Component {
  constructor(message) {
    var _a;
    super({ className: "message-row" });
    __publicField(this, "currentUserLogin");
    __publicField(this, "messageAuthor", new Component({ className: "message-author" }));
    __publicField(this, "messageTime", new Component({ className: "message-time" }));
    __publicField(this, "messageText", new Component({ className: "message-text" }));
    __publicField(this, "messageEdited", new Component({ className: "message-edited" }));
    __publicField(this, "messageStatus");
    __publicField(this, "editBtn");
    __publicField(this, "deleteBtn");
    __publicField(this, "isFromMe", false);
    __publicField(this, "authService", authService);
    __publicField(this, "messageService", messageService);
    __publicField(this, "eventEmitter", eventEmitter);
    __publicField(this, "messageReadedHandler", (id) => {
      if (this.messageStatus && id === this.message.id) {
        this.messageStatus.setTextContent("Was Read");
      }
      this.removeClass("unread-message-item");
      this.eventEmitter.emit(EventType.ALL_MSG_READED, this.message.from);
    });
    __publicField(this, "allMessageReadedHandler", () => {
      if (!this.isFromMe && !this.message.status.isReaded) {
        this.messageService.readUserMessage(this.message.id);
        this.removeClass("unread-message-item");
      }
    });
    __publicField(this, "messageDeleteHandler", (id) => {
      if (this.message.id === id) {
        this.remove();
      }
    });
    __publicField(this, "messageClickHandler", () => {
      if (!this.isFromMe) {
        this.eventEmitter.emit(EventType.READ_ALL_MSG, this.message.from);
      }
    });
    __publicField(this, "editMessageHandler", ({ message }) => {
      if (message.id === this.message.id) {
        this.message.text = message.text;
        this.message.status.isEdited = message.status.isEdited;
        this.setMessageText();
        this.setMessageEdited();
      }
    });
    __publicField(this, "editBtnClickHandler", () => {
      this.eventEmitter.emit(EventType.START_MSG_EDIT, this.message);
    });
    __publicField(this, "deleteBtnClickHandler", () => {
      this.messageService.deleteUserMessage(this.message.id);
    });
    this.message = message;
    this.addEventSubscribe(EventType.MSG_DELETED, this.messageDeleteHandler);
    this.addEventSubscribe(EventType.MSG_READED, this.messageReadedHandler);
    this.addEventSubscribe(EventType.READ_ALL_MSG, this.allMessageReadedHandler);
    this.addEventSubscribe(EventType.MSG_EDIT, this.editMessageHandler);
    this.currentUserLogin = (_a = this.authService.getUser()) == null ? void 0 : _a.login;
    this.isFromMe = this.currentUserLogin === this.message.from;
    this.addListener("click", this.messageClickHandler);
    this.setMessageAuthor();
    this.setMessageDate();
    this.setMessageText();
    this.setMessageEdited();
    const children = [
      new Component(
        {
          className: "message-data"
        },
        [
          this.messageAuthor,
          this.messageTime
        ]
      ),
      this.messageText
    ];
    if (!this.isFromMe && !this.message.status.isReaded) {
      this.addClass("unread-message-item");
    }
    const messageItem = new Component({ className: "message-container" }, children);
    this.append(messageItem);
    if (this.isFromMe) {
      this.editBtn = new Button({ text: "Edit", callback: this.editBtnClickHandler });
      this.deleteBtn = new Button({ text: "Delete", callback: this.deleteBtnClickHandler });
      this.messageStatus = new Component({ className: "message-status" });
      messageItem.append(
        new Component({ className: "button-block" }, [
          this.messageStatus,
          this.deleteBtn,
          this.editBtn
        ])
      );
      this.setMessageStatus();
    } else {
      messageItem.append(this.messageEdited);
    }
  }
  setMessageAuthor() {
    if (this.currentUserLogin) {
      this.messageAuthor.setTextContent(this.isFromMe ? "you" : this.message.from);
      this.addClass(this.isFromMe ? "from-me" : "to-me");
    }
  }
  setMessageDate() {
    const date = new Date(this.message.datetime);
    const formatedDate = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(date);
    this.messageTime.setTextContent(formatedDate);
  }
  setMessageText() {
    this.messageText.setTextContent(this.message.text);
  }
  setMessageEdited() {
    if (!this.isFromMe) {
      this.messageEdited.setTextContent(this.message.status.isEdited ? "Edited" : "");
    }
  }
  setMessageStatus() {
    const { isDelivered, isReaded } = this.message.status;
    const status = isReaded ? "Was Read" : isDelivered ? "Delivered" : "Sent";
    this.messageStatus.setTextContent(status);
  }
  remove() {
    this.removeListener("click", this.messageClickHandler);
    super.remove();
  }
}
class DialogContainer extends Component {
  constructor() {
    super({ tag: "article", className: "dialog-container" });
    __publicField(this, "inputHandler", (event) => {
      if (event.target.value === "") {
        this.submitButton.setDisabled(true);
      } else {
        this.submitButton.setDisabled(false);
      }
    });
    __publicField(this, "cancelEditingHandler", (event) => {
      if (event) {
        event.preventDefault();
      }
      this.isEditMode = false;
      this.editedMessage = null;
      this.input.getNode().value = "";
      this.submitButton.setDisabled(true);
      this.cancelButton.addClass("hide-button");
    });
    __publicField(this, "messageService", messageService);
    __publicField(this, "isEditMode", false);
    __publicField(this, "editedMessage", null);
    __publicField(this, "currentUser", null);
    __publicField(this, "userDataComponent", new Component({ className: "user-data" }));
    __publicField(this, "messageHistoryContainer", new Component(
      { className: "message-history" },
      [new Component({ text: "chose user to start conversation" })]
    ));
    __publicField(this, "messageForm", new Component({ tag: "form", className: "message-form" }));
    __publicField(this, "input", new Input({
      type: "text",
      placeholder: "your message...",
      name: "message",
      id: "message-input",
      callback: this.inputHandler
    }));
    __publicField(this, "submitButton", new Button({ text: "Send Message" }));
    __publicField(this, "cancelButton", new Button({ text: "Cancel", callback: this.cancelEditingHandler }));
    __publicField(this, "changeCurrentUserHandler", ({ login, isLogined }) => {
      this.currentUser = login;
      this.messageHistoryContainer.removeChildren();
      this.input.setDisabled(false);
      this.cancelEditingHandler();
      this.messageService.getUserMessage(login);
      this.userDataComponent.setTextContent(`${login}: ${isLogined ? "online" : "offline"}`);
    });
    __publicField(this, "messageHandler", ({ messages }) => {
      if (this.currentUser) {
        if (messages.length > 0) {
          const messageComponents = messages.map((message) => {
            return new MessageComponent(message);
          });
          this.messageHistoryContainer.appendChildren(messageComponents);
          this.messageHistoryContainer.getNode().scrollTo({
            top: 1e7,
            behavior: "smooth"
          });
        } else {
          const emptyMessage = new Component({ text: "start conversation here" });
          this.messageHistoryContainer.append(emptyMessage);
        }
      }
    });
    __publicField(this, "messageSentHandler", (message) => {
      if (message.from === this.currentUser || message.to === this.currentUser) {
        const newMessage = new MessageComponent(message);
        if (message.from === this.currentUser) {
          this.messageService.readUserMessage(message.id);
        }
        this.messageHistoryContainer.append(newMessage);
        this.messageHistoryContainer.getNode().scrollTo({
          top: 1e7,
          behavior: "smooth"
        });
      }
    });
    __publicField(this, "sendMessageHandler", (event) => {
      if (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formObject = {};
        formData.forEach((value, key) => {
          formObject[key] = value;
        });
        const message = formObject.message;
        if (this.currentUser) {
          if (this.isEditMode && this.editedMessage) {
            this.messageService.editUserMessage(this.editedMessage.id, message);
            this.cancelEditingHandler();
          } else {
            this.messageService.sendUserMessage(this.currentUser, message);
          }
        }
        this.input.getNode().value = "";
        this.submitButton.setDisabled(true);
      }
    });
    __publicField(this, "startMessageEditHandler", (message) => {
      this.isEditMode = true;
      this.editedMessage = message;
      this.input.getNode().value = this.editedMessage.text;
      this.submitButton.setDisabled(false);
      this.cancelButton.removeClass("hide-button");
    });
    this.input.setDisabled(true);
    this.submitButton.setDisabled(true);
    this.cancelButton.addClass("hide-button");
    this.messageForm.appendChildren([
      this.input,
      this.submitButton
    ]);
    this.messageForm.addListener("submit", this.sendMessageHandler);
    this.appendChildren([this.userDataComponent, this.messageHistoryContainer, new Component({ className: "action-container" }, [this.messageForm, this.cancelButton])]);
    this.addEventSubscribe(EventType.GET_MSG_FROM_USER, this.messageHandler);
    this.addEventSubscribe(EventType.CHOOSE_USER, this.changeCurrentUserHandler);
    this.addEventSubscribe(EventType.MSG_SENT, this.messageSentHandler);
    this.addEventSubscribe(EventType.START_MSG_EDIT, this.startMessageEditHandler);
  }
  remove() {
    this.messageForm.removeListener("submit", this.sendMessageHandler);
    super.remove();
  }
}
class UserListItem extends Component {
  constructor(user) {
    super({ tag: "li" });
    __publicField(this, "userNameComponent");
    __publicField(this, "unreadMessage");
    __publicField(this, "messageRequestId");
    __publicField(this, "messageService", messageService);
    __publicField(this, "eventEmitter", eventEmitter);
    __publicField(this, "unreadMessages", 0);
    __publicField(this, "messageReadedHandler", (login) => {
      if (login === this.user.login) {
        this.unreadMessages = 0;
        this.unreadMessage.setTextContent("");
      }
    });
    __publicField(this, "userStatusHandler", (user) => {
      if (this.user.login !== user.login) {
        return;
      }
      if (user.isLogined) {
        this.addClass("green");
      } else {
        this.removeClass("green");
      }
    });
    __publicField(this, "messageStatusHandler", ({ id, messages }) => {
      if (this.messageRequestId === id) {
        this.unreadMessages = messages.filter((message) => !message.status.isReaded && message.from === this.user.login).length;
        this.unreadMessage.setTextContent(this.unreadMessages ? String(this.unreadMessages) : "");
      }
    });
    __publicField(this, "receiveMessageHandler", (message) => {
      if (message.from === this.user.login && !message.status.isReaded) {
        this.unreadMessages++;
        this.unreadMessage.setTextContent(this.unreadMessages ? String(this.unreadMessages) : "");
      }
    });
    __publicField(this, "clickHandler", () => {
      this.eventEmitter.emit(EventType.CHOOSE_USER, this.user);
    });
    this.user = user;
    this.addEventSubscribe(EventType.USER_EXTERNAL_LOGIN, this.userStatusHandler);
    this.addEventSubscribe(EventType.USER_EXTERNAL_LOGOUT, this.userStatusHandler);
    this.addEventSubscribe(EventType.GET_MSG_FROM_USER, this.messageStatusHandler);
    this.addEventSubscribe(EventType.MSG_SENT, this.receiveMessageHandler);
    this.addEventSubscribe(EventType.ALL_MSG_READED, this.messageReadedHandler);
    this.messageRequestId = this.messageService.getUserMessage(this.user.login);
    this.userNameComponent = new Component({ className: "user-item", text: this.user.login });
    if (this.user.isLogined) {
      this.addClass("green");
    }
    this.unreadMessage = new Component({ className: "unread-message" });
    const content = new Component({ className: "content-wrapper" }, [
      this.userNameComponent,
      this.unreadMessage
    ]);
    this.append(content);
    this.addListener("click", this.clickHandler);
  }
  remove() {
    this.removeListener("click", this.clickHandler);
    super.remove();
  }
}
class UserList extends Component {
  constructor() {
    super({ tag: "ul", className: "user-list" });
    __publicField(this, "userService", userService);
    __publicField(this, "authService", authService);
    __publicField(this, "users", null);
    __publicField(this, "currentUser", null);
    __publicField(this, "userLoadedHandler", (users) => {
      this.users = users.filter((user) => {
        var _a;
        return user.login !== ((_a = this.currentUser) == null ? void 0 : _a.login);
      });
      const userComponents = this.users.map((user) => new UserListItem(user));
      this.appendChildren(userComponents);
    });
    __publicField(this, "userLoginHandler", (loggedUser) => {
      if (this.users && this.users.every((user) => user.login !== loggedUser.login)) {
        this.users.push(loggedUser);
        this.append(new UserListItem(loggedUser));
      }
    });
    this.addEventSubscribe(EventType.USERS_LOADED, this.userLoadedHandler);
    this.addEventSubscribe(EventType.USER_EXTERNAL_LOGIN, this.userLoginHandler);
    this.userService.getUsers();
    this.currentUser = this.authService.getUser();
  }
  remove() {
    this.userService.clearUsers();
    super.remove();
  }
}
class ChatContainer extends Component {
  constructor() {
    super({ tag: "section", className: "chat-container" }, [
      new UserList(),
      new DialogContainer()
    ]);
  }
}
class MainFooter extends Component {
  constructor() {
    super({ tag: "footer", className: "main-footer" });
    const logo = new Component({ className: "logo" });
    const logoImg = new Component({ tag: "img" });
    logoImg.setAttribute("src", "public/rss-logo.svg");
    logo.appendChildren([
      logoImg,
      new Component({ tag: "span", text: "RS School" })
    ]);
    const linkToGithub = new Component({ tag: "a", className: "github-link", text: "GitHub" });
    linkToGithub.setAttribute("href", "https://github.com/JuliaVasilko");
    linkToGithub.setAttribute("target", "_blanc");
    const children = [
      logo,
      linkToGithub,
      new Component({ tag: "span", text: "2025" })
    ];
    this.appendChildren(children);
  }
}
class MainHeader extends Component {
  constructor() {
    var _a;
    super({ tag: "header", className: "main-header" });
    __publicField(this, "authService", authService);
    __publicField(this, "routerService", routerService);
    __publicField(this, "logoutClickHandler", () => {
      this.authService.logout();
    });
    __publicField(this, "logoutHandler", () => {
      this.routerService.navigate("/login");
    });
    const children = [
      new Component({ text: `User: ${(_a = this.authService.getUser()) == null ? void 0 : _a.login}` }),
      new Component({ tag: "h1", text: "Boring Chat" }),
      new Link({ url: "about-us", text: `About Us` }),
      new Button({ text: `Logout`, callback: this.logoutClickHandler })
    ];
    this.appendChildren(children);
    this.addEventSubscribe(EventType.USER_LOGOUT, this.logoutHandler);
  }
}
class MainComponent extends Component {
  constructor() {
    super({ className: "main-page" });
    this.appendChildren(
      [new MainHeader(), new ChatContainer(), new MainFooter()]
    );
  }
}
const routes = {
  "/": {
    redirectTo: "/login"
  },
  "/login": {
    component: () => new LoginComponent(),
    guards: [loginPageGuard]
  },
  "/main": {
    component: () => new MainComponent(),
    guards: [mainPageGuard]
  },
  "/about-us": {
    component: () => new AboutUsComponent()
  },
  "/404": {
    component: () => new ErrorPage()
  }
};
class RouterService {
  constructor(routes2) {
    __publicField(this, "routes");
    __publicField(this, "appRoot");
    __publicField(this, "currentComponent", null);
    this.routes = routes2;
  }
  async navigate(path) {
    const route = this.routes[path] || this.routes["/404"];
    if (!route) return;
    if (route.redirectTo) {
      await this.navigate(route.redirectTo);
      return;
    }
    if (route.guards && route.guards.length > 0) {
      for (const guard of route.guards) {
        const result = await guard();
        if (result === false) {
          return;
        }
        if (typeof result === "string") {
          await this.navigate(result);
          return;
        }
      }
    }
    history.pushState(null, "", path);
    await this.renderRoute();
  }
  init(root) {
    window.addEventListener("popstate", () => this.renderRoute());
    this.appRoot = root;
    this.navigate(window.location.pathname);
  }
  async renderRoute() {
    var _a;
    const path = window.location.pathname;
    const route = this.routes[path] || this.routes["/404"];
    if (route.component) {
      if (this.currentComponent) {
        this.currentComponent.remove();
        this.currentComponent = null;
      }
      const component = await route.component();
      this.currentComponent = component;
      (_a = this.appRoot) == null ? void 0 : _a.appendChild(component.getNode());
    }
  }
}
const routerService = new RouterService(routes);
class AppComponent extends Component {
  constructor(wsService2, authService2) {
    super({ tag: "main" });
    this.wsService = wsService2;
    this.authService = authService2;
    console.log("created AppComponent");
  }
  async init() {
    document.body.append(this.getNode());
    await this.wsService.connect();
    this.authService.restoreUser();
    routerService.init(this.getNode());
  }
  remove() {
    this.wsService.disconnect();
    super.remove();
  }
}
var MessageType = /* @__PURE__ */ ((MessageType2) => {
  MessageType2["ERROR"] = "ERROR";
  MessageType2["USER_LOGIN"] = "USER_LOGIN";
  MessageType2["USER_LOGOUT"] = "USER_LOGOUT";
  MessageType2["USER_EXTERNAL_LOGIN"] = "USER_EXTERNAL_LOGIN";
  MessageType2["USER_EXTERNAL_LOGOUT"] = "USER_EXTERNAL_LOGOUT";
  MessageType2["USER_ACTIVE"] = "USER_ACTIVE";
  MessageType2["USER_INACTIVE"] = "USER_INACTIVE";
  MessageType2["MSG_FROM_USER"] = "MSG_FROM_USER";
  MessageType2["MSG_SEND"] = "MSG_SEND";
  MessageType2["MSG_DELETE"] = "MSG_DELETE";
  MessageType2["MSG_READ"] = "MSG_READ";
  MessageType2["MSG_EDIT"] = "MSG_EDIT";
  return MessageType2;
})(MessageType || {});
var ErrorType = /* @__PURE__ */ ((ErrorType2) => {
  ErrorType2["ALREADY_AUTHORIZED"] = "a user with this login is already authorized";
  ErrorType2["INCORRECT_PASSWORD"] = "incorrect password";
  return ErrorType2;
})(ErrorType || {});
class Dialog extends Component {
  constructor({
    showOkBtn,
    textOkButton = "Confirm",
    showCancelBtn,
    textCancelButton = "Cancel",
    content
  }) {
    super({ tag: "dialog", className: "dialog" });
    __publicField(this, "contentContainer");
    __publicField(this, "resolve");
    __publicField(this, "reject");
    __publicField(this, "okBtn");
    __publicField(this, "cancelBtn");
    __publicField(this, "actionContainer");
    this.contentContainer = new Component(
      { className: "dialog-content" },
      content
    );
    this.actionContainer = new Component({
      tag: "div",
      className: "dialog-actions"
    });
    if (showOkBtn) {
      this.okBtn = new Button({
        text: textOkButton,
        callback: this.okBtnCallback.bind(this)
      });
      this.actionContainer.append(this.okBtn);
    }
    if (showCancelBtn) {
      this.cancelBtn = new Button({
        text: textCancelButton,
        callback: this.cancelBtnCallback.bind(this)
      });
      this.actionContainer.append(this.cancelBtn);
    }
    this.appendChildren([this.contentContainer, this.actionContainer]);
  }
  showModal() {
    this.getNode().showModal();
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
  closeModal(reason) {
    this.getNode().close();
    if (reason) {
      this.resolve(reason);
    } else {
      this.reject(reason);
    }
    this.resolve = void 0;
    this.reject = void 0;
  }
  okBtnCallback() {
    this.closeModal(true);
  }
  cancelBtnCallback() {
    this.closeModal(false);
  }
}
class AuthService {
  constructor(wsService2, sessionStorageService2, eventEmmiter) {
    __publicField(this, "storageKey", "auth");
    __publicField(this, "currentUser", null);
    __publicField(this, "errorHandler", (message) => {
      const error = message.payload.error;
      switch (error) {
        case ErrorType.ALREADY_AUTHORIZED:
          {
            this.alreadyAuthorizedHandler();
          }
          break;
        case ErrorType.INCORRECT_PASSWORD:
          {
            this.incorrectPasswordHandler();
          }
          break;
      }
    });
    __publicField(this, "userLoginHandler", (message) => {
      const { user } = message.payload;
      if (user.isLogined) {
        this.eventEmmiter.emit(EventType.USER_LOGIN);
      }
    });
    this.wsService = wsService2;
    this.sessionStorageService = sessionStorageService2;
    this.eventEmmiter = eventEmmiter;
    this.wsService.on(MessageType.ERROR, this.errorHandler);
    this.wsService.on(MessageType.USER_LOGIN, this.userLoginHandler);
  }
  restoreUser() {
    const stored = this.sessionStorageService.getItem(this.storageKey);
    if (stored) {
      this.currentUser = stored;
      this.authenticate();
    }
  }
  login(payload) {
    this.currentUser = payload;
    this.sessionStorageService.setItem(this.storageKey, payload);
    this.authenticate();
  }
  logout() {
    if (!this.currentUser) return;
    this.wsService.send(MessageType.USER_LOGOUT, { user: this.currentUser });
    this.currentUser = null;
    this.sessionStorageService.removeItem(this.storageKey);
    this.eventEmmiter.emit(MessageType.USER_LOGOUT);
  }
  authenticate() {
    if (!this.currentUser) return;
    this.wsService.send(MessageType.USER_LOGIN, { user: this.currentUser });
  }
  getUser() {
    return this.currentUser;
  }
  isAuthenticated() {
    return !!this.currentUser;
  }
  alreadyAuthorizedHandler() {
    const dialog = new Dialog({
      showOkBtn: true,
      content: [
        new Component({ tag: "h2", text: "A user with this login is already authorized" })
      ]
    });
    document.body.append(dialog.getNode());
    dialog.showModal();
  }
  incorrectPasswordHandler() {
    const dialog = new Dialog({
      showOkBtn: true,
      content: [
        new Component({ tag: "h2", text: "Login and password don't match" })
      ]
    });
    document.body.append(dialog.getNode());
    dialog.showModal();
  }
}
class MessageService {
  constructor(wsService2, eventEmitter2) {
    __publicField(this, "getUserMessageHandler", (message) => {
      this.eventEmitter.emit(EventType.GET_MSG_FROM_USER, {
        id: message.id,
        messages: message.payload.messages
      });
    });
    __publicField(this, "userMessageSentHandler", (message) => {
      this.eventEmitter.emit(EventType.MSG_SENT, message.payload.message);
    });
    __publicField(this, "userMessageDeleteHandler", (message) => {
      if (message.payload.message.status.isDeleted) {
        this.eventEmitter.emit(EventType.MSG_DELETED, message.payload.message.id);
      }
    });
    __publicField(this, "userMessageReadHandler", (message) => {
      if (message.payload.message.status.isReaded) {
        this.eventEmitter.emit(EventType.MSG_READED, message.payload.message.id);
      }
    });
    __publicField(this, "userMessageEditHandler", (message) => {
      console.log();
      if (message.payload.message.status.isEdited) {
        this.eventEmitter.emit(EventType.MSG_EDIT, message.payload);
      }
    });
    this.wsService = wsService2;
    this.eventEmitter = eventEmitter2;
    this.wsService.on(MessageType.MSG_FROM_USER, this.getUserMessageHandler);
    this.wsService.on(MessageType.MSG_DELETE, this.userMessageDeleteHandler);
    this.wsService.on(MessageType.MSG_SEND, this.userMessageSentHandler);
    this.wsService.on(MessageType.MSG_READ, this.userMessageReadHandler);
    this.wsService.on(MessageType.MSG_EDIT, this.userMessageEditHandler);
  }
  getUserMessage(userLogin) {
    return this.wsService.send(MessageType.MSG_FROM_USER, { user: { login: userLogin } });
  }
  sendUserMessage(to, text) {
    this.wsService.send(MessageType.MSG_SEND, {
      message: {
        text,
        to
      }
    });
  }
  readUserMessage(messageId) {
    this.wsService.send(MessageType.MSG_READ, { message: { id: messageId } });
  }
  deleteUserMessage(id) {
    this.wsService.send(MessageType.MSG_DELETE, { message: { id } });
  }
  editUserMessage(id, text) {
    this.wsService.send(MessageType.MSG_EDIT, { message: { id, text } });
  }
}
class SessionStorageService {
  constructor() {
    __publicField(this, "prefix", "[fun-chat]");
  }
  setItem(key, data) {
    const stringifyData = JSON.stringify(data);
    sessionStorage.setItem(`${this.prefix} ${key}`, stringifyData);
  }
  getItem(key) {
    const data = sessionStorage.getItem(`${this.prefix} ${key}`);
    return data ? JSON.parse(data) : void 0;
  }
  removeItem(key) {
    sessionStorage.removeItem(`${this.prefix} ${key}`);
  }
}
class UserService {
  constructor(wsService2, eventEmitter2) {
    __publicField(this, "allUsers", []);
    __publicField(this, "userAuthenticationHandler", (message) => {
      const { user } = message.payload;
      this.eventEmitter.emit(EventType.USER_EXTERNAL_LOGIN, user);
    });
    __publicField(this, "userLogoutHandler", (message) => {
      const { user } = message.payload;
      this.eventEmitter.emit(EventType.USER_EXTERNAL_LOGOUT, user);
    });
    __publicField(this, "getUserHandler", (message) => {
      const { users } = message.payload;
      this.allUsers.push(users);
      if (this.allUsers.length === 2) {
        this.eventEmitter.emit(EventType.USERS_LOADED, this.allUsers.flat(1));
      }
    });
    this.wsService = wsService2;
    this.eventEmitter = eventEmitter2;
    this.wsService.on(MessageType.USER_EXTERNAL_LOGIN, this.userAuthenticationHandler);
    this.wsService.on(MessageType.USER_EXTERNAL_LOGOUT, this.userLogoutHandler);
    this.wsService.on(MessageType.USER_ACTIVE, this.getUserHandler);
    this.wsService.on(MessageType.USER_INACTIVE, this.getUserHandler);
  }
  getAuthenticatedUsers() {
    this.wsService.send(MessageType.USER_ACTIVE, null);
  }
  getUnauthorizedUsers() {
    this.wsService.send(MessageType.USER_INACTIVE, null);
  }
  getUsers() {
    this.getAuthenticatedUsers();
    this.getUnauthorizedUsers();
  }
  clearUsers() {
    this.allUsers.length = 0;
  }
}
class WebSocketService {
  constructor(url) {
    __publicField(this, "socket", null);
    __publicField(this, "listeners", /* @__PURE__ */ new Map());
    this.url = url;
  }
  async connect() {
    console.log("Connecting to WebSocketService");
    this.socket = new WebSocket(this.url);
    this.socket.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        this.emit(message.type, message);
      } catch (e) {
        console.error("[WebSocket] Failed to parse message", e);
      }
    });
    this.socket.addEventListener("close", () => {
      console.log("[WebSocket] Connection closed");
    });
    this.socket.addEventListener("error", (err) => {
      console.error("[WebSocket] Error:", err);
    });
    return new Promise((resolve) => {
      var _a;
      (_a = this.socket) == null ? void 0 : _a.addEventListener("open", () => {
        console.log("[WebSocket] Connected");
        resolve();
      });
    });
  }
  send(type, payload) {
    var _a;
    const id = crypto.randomUUID();
    const message = {
      id,
      type,
      payload
    };
    (_a = this.socket) == null ? void 0 : _a.send(JSON.stringify(message));
    return id;
  }
  on(type, handler) {
    var _a;
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    (_a = this.listeners.get(type)) == null ? void 0 : _a.push(handler);
  }
  emit(type, message) {
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach((handler) => handler(message));
    }
  }
  disconnect() {
    var _a;
    (_a = this.socket) == null ? void 0 : _a.close();
    this.socket = null;
    this.listeners.clear();
  }
}
class EventEmitter {
  constructor() {
    __publicField(this, "events", {});
  }
  subscribe(eventName, callback) {
    !this.events[eventName] && (this.events[eventName] = []);
    this.events[eventName].push(callback);
  }
  unsubscribe(eventName, callback) {
    this.events[eventName] = this.events[eventName].filter((eventCallback) => callback !== eventCallback);
  }
  emit(eventName, args) {
    const event = this.events[eventName];
    event && event.forEach((callback) => callback(args));
  }
}
const wsService = new WebSocketService("http://127.0.0.1:4000");
const eventEmitter = new EventEmitter();
const sessionStorageService = new SessionStorageService();
const authService = new AuthService(wsService, sessionStorageService, eventEmitter);
const userService = new UserService(wsService, eventEmitter);
const messageService = new MessageService(wsService, eventEmitter);
const app = new AppComponent(wsService, authService);
app.init();
window.addEventListener("beforeunload", () => {
  app.remove();
});
