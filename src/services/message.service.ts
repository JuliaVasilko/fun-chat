import { EventType } from "@/models/event-types";
import {
  MsgDeleteRequestPayload, MsgDeleteResponsePayload, MsgEditRequestPayload, MsgEditResponsePayload,
  MsgFromUserRequestPayload,
  MsgFromUserResponsePayload, MsgReadRequestPayload, MsgReadResponsePayload,
  MsgSendRequestPayload, MsgSentResponsePayload,
  UserMessage,
} from "@/models/user-message.model";
import { Message, MessageType } from "@/models/web-socket.model";
import { WebSocketService } from "@/services/web-socket.service";
import { EventEmitter } from "@/utils/event-emmiter";

export class MessageService {
  constructor(private wsService: WebSocketService, private eventEmitter: EventEmitter) {
    this.wsService.on<MsgFromUserResponsePayload>(MessageType.MSG_FROM_USER, this.getUserMessageHandler);
    this.wsService.on<MsgDeleteResponsePayload>(MessageType.MSG_DELETE, this.userMessageDeleteHandler);
    this.wsService.on<MsgSentResponsePayload>(MessageType.MSG_SEND, this.userMessageSentHandler);
    this.wsService.on<MsgReadResponsePayload>(MessageType.MSG_READ, this.userMessageReadHandler);
    this.wsService.on<MsgEditResponsePayload>(MessageType.MSG_EDIT, this.userMessageEditHandler);
  }

  private getUserMessageHandler = (message: Message<MsgFromUserResponsePayload>) => {

    this.eventEmitter.emit<{ id: string, messages: UserMessage[] }>(EventType.GET_MSG_FROM_USER, {
      id: message.id!,
      messages: message.payload.messages,
    });
  };

  private userMessageSentHandler = (message: Message<MsgSentResponsePayload>) => {
    this.eventEmitter.emit<UserMessage>(EventType.MSG_SENT, message.payload.message);
  };

  private userMessageDeleteHandler = (message: Message<MsgDeleteResponsePayload>) => {
    if (message.payload.message.status.isDeleted) {
      this.eventEmitter.emit<string>(EventType.MSG_DELETED, message.payload.message.id);
    }
  };

  private userMessageReadHandler = (message: Message<MsgReadResponsePayload>) => {
    if (message.payload.message.status.isReaded) {
      this.eventEmitter.emit<string>(EventType.MSG_READED, message.payload.message.id);
    }
  };

  private userMessageEditHandler = (message: Message<MsgEditResponsePayload>) => {
    console.log()
    if (message.payload.message.status.isEdited) {
      this.eventEmitter.emit<MsgEditResponsePayload>(EventType.MSG_EDIT, message.payload);
    }
  };

  getUserMessage(userLogin: string): string {
    return this.wsService.send<MsgFromUserRequestPayload>(MessageType.MSG_FROM_USER, { user: { login: userLogin } });
  }

  sendUserMessage(to: string, text: string): void {
    this.wsService.send<MsgSendRequestPayload>(MessageType.MSG_SEND, {
      message: {
        text,
        to,
      },
    });
  }

  readUserMessage(messageId: string): void {
    this.wsService.send<MsgReadRequestPayload>(MessageType.MSG_READ, { message: { id: messageId } });
  }

  deleteUserMessage(id: string): void {
    this.wsService.send<MsgDeleteRequestPayload>(MessageType.MSG_DELETE, { message: { id } });
  }

  editUserMessage(id: string, text: string): void {
    this.wsService.send<MsgEditRequestPayload>(MessageType.MSG_EDIT, { message: { id, text } });
  }
}
