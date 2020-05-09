/**
 * 大致思路：
 * 每个变量创建完毕都会触发一个事件（onDone）；
 * 检测到时forwardRef的时候，先创建一个临时变量，存入到Map中，并且利用引用类型的特点将其传给要注入属性；
 * 在onDone事件处理函数中，检测Map，如果存在，就把引用地址换成实例的地址
 */

export interface ForwardRefFn {
  (): any
}

export const forwardRef = (forwardRefFn: ForwardRefFn) => {
  (<any>forwardRefFn).__forwardRef__ = forwardRef;
  return forwardRefFn;
}

export function isForwardRef(fn: any) {
  return !!fn.__forwardRef__;
}