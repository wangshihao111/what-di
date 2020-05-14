import {createRootContainer, registerRootProviders, inject} from '../index';

// const extraProvider

createRootContainer({
  providers: []
});

registerRootProviders([
  {
    provide: 'extra',
    useValue: 111
  }
]);

console.log(inject('extra'))