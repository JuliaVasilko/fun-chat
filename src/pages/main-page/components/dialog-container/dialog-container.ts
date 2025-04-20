import "./dialog-container.css";

import { EventType } from "@/models/event-types";
import { UserMessage } from "@/models/user-message.model";
import { User } from "@/models/user.model";
import { MessageComponent } from "@/pages/main-page/components/message/message.component";
import { Button } from "@/ui/button/button";
import { Input } from "@/ui/input/input";
import { Component } from "@/utils/component";
import { messageService } from "@@/src";

export class DialogContainer extends Component {
  private inputHandler = (event: Event): void => {
    if ((event.target as HTMLInputElement).value === "") {
      this.submitButton.setDisabled(true);
    } else {
      this.submitButton.setDisabled(false);
    }
  };

  private cancelEditingHandler = (event?: Event) => {
    if (event) {
      event.preventDefault();
    }
    this.isEditMode = false;
    this.editedMessage = null;
    this.input.getNode().value = "";
    this.submitButton.setDisabled(true);
    this.cancelButton.addClass("hide-button");
  };
  private messageService = messageService;

  private isEditMode = false;
  private editedMessage: UserMessage | null = null;
  private currentUser: string | null = null;

  private userDataComponent = new Component({ className: "user-data" });
  private messageHistoryContainer = new Component({ className: "message-history" },
    [new Component({ text: "chose user to start conversation" })]);
  private messageForm = new Component({ tag: "form", className: "message-form" });
  private input = new Input({
    type: "text",
    placeholder: "your message...",
    name: "message",
    id: "message-input",
    callback: this.inputHandler,
  });
  private submitButton = new Button({ text: "Send Message" });
  private cancelButton = new Button({ text: "Cancel", callback: this.cancelEditingHandler });


  constructor() {
    super({ tag: "article", className: "dialog-container" });

    this.input.setDisabled(true);
    this.submitButton.setDisabled(true);
    this.cancelButton.addClass("hide-button");

    this.messageForm.appendChildren([
      this.input,
      this.submitButton,
    ]);

    this.messageForm.addListener("submit", this.sendMessageHandler);

    this.appendChildren([this.userDataComponent, this.messageHistoryContainer, new Component({ className: "action-container" }, [this.messageForm, this.cancelButton])]);

    this.addEventSubscribe(EventType.GET_MSG_FROM_USER, this.messageHandler);
    this.addEventSubscribe(EventType.CHOOSE_USER, this.changeCurrentUserHandler);
    this.addEventSubscribe(EventType.MSG_SENT, this.messageSentHandler);
    this.addEventSubscribe(EventType.START_MSG_EDIT, this.startMessageEditHandler);
  }

  private changeCurrentUserHandler = ({ login, isLogined }: User): void => {
    this.currentUser = login;

    this.messageHistoryContainer.removeChildren();
    this.input.setDisabled(false);
    this.cancelEditingHandler();
    this.messageService.getUserMessage(login);
    this.userDataComponent.setTextContent(`${login}: ${isLogined ? "online" : "offline"}`);
  };

  private messageHandler = ({ messages }: { id: string, messages: UserMessage[] }) => {
    if (this.currentUser) {
      if (messages.length > 0) {
        const messageComponents = messages.map((message) => {
          return new MessageComponent(message);
        });

        this.messageHistoryContainer.appendChildren(messageComponents);
        this.messageHistoryContainer.getNode().scrollTo({
          top: 10000000,
          behavior: "smooth",
        });
      } else {
        const emptyMessage = new Component({ text: "start conversation here" });
        this.messageHistoryContainer.append(emptyMessage);
      }
    }
  };

  private messageSentHandler = (message: UserMessage): void => {
    if (message.from === this.currentUser || message.to === this.currentUser) {
      const newMessage = new MessageComponent(message);
      if (message.from === this.currentUser) {
        this.messageService.readUserMessage(message.id);
      }
      this.messageHistoryContainer.append(newMessage);

      this.messageHistoryContainer.getNode().scrollTo({
        top: 10000000,
        behavior: "smooth",
      });
    }
  };

  private sendMessageHandler = (event?: Event): void => {
    if (event) {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);

      const formObject: Record<string, FormDataEntryValue> = {};
      formData.forEach((value, key) => {
        formObject[key] = value;
      });

      const message: string = formObject.message as string;

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
  };

  private startMessageEditHandler = (message: UserMessage): void => {
    this.isEditMode = true;
    this.editedMessage = message;
    this.input.getNode().value = this.editedMessage.text;
    this.submitButton.setDisabled(false);
    this.cancelButton.removeClass("hide-button");
  };

  remove(): void {
    this.messageForm.removeListener("submit", this.sendMessageHandler);
    super.remove();
  }
}
