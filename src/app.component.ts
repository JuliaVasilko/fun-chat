import "./app.css";

import { AuthService } from "@/services/auth.service";
import { routerService } from "@/services/router.service";
import { WebSocketService } from "@/services/web-socket.service";
import { Component } from "@/utils/component";

export class AppComponent extends Component {

  constructor(private wsService: WebSocketService, private authService: AuthService) {
    super({ tag: "main" });
    console.log("created AppComponent");
  }

  async init(): Promise<void> {
    document.body.append(this.getNode());
    await this.wsService.connect();
    this.authService.restoreUser();

    routerService.init(this.getNode());
  }

  remove(): void {
    this.wsService.disconnect();
    super.remove();
  }
}
