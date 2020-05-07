export interface ClassProvider {
  provide: string;
  useClass: any;
}

export type ValueProvider = {
  provide: string;
  useValue: any;
}

export type FactoryProvider = {
  provide: string;
  useFactory: any;
}

export type Provider =  ValueProvider | FactoryProvider | ClassProvider;

export interface ContainerProps {
  providers: Provider[],
  modules?: Container []
}

export class Container {
  private parent: any; // 父级模块
  private providers: Provider[];
  private modules: Container[] | null;
  private instanceMap: Map<string, any>;

  constructor({providers=[], modules=null}: ContainerProps) {
    this.instanceMap = new Map();
    this.providers = providers.map((provider: Provider) => {
      if ((<ValueProvider>provider).useValue || (<FactoryProvider>provider).useFactory || (<ClassProvider>provider).useClass) {
        return provider;
      } else {
        return {
          provide: (provider as any).name,
          useClass: provider
        }
      }
    });
    if (modules) {
      modules.forEach(m => m.setParent(this));
      this.modules = modules;
    }
  }

  public getInstance(name: string) {
    let instance = this.instanceMap.get(name);
    if (!instance) {
      const def = this.providers.find(p => p.provide === name);
      if (!def) {
        throw new Error(`找不到 provide: ${name}`)
      }
      if ((<ClassProvider>def).useClass) {
        const Construct = (<ClassProvider>def).useClass
        instance = new Construct();
      } else if ((<ValueProvider>def).useValue) {
        instance = (<ValueProvider>def).useValue;
      } else if ((<FactoryProvider>def).useFactory) {
        instance = (<FactoryProvider>def).useFactory();
      } else {
        // TODO: 判断是否是类
        instance = new (<any>def)()
      }
      this.instanceMap.set(name, instance);
    }
    return instance;
  }

  public getProviders(): Provider[] {
    return this.providers;
  }

  public getInstanceMap(): Map<string, any> {
    return this.instanceMap;
  }

  public setParent(ctx): void {
    if (!(ctx instanceof Container)) {
      throw new Error('模块关联出错，请检查模块的创建方式');
    }
    this.parent = ctx;
  }

  public getParent(): Container {
    return this.parent;
  }

}