export const key = Symbol.for('__@@EASY_DEPENDENCE_INJECTION@@__');

export const diStoreKey = Symbol.for('__@@EASY_DEPENDENCE_INJECTION_STORE@@__');

export const _global = typeof window !== "undefined" ? window : global;