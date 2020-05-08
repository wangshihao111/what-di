import {Container} from './Container';
import { inject, createRootContainer, createModuleContainer } from './helpers';

class TestService {
  name = 'xxxx'
}

function testFactory() {
  return Math.random();
}

const module1 = createModuleContainer({
  providers: [TestService],
  namespace: 'module1'
})

createRootContainer({
    providers: [
    TestService,
    { provide: 'factory', useFactory: testFactory },
  ],
  modules: [
    module1
  ]
})

console.log('class provider', module1.getInstance('TestService'),module1.getInstance('TestService') === module1.getInstance(TestService) );
console.log('factory provider', module1.getInstance('factory'));
console.log('factory provider 1', inject('factory'));
console.log('factory provider 1', inject('TestService', 'module1'));
console.log('factory provider 1', inject('TestService', 'module1') == inject(TestService));