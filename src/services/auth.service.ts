import { EventType } from "@/models/event-types";
import { UserPayload } from "@/models/user.model";
import { ErrorPayload, ErrorType, MessageType, Message } from "@/models/web-socket.model";
import { SessionStorageService } from "@/services/session-storage.service";
import { WebSocketService } from "@/services/web-socket.service";
import { Dialog } from "@/ui/dialog/dialog";
import { Component } from "@/utils/component";
import { EventEmitter } from "@/utils/event-emmiter";

export type AuthPayload = {
  login: string;
  password: string;
};

export class AuthService {
  private readonly storageKey = "auth";
  private currentUser: AuthPayload | null = null;

  private errorHandler = (message: Message<ErrorPayload>) => {
    const error = message.payload.error;
    switch (error) {
      case ErrorType.ALREADY_AUTHORIZED: {
        this.alreadyAuthorizedHandler();
      }
        break;
      case ErrorType.INCORRECT_PASSWORD: {
        this.incorrectPasswordHandler();
      }
        break;
    }
  };

  constructor(private wsService: WebSocketService, private sessionStorageService: SessionStorageService, private eventEmmiter: EventEmitter) {
    this.wsService.on<ErrorPayload>(MessageType.ERROR, this.errorHandler);
    this.wsService.on<UserPayload>(MessageType.USER_LOGIN, this.userLoginHandler);
  }

  public restoreUser(): void {
    const stored = this.sessionStorageService.getItem<AuthPayload>(this.storageKey);
    if (stored) {
      this.currentUser = stored;
      this.authenticate();
    }
  }

  public login(payload: AuthPayload): void {
    this.currentUser = payload;
    this.sessionStorageService.setItem(this.storageKey, payload);
    this.authenticate();
  }

  public logout(): void {
    if (!this.currentUser) return;

    this.wsService.send(MessageType.USER_LOGOUT, { user: this.currentUser });

    this.currentUser = null;
    this.sessionStorageService.removeItem(this.storageKey);
    this.eventEmmiter.emit(MessageType.USER_LOGOUT);
  }

  private authenticate(): void {
    if (!this.currentUser) return;

    this.wsService.send(MessageType.USER_LOGIN, { user: this.currentUser });
  }

  public getUser(): AuthPayload | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  private alreadyAuthorizedHandler(): void {
    const dialog = new Dialog({
      showOkBtn: true, content: [
        new Component({ tag: "h2", text: "A user with this login is already authorized" }),
      ],
    });
    document.body.append(dialog.getNode());

    dialog.showModal();
  }

  private incorrectPasswordHandler(): void {
    const dialog = new Dialog({
      showOkBtn: true, content: [
        new Component({ tag: "h2", text: "Login and password don't match" }),
      ],
    });
    document.body.append(dialog.getNode());

    dialog.showModal();
  }

  private userLoginHandler = (message: Message<UserPayload>): void => {
    const { user } = message.payload;
    if (user.isLogined) {
      this.eventEmmiter.emit(EventType.USER_LOGIN);
    }
  };
}

