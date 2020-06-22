import { Container, Provider, ContainerProps } from "./container";
import { key, _global } from "./constant";
import { log } from './logger'

export interface Injector {
  <T>(name: any, scope?: string): T;
}

export interface RootContainer {
  container: Container;
  inject: Injector;
}

export interface RootContainerProps {
  providers: Provider[];
  modules?: Container[];
}

export interface ModuleContainerProps {
  providers: Provider[];
  namespace: string;
}

export function getRoot(): Container {
  return _global[key] as Container;
}
/**
 * Create root IOC container
 * @param {RootContainerProps} props
 */
export function createRootContainer(props: RootContainerProps): void {
  if (getRoot()) {
    log('根容器已存在, 跳过创建，应用providers和modules。');
    registerRootProviders(props.providers);
    registerRootModules(props.modules);
  } else {
    const container = new Container({ ...props, namespace: "root" });
    _global[key] = container;
  }
}

/**
 * 创建一个子模块
 * @param {Container} props
 */
export function createModuleContainer(props: ModuleContainerProps): Container {
  let root = getRoot();
  const container = new Container(props);
  if (!root) {
    console.log('根容器不存在，自动创建根容器。')
    createRootContainer({
      providers: [],
      modules: [container]
    });
    root = getRoot();
  }
  root.registerModule(container, props.namespace)
  return container;
}

/**
 * 全局注入器函数
 * @param name {String}
 * @param scope {String}
 */
export function inject<T>(name: any, scope?: string) {
  const rootContainer = _global[key] as Container;
  if (!rootContainer) {
    throw new Error("root IOC container does not exists. ");
  }
  const targetContainer = scope && scope !== "root" ? rootContainer.getModule(scope) : rootContainer;
  let instance = targetContainer?.getInstance(name);
  if (targetContainer.depsMap.get(name)) {
    targetContainer?.getInstance(targetContainer.depsMap.get(name));
    targetContainer?.getInstanceMap().delete(name)
  }
  instance = targetContainer?.getInstance(name)
  return instance as T;
}

/**
 * 创建于命名空间绑定的工具
 * @param {String} namespace
 */
export function createNamespaceHelpers(namespace: string) {
  return {
    inject: (name: any) => inject(name, namespace),
  };
}

/**
 * 注册根供应商
 * @param providers 
 */
export function registerRootProviders(providers: Provider[]) {
  const root = getRoot();
  if (!root) {
    throw new Error('Root IOC Container does not exist.')
  }
  root.registerProviders(providers);
}

/**
 * 注册根容器的子模块
 * @param modules 
 */
export function registerRootModules(modules: Container[] = []) {
  const root = getRoot();
  if (!root) {
    throw new Error('Root IOC Container does not exist.')
  }
  modules.forEach(m => root.registerModule(m, m.namespace))
}