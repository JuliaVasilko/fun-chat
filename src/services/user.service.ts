import { EventType } from "@/models/event-types";
import { User, UserPayload, UsersPayload } from "@/models/user.model";
import { Message, MessageType } from "@/models/web-socket.model";
import { WebSocketService } from "@/services/web-socket.service";
import { EventEmitter } from "@/utils/event-emmiter";

export class UserService {
  private allUsers: User[][] = [];

  constructor(private wsService: WebSocketService, private eventEmitter: EventEmitter) {
    this.wsService.on<UserPayload>(MessageType.USER_EXTERNAL_LOGIN, this.userAuthenticationHandler);
    this.wsService.on<UserPayload>(MessageType.USER_EXTERNAL_LOGOUT, this.userLogoutHandler);
    this.wsService.on<UsersPayload>(MessageType.USER_ACTIVE, this.getUserHandler);
    this.wsService.on<UsersPayload>(MessageType.USER_INACTIVE, this.getUserHandler);
  }

  private userAuthenticationHandler = (message: Message<UserPayload>): void => {
    const { user } = message.payload;
    this.eventEmitter.emit(EventType.USER_EXTERNAL_LOGIN, user);
  };

  private userLogoutHandler = (message: Message<UserPayload>): void => {
    const { user } = message.payload;
    this.eventEmitter.emit(EventType.USER_EXTERNAL_LOGOUT, user);
  };

  private getAuthenticatedUsers(): void {
    this.wsService.send(MessageType.USER_ACTIVE, null);
  }

  private getUnauthorizedUsers(): void {
    this.wsService.send(MessageType.USER_INACTIVE, null);
  }

  private getUserHandler = (message: Message<UsersPayload>): void => {
    const { users } = message.payload;
    this.allUsers.push(users);

    if (this.allUsers.length === 2) {
      this.eventEmitter.emit<User[]>(EventType.USERS_LOADED, this.allUsers.flat(1));
    }
  };

  getUsers(): void {
    this.getAuthenticatedUsers();
    this.getUnauthorizedUsers();
  }

  clearUsers(): void {
    this.allUsers.length = 0;
  }
}
