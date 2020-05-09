export class EventManager {
  private handlerMap: Map<string, any>;

  constructor() {
    this.handlerMap = new Map();
  }

  public on(evt: string, handler: Function) {
    const old = this.handlerMap.get(evt) || [];
    this.handlerMap.set(evt, [...old, handler]);
  }

  public emit(evt: string, ...args: any[]) {
    (this.handlerMap.get(evt) || []).forEach((handler: Function) => {
      handler(...args);
    });
  }
}