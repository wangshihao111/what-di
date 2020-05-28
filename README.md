依赖注入工具
---

## what-di

安装方法:
```bash
npm i what-di
# 或
yarn add what-di
```

## 使用方法

创建根容器：

```js
import { createRootContainer } from 'what-id';

createRootContainer({
  providers: [
    {provide: 'config', useValue: {host: '0.0.0.0'}},
  ],
  modules: []
});

```

运行时注册供应者：

```js
import { registerRootProviders } from 'what-id';

registerRootProviders([
  { provide: 'extra', useValue: { publicUrl: '/' },
]);

```

注入依赖：

```js
import { inject } from 'what-id';

const config = inject('config');

```

注入模块依赖：

```js
import { inject, createNamespaceHelpers } from 'what-id';

const config = inject('config', 'module-name');

// 也可以创建版绑定模块名的辅助函数

const { inject } = createNamespaceHelpers('module-name');
const config = inject('config'); // 即可略去模块名

```

在类中注入依赖：

```js
import { inject, Inject } from 'what-id';

class Example {
  constructor() {
    this.config = inject('config');
  }
}

// 或装饰器模式

class Example {
  @Inject('config')
  config;
}

```

创建子容器：

```js
import { createModuleContainer } from 'what-id';

const module = createModuleContainer({
  providers: [
    {provide: 'module', useValue: {host: '0.0.0.0'}},
  ]
});

```

创建的子模块可以在创建根容器的时候作为参数传递到modules数组中。


## 供应者类型


```ts
import { BaseProvider } from 'what-di';

export type ValueProvider = {
  provide: string;
  useValue: any;
}

export type FactoryProvider = {
  provide: string;
  useFactory: any;
}

export interface ClassProvider {
  provide: string;
  useClass: any;
}

// 也可以直接传递一个类到provider数组，但该类需要继承BaseProvider，例如

// import { BaseProvider, createRootContainer } from 'what-di';
class UserService extends BaseProvider {
  // ...
}

createRootContainer({
  providers: [
    UserService, // 直接使用类，注入时可以 inject('UserService') 或 inject(UserService)
  ],
  modules: []
});


```


## 附加API(不建议使用)

getRoot(): Container; 获取根容器实例

what-di工具参考文档：
[https://www.npmjs.com/package/what-di](https://www.npmjs.com/package/what-di)
