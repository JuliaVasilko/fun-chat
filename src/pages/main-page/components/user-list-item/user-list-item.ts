import "./user-list-item.css";

import { EventType } from "@/models/event-types";
import { UserMessage } from "@/models/user-message.model";
import { User } from "@/models/user.model";
import { Component } from "@/utils/component";
import { eventEmitter, messageService } from "@@/src";

export class UserListItem extends Component {
  userNameComponent: Component;
  unreadMessage: Component;
  messageRequestId: string;

  messageService = messageService;
  eventEmitter = eventEmitter;

  unreadMessages: number = 0;

  constructor(private user: User) {
    super({ tag: "li" });

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
      this.unreadMessage,
    ]);


    this.append(content);

    this.addListener("click", this.clickHandler);
  }

  private messageReadedHandler = (login: string) => {
    if (login === this.user.login) {
      this.unreadMessages = 0;
      this.unreadMessage.setTextContent("");
    }
  };

  userStatusHandler = (user: User) => {
    if (this.user.login !== user.login) {
      return;
    }

    if (user.isLogined) {
      this.addClass("green");
    } else {
      this.removeClass("green");
    }
  };

  messageStatusHandler = ({ id, messages }: { id: string, messages: UserMessage[] }) => {
    if (this.messageRequestId === id) {
      this.unreadMessages = messages.filter(message => !message.status.isReaded && message.from === this.user.login).length;
      this.unreadMessage.setTextContent(this.unreadMessages ? String(this.unreadMessages) : "");
    }
  };

  receiveMessageHandler = (message: UserMessage) => {
    if (message.from === this.user.login && !message.status.isReaded) {
      this.unreadMessages++;
      this.unreadMessage.setTextContent(this.unreadMessages ? String(this.unreadMessages) : "");
    }
  };

  private clickHandler = (): void => {
    this.eventEmitter.emit(EventType.CHOOSE_USER, this.user);
  };

  remove(): void {
    this.removeListener("click", this.clickHandler);
    super.remove();
  }
}
