function getKey(): any {
  if (process.env.NODE_ENV === 'production') {
    return Symbol.for('__@@WHAT_DI_CONTAINER@@__');
  } else {
    return '__what-di__';
  }
}

export const key = getKey();

export const diStoreKey = Symbol.for('__@@EASY_DEPENDENCE_INJECTION_STORE@@__');

export const _global = typeof window !== "undefined" ? window : global;