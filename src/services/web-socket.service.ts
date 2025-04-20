import { Message, MessageType } from "@/models/web-socket.model";

export class WebSocketService {
  private socket: WebSocket | null = null;
  private listeners = new Map<string, ((payload: any) => void)[]>();

  constructor(private readonly url: string) {
  }

  async connect(): Promise<void> {
    console.log("Connecting to WebSocketService");
    this.socket = new WebSocket(this.url);

    this.socket.addEventListener("message", (event) => {
      try {
        const message: Message = JSON.parse(event.data);
        this.emit(message.type, message);
      } catch (e) {
        console.error("[WebSocket] Failed to parse message", e);
      }
    });

    this.socket.addEventListener("close", () => {
      console.log("[WebSocket] Connection closed");
    });

    this.socket.addEventListener("error", (err) => {
      console.error("[WebSocket] Error:", err);
    });

    return new Promise(resolve => {
      this.socket?.addEventListener("open", () => {
        console.log("[WebSocket] Connected");
        resolve();
      });
    });
  }

  send<T>(type: MessageType, payload: T): string {
    const id = crypto.randomUUID();
    const message: Message<T> = {
      id,
      type,
      payload,
    };

    this.socket?.send(JSON.stringify(message));

    return id;
  }

  on<T>(type: string, handler: (payload: Message<T>) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }

    this.listeners.get(type)?.push(handler);
  }

  private emit<T>(type: string, message: Message<T>): void {
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach((handler) => handler(message));
    }
  }

  disconnect(): void {
    this.socket?.close();
    this.socket = null;
    this.listeners.clear();
  }
}

