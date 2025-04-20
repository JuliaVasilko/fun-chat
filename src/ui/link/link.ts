import "./link.css";

import { routerService } from "@/services/router.service";
import { Component } from "@/utils/component";

interface LinkProps {
  url: string;
  className?: string;
  text: string;
  preventedCallback?: (event?: Event) => void | boolean;
}

export class Link extends Component<HTMLAnchorElement> {
  constructor({ url, className, text, preventedCallback }: LinkProps) {
    super({ tag: "a", className, text });

    this.setAttribute("href", url);

    this.addListener("click", (event?: Event): void => {
      event?.preventDefault();

      if (preventedCallback) {
        if (preventedCallback(event)) {
          return;
        }
      }

      if (this.getDisabled()) {
        return;
      }

      routerService.navigate(`/${url}`);
    });
  }
}
