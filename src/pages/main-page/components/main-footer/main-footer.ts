import './main-footer.css'

import { Component } from "@/utils/component";

export class MainFooter extends Component {
  constructor() {
    super({ tag: "footer", className: "main-footer" });

    const logo = new Component({ className: "logo" });

    const logoImg = new Component({ tag: "img" });
    logoImg.setAttribute("src", "public/rss-logo.svg");

    logo.appendChildren([
      logoImg,
      new Component({ tag: "span", text: "RS School" }),
    ]);

    const linkToGithub = new Component({ tag: "a", className: "github-link" , text: "GitHub" });
    linkToGithub.setAttribute("href", "https://github.com/JuliaVasilko");
    linkToGithub.setAttribute("target", "_blanc");

    const children = [
      logo,
      linkToGithub,
      new Component({ tag: "span", text: "2025" }),
    ];

    this.appendChildren(children);
  }
}
