import { inject } from './helpers'

export function Inject(name, scope?: string) {
  let value;
  return function(target, propName) {
    Reflect.defineProperty(target, propName, {
      get() {
        if (!value) {
          value = inject(name, scope);
        }
        return value;
      },
    })
  }
}