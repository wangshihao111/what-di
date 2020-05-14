import { EventManager } from './EventManager';
import { isForwardRef } from './forwardRef';
import { getStore } from './store';

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

export class BaseProvider {
  static __is_base_provider__ = true;
  constructor() {}
}

export type NormalProvider = ValueProvider | FactoryProvider | ClassProvider;

export type Provider =  ValueProvider | FactoryProvider | ClassProvider | BaseProvider;

export interface ContainerProps {
  providers: Provider[];
  modules?: Container[];
  namespace: string;
}

export class Container {
  private parent: Container; // 父级模块
  private providers: Map<string, NormalProvider>;
  private modules: Map<string, Container>;
  private instanceMap: Map<string, any>;
  private _namespace: string;
  public depsMap: Map<string, any>;

  constructor({providers=[], modules=null, namespace = 'root'}: ContainerProps) {
    this.instanceMap = new Map();
    this._namespace = namespace;
    this.modules = new Map();
    this.depsMap = new Map();
    this.providers = new Map();
    this.registerProviders(providers);
    if (modules) {
      modules.forEach(m =>{
        m.setParent(this)
        this.modules.set(m.namespace, m);
      });
    }
  }

  private handleForwardRef(forwardRefFn: any) {
    const ClassType = forwardRefFn();
    let instance = this.instanceMap.get(ClassType.name);
    if (!instance) {
      const store = getStore();
      const haveInstance = store.get(ClassType.name);
      if (!haveInstance) {
        const temp = ({
          ref: {},
          namespace: this.namespace,
        } as any);
        store.set(ClassType.name, temp);
        console.log('set store', ClassType.name)
        instance = temp.ref;
        this.instanceMap.set(ClassType.name, instance)
      }
    }
    // (getStore().get('events') as EventManager).emit('done');
    return instance;
  }

  public getInstance(name: any) {
    let _name = typeof name === "string" ? name : name.name;
    let instance = this.instanceMap.get(_name);
    // if (isForwardRef(name)) {
    //   console.log('is Forward')
    //   return this.handleForwardRef(name)
    // }
    if (!instance) {
      const def = this.providers.get(_name);
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
          return;
        }
      }
    }
    // (getStore().get('events') as EventManager).emit('done');
    return instance;
  }

  public registerProviders(providers: Provider[]) {
    providers.forEach((provider: Provider) => {
      let _provider: NormalProvider = provider as NormalProvider;
      if (!((<ValueProvider>provider).useValue || (<FactoryProvider>provider).useFactory || (<ClassProvider>provider).useClass)) {
        if (!(<typeof BaseProvider>provider).__is_base_provider__) {
          throw new Error('提供的provider不是一个合法的Provider。')
        }
        _provider = {
          provide: (provider as any).name,
          useClass: provider
        }
      }
      this.providers.set(_provider.provide, _provider);
    });
  }

  public getProviders(): Map<string, NormalProvider> {
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