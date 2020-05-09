import { inject } from './helpers'

export function Inject(name, scope?: string) {
  return function(target, propName) {
    Reflect.defineProperty(target, propName, {
      get() {
        return inject(name, scope)
      },
    })
  }
}