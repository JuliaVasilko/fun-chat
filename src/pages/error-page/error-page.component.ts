import { Component } from "@/utils/component";

export class ErrorPage extends Component {
  constructor() {
    super({ className: "error-page" }, [
      new Component({ tag: "h1", text: "Page not found" }),
    ]);
  }
}
