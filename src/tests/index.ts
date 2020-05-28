import {createRootContainer, registerRootProviders, inject} from '../index';

// const extraProvider

createRootContainer({
  providers: [],
  modules: []
});

registerRootProviders([
  {
    provide: 'extra',
    useValue: 111
  },
]);
registerRootProviders([
  {
    provide: 'extra',
    useValue: 222
  }
]);

console.log(inject('extra'))