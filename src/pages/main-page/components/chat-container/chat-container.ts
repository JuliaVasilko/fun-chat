import './chat-container.css'

import { DialogContainer } from "@/pages/main-page/components/dialog-container/dialog-container";
import { UserList } from "@/pages/main-page/components/user-list/user-list";
import { Component } from "@/utils/component";

export class ChatContainer extends Component {
  constructor() {
    super({ tag: "section", className: "chat-container" }, [
      new UserList(),
      new DialogContainer(),
    ]);
  }
}
