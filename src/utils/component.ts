import { EventType } from "@/models/event-types";
import { eventEmitter } from "@@/src";

export interface ComponentProps {
  tag?: string;
  className?: string;
  text?: string;
}

export class Component<T extends HTMLElement = HTMLElement> {
  private node: T;
  private children: Component[] = [];
  private disabled = false;
  private events: [string, Function][] = [];

  constructor(
    { tag = "div", className = "", text = "" }: ComponentProps,
    children?: Component[],
  ) {
    const node = document.createElement(tag) as T;
    node.className = className;
    node.textContent = text;
    this.node = node;

    if (children) {
      this.appendChildren(children);
    }
  }

  public createElement(tag: string): void {
    const node = document.createElement(tag);
    this.node = node as T;
  }

  addEventSubscribe(eventName: EventType, callback: Function): void {
    this.events.push([eventName, callback]);

    eventEmitter.subscribe(eventName, callback);
  }

  public appendChildren(children: Component[]): void {
    children.forEach((element: Component) => {
      this.append(element);
    });
  }

  public append(child: Component): void {
    this.children.push(child);
    this.node.append(child.getNode());
  }

  public getNode(): T {
    return this.node;
  }

  public getChildren(): Component[] {
    return this.children;
  }

  public setTextContent(text: string): void {
    this.node.textContent = text;
  }

  public setAttribute(attribute: string, value: string): void {
    this.node.setAttribute(attribute, value);
  }

  public removeAttribute(attribute: string): void {
    this.node.removeAttribute(attribute);
  }

  public toggleClass(className: string): void {
    this.node.classList.toggle(className);
  }

  public addClass(className: string): void {
    this.node.classList.add(className);
  }

  public removeClass(className: string): void {
    if (this.node.classList.contains(className)) {
      this.node.classList.remove(className);
    }
  }

  public setDisabled(disabled: boolean): void {
    this.disabled = disabled;
  }

  public getDisabled(): boolean {
    return this.disabled;
  }

  public addListener(
    event: keyof HTMLElementEventMap,
    callback: (event?: Event) => void,
    options?: boolean | AddEventListenerOptions,
  ): void {
    this.node.addEventListener(event, callback, options);
  }

  public removeListener(
    event: keyof HTMLElementEventMap,
    callback: (event?: Event) => void,
    options?: boolean | AddEventListenerOptions,
  ): void {
    this.node.removeEventListener(event, callback, options);
  }

  public removeChildren(): void {
    this.children.forEach(child => {
      child.remove();
    });
    this.children.length = 0;
  }

  public remove(): void {
    this.events.forEach(([eventName, callback]) => {
      eventEmitter.unsubscribe(eventName, callback);
    });

    this.removeChildren();
    this.node.remove();
  }
}
