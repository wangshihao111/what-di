import {Container} from './Container';

class TestService {
  name = 'xxxx'
}

const container = new Container({
  providers: [{
    provide: 'Test',
    useValue: TestService
  }],
  modules: []
});

console.log(container.getInstance('Test'));