export function log(...args) {
  if (typeof process !== 'undefined' && typeof process.env !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(...args)
  }
}