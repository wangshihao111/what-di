export interface DIObserver<S> {
  (state: S):void;
}

export class BaseProvider<T> {
  public static readonly __is_base_provider__ = true;

  constructor() {
    this.observers = [];
  }

  private _state: T

  private observers: DIObserver<T>[];

  public get state(): T {
    return this._state;
  }

  public setState(state: T) {
    this._state = state;
    this.emitState();
  }

  private emitState() {
    this.observers.forEach((ob: DIObserver<T>) => {
      ob(this.state);
    })
  }

  public subscribe(func: DIObserver<T>) {
    if (this.observers.indexOf(func) < 0) {
      this.observers.push(func)
      this.emitState();
    }
    return () => {
      const index = this.observers.indexOf(func);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    }
  }
}
