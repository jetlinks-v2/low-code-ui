import { request } from '@jetlinks-web/core'

// 保存
export const save_api = (data: any) => request.post(`/system/config/scope/_save`, data)
// 获取详情
export const getDetails_api = (data: any) => request.post<any>(`/system/config/scopes`, data)

/**
 * 执行功能供应商命令
 * @param provider {Draft.Provider}
 * @param command
 * @param data
 */
export const executeReq = (provider: Draft.Provider, command: Draft.Command, data: any = {}) => request.post(`/low-code/editor/function-provider/${provider}/${command}/execute`, data)

export const getAssetType = () => request.get('/asset/types')

export const getResource = (projectId: string, moduleId: string, resourceId: string) => request.get(`/low-code/runtime/${projectId}/${moduleId}/resources/${resourceId}`, {}, { headers: { 'Content-Type': 'text/plain;application/x-www-form-urlencoded;charset=utf-8;'}})
