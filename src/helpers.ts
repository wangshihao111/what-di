import { Container, Provider, ContainerProps } from "./Container";
import { key } from "./constant";

const _global = typeof window !== "undefined" ? window : global;

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

function getRoot(): Container {
  return _global[key] as Container;
}

export function createRootContainer(props: RootContainerProps): void {
  const container = new Container({ ...props, namespace: "root" });
  _global[key] = container;
}

export function createModuleContainer(props: ModuleContainerProps): Container {
  const root = getRoot();
  const container = new Container(props);
  if (!root) {
    createRootContainer({
      providers: [],
      modules: [container]
    })
  }
  return container;
}

export function inject<T>(name: any, scope?: string) {
  const rootContainer = _global[key] as Container;
  if (!rootContainer) {
    throw new Error("root IOC container not exists. ");
  }
  if (scope && scope !== "root") {
    return rootContainer.getModule(scope)?.getInstance(name) as T;
  }
  return rootContainer.getInstance(name) as T;
}

export function createNamespaceHelpers(namespace: string) {
  return {
    inject: (name: any) => inject(name, namespace),
  };
}
