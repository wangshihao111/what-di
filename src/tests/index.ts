import {createRootContainer, registerRootProviders, inject} from '../index';
import { BaseProvider } from '../base-provider';

// const extraProvider

class EnhancerProvider extends BaseProvider<any> {
  
}

createRootContainer({
  providers: [EnhancerProvider],
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

const enhance = inject<EnhancerProvider>(EnhancerProvider)

enhance.subscribe(v => console.warn(v));

enhance.setState(666666)
