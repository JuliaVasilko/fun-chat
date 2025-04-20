export class SessionStorageService {
  private prefix = "[fun-chat]";

  public setItem<T>(key: string, data: T): void {
    const stringifyData = JSON.stringify(data);
    sessionStorage.setItem(`${this.prefix} ${key}`, stringifyData);
  }

  public getItem<T>(key: string): T | undefined {
    const data = sessionStorage.getItem(`${this.prefix} ${key}`);
    return data ? (JSON.parse(data) as T) : undefined;
  }

  public removeItem(key: string): void {
    sessionStorage.removeItem(`${this.prefix} ${key}`);
  }
}

