import "./button.css";

import { Component } from "@/utils/component";

interface ButtonProps {
  className?: string;
  text: string;
  callback?: (event?: Event) => void;
}

export class Button extends Component<HTMLInputElement> {
  callback?: (event?: Event) => void;

  constructor(props: ButtonProps) {
    super({ tag: "button", className: props.className, text: props.text });

    if (props.callback) {
      this.callback = props.callback;
      this.addListener("click", event => props.callback!(event));
    }
  }

  public setDisabled(disabled: boolean): void {
    super.setDisabled(disabled);

    this.getNode().disabled = this.getDisabled();
  }

  remove(): void {
    if (this.callback) {
      this.removeListener("click", this.callback);
    }
  }
}
