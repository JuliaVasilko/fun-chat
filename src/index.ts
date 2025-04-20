import "./style.css";

import { AppComponent } from "@/app.component";
import { AuthService } from "@/services/auth.service";
import { MessageService } from "@/services/message.service";
import { SessionStorageService } from "@/services/session-storage.service";
import { UserService } from "@/services/user.service";
import { WebSocketService } from "@/services/web-socket.service";
import { EventEmitter } from "@/utils/event-emmiter";

export const wsService = new WebSocketService("http://127.0.0.1:4000");
export const eventEmitter = new EventEmitter();
export const sessionStorageService = new SessionStorageService();

export const authService = new AuthService(wsService, sessionStorageService, eventEmitter);
export const userService = new UserService(wsService, eventEmitter);
export const messageService = new MessageService(wsService, eventEmitter);

const app = new AppComponent(wsService, authService);

app.init();

window.addEventListener("beforeunload", () => {
  app.remove();
});

