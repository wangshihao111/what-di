// import { BaseProvider } from "./Container";
// import { inject, createRootContainer, createModuleContainer } from "./helpers";
// // import { forwardRef } from './forwardRef';
// import { Inject } from "./decorators";

// function testFactory() {
//   return Math.random();
// }
// class TestService extends BaseProvider {
//   name = "xxxx";
//   get service() {
//     return inject<Sub>(Sub, "module1");
//   }
//   constructor() {
//     super();
//   }
// }
// class Sub extends BaseProvider {
//   name = "test2";
//   get service2() {
//     return inject(TestService, "module1");
//   }

//   @Inject(TestService)
//   test;

//   constructor() {
//     super();
//   }
// }

// const module1 = createModuleContainer({
//   providers: [TestService, Sub],
//   namespace: "module1",
// });

// createRootContainer({
//   providers: [TestService, { provide: "factory", useFactory: testFactory }],
//   modules: [module1],
// });

// console.log(
//   "class provider",
//   module1.getInstance("TestService"),
//   module1.getInstance("TestService") === module1.getInstance(TestService)
// );
// console.log("factory provider", module1.getInstance("factory"));
// console.log("factory provider 1", inject("factory"));
// console.log("factory provider 1", inject("TestService", "module1"));
// console.log(
//   "factory provider 1",
//   inject<TestService>("TestService", "module1").service
// );
// console.log("factory provider 1", inject<Sub>("Sub", "module1").test);

export * from './constant';
export * from './container';
export * from './decorators';
export * from './helpers'
export * from './base-provider'