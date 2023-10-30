import { ContextOptions } from './axios'
// 公用上下文
export let context: ContextOptions = {
    filterUrl: [],
    handleRequest: undefined,
    handleResponse: undefined,
    errorHandler: undefined,
    exit: undefined
}

export const initRequest = (func: () => ContextOptions) => {
    context = func()
}
