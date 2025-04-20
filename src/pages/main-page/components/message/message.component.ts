import "./message.css";
import { EventType } from "@/models/event-types";

import { MsgEditResponsePayload, UserMessage } from "@/models/user-message.model";
import { Button } from "@/ui/button/button";
import { Component } from "@/utils/component";
import { authService, messageService, eventEmitter } from "@@/src";

export class MessageComponent extends Component {
  private currentUserLogin: string | undefined;

  private messageAuthor = new Component({ className: "message-author" });
  private messageTime = new Component({ className: "message-time" });
  private messageText = new Component({ className: "message-text" });
  private messageEdited = new Component({ className: "message-edited" });
  private messageStatus?: Component;
  private editBtn?: Button;
  private deleteBtn?: Button;
  isFromMe = false;


  private authService = authService;
  private messageService = messageService;
  private eventEmitter = eventEmitter;

  constructor(public message: UserMessage) {
    super({ className: "message-row" });

    this.addEventSubscribe(EventType.MSG_DELETED, this.messageDeleteHandler);
    this.addEventSubscribe(EventType.MSG_READED, this.messageReadedHandler);
    this.addEventSubscribe(EventType.READ_ALL_MSG, this.allMessageReadedHandler);
    this.addEventSubscribe(EventType.MSG_EDIT, this.editMessageHandler);

    this.currentUserLogin = this.authService.getUser()?.login;
    this.isFromMe = this.currentUserLogin === this.message.from;

    this.addListener("click", this.messageClickHandler);

    this.setMessageAuthor();
    this.setMessageDate();
    this.setMessageText();
    this.setMessageEdited();

    const children = [
      new Component(
        {
          className: "message-data",
        },
        [
          this.messageAuthor,
          this.messageTime,
        ],
      ),
      this.messageText,
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

      messageItem.append(new Component({ className: "button-block" }, [
          this.messageStatus,
          this.deleteBtn,
          this.editBtn,
        ]),
      );

      this.setMessageStatus();
    } else {
      messageItem.append(this.messageEdited);
    }
  }

  private messageReadedHandler = (id: string) => {
    if (this.messageStatus && id === this.message.id) {
      this.messageStatus.setTextContent("Was Read");
    }

    this.removeClass("unread-message-item");
    this.eventEmitter.emit(EventType.ALL_MSG_READED, this.message.from);
  };

  private allMessageReadedHandler = () => {
    if (!this.isFromMe && !this.message.status.isReaded) {
      this.messageService.readUserMessage(this.message.id);
      this.removeClass("unread-message-item");
    }
  };

  private setMessageAuthor(): void {
    if (this.currentUserLogin) {
      this.messageAuthor.setTextContent(this.isFromMe ? "you" : this.message.from);
      this.addClass(this.isFromMe ? "from-me" : "to-me");
    }
  }

  private setMessageDate(): void {
    const date = new Date(this.message.datetime);
    const formatedDate = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
    this.messageTime.setTextContent(formatedDate);
  }

  private setMessageText(): void {
    this.messageText.setTextContent(this.message.text);
  }

  private setMessageEdited(): void {
    if (!this.isFromMe) {
      this.messageEdited.setTextContent(this.message.status.isEdited ? "Edited" : "");
    }
  }

  private setMessageStatus(): void {
    const { isDelivered, isReaded } = this.message.status;
    const status = isReaded ? "Was Read" : isDelivered ? "Delivered" : "Sent";
    this.messageStatus!.setTextContent(status);
  }

  private messageDeleteHandler = (id: string): void => {
    if (this.message.id === id) {
      this.remove();
    }
  };

  private messageClickHandler = () => {
    if (!this.isFromMe) {
      this.eventEmitter.emit(EventType.READ_ALL_MSG, this.message.from);
    }
  };

  private editMessageHandler = ({ message }: MsgEditResponsePayload) => {
    if (message.id === this.message.id) {
      this.message.text = message.text;
      this.message.status.isEdited = message.status.isEdited;

      this.setMessageText();
      this.setMessageEdited();
    }
  };

  editBtnClickHandler = (): void => {
    this.eventEmitter.emit(EventType.START_MSG_EDIT, this.message);
  };

  deleteBtnClickHandler = (): void => {
    this.messageService.deleteUserMessage(this.message.id);
  };

  remove(): void {
    this.removeListener("click", this.messageClickHandler);
    super.remove();
  }
}
