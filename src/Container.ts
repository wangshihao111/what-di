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

export type Provider =  ValueProvider | FactoryProvider | ClassProvider | any;

export interface ContainerProps {
  providers: Provider[];
  modules?: Container [];
  namespace: string;
}

export class Container {
  private parent: Container; // 父级模块
  private providers: Provider[];
  private modules: Map<string, Container>;
  private instanceMap: Map<string, any>;
  private _namespace: string;

  constructor({providers=[], modules=null, namespace = 'root'}: ContainerProps) {
    this.instanceMap = new Map();
    this._namespace = namespace;
    this.modules = new Map();
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
      modules.forEach(m =>{
        m.setParent(this)
        this.modules.set(m.namespace, m);
      });
    }
  }

  public getInstance(name: any) {
    const _name = typeof name === "string" ? name : name.name;
    let instance = this.instanceMap.get(_name);
    if (!instance) {
      const def = this.providers.find(p => p.provide === _name);
      if (!def) {
        instance = this.parent?.getInstance(_name);
      } else {
        if ((<ClassProvider>def).useClass) {
          const Construct = (<ClassProvider>def).useClass
          instance = new Construct();
          this.instanceMap.set(_name, instance);
        } else if ((<ValueProvider>def).useValue) {
          instance = (<ValueProvider>def).useValue;
          this.instanceMap.set(_name, instance);
        } else if ((<FactoryProvider>def).useFactory) {
          instance = (<FactoryProvider>def).useFactory();
        } else {
          // TODO: 判断是否是类
          instance = new (<any>def)()
          this.instanceMap.set(_name, instance);
        }
      }
    }
    return instance;
  }

  public getProviders(): Provider[] {
    return this.providers;
  }

  public getInstanceMap(): Map<string, any> {
    return this.instanceMap;
  }

  public setParent(ctx: Container): void {
    if (!(ctx instanceof Container)) {
      throw new Error('模块关联出错，请检查模块的创建方式');
    }
    this.parent = ctx;
  }

  public getParent(): Container {
    return this.parent;
  }
  public get namespace(): string {
    return this._namespace;
  }

  public getModule(namespace: string): Container {
    return this.modules.get(namespace);
  }

  public registerModule(container: Container, namespace: string) {
    this.modules.set(namespace, container);
  }
}