import './main-page.css'

import { ChatContainer } from "@/pages/main-page/components/chat-container/chat-container";
import { MainFooter } from "@/pages/main-page/components/main-footer/main-footer";
import { MainHeader } from "@/pages/main-page/components/main-header/main-header";
import { Component } from "@/utils/component";

export class MainComponent extends Component {
  constructor() {
    super({className: 'main-page'});
    this.appendChildren(
      [new MainHeader(), new ChatContainer(), new MainFooter()],
    );
  }
}
