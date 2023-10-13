import { request } from '@jetlinks/core'

export const _export = (projectId: string, functionId: string, commandId: string, data?: any, ) => request.postStream(`/low-code/runtime/${projectId}/${functionId}/${commandId}/_file`, data, {})

export const _import = (projectId: string, functionId: string, commandId: string, data?: any, ) => request.post(`/low-code/runtime/${projectId}/${functionId}/${commandId}`, data)

export const dictionaryItemList = (id: string) => request.get(`/dictionary/${id}/items`)
