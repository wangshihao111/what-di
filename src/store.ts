import { EventManager } from './EventManager';
import { diStoreKey, _global } from './constant';
import { inject } from './helpers';


export function getStore(): Map<string, any> {
  let store = _global[diStoreKey];
  if (!_global[diStoreKey]) {
    store = new Map();
    const eventManager = new EventManager();
    eventManager.on('done', () => {
      store.forEach((temp, key) => {
        console.log(key)
        if (key !== 'events') {
          temp.ref = inject(key, temp.namespace);
          console.log('tttt', temp.ref)
          store.remove(key);
        }
      })
    })
    store.set('events', eventManager);
  }
  return store;
}