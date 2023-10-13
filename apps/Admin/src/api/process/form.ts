import { request } from '@jetlinks/core'

//工作流表单
// 保存
export const _save = (data: any) => request.patch('/process/form', data);

// 查询
export const _query = (data: any) => request.post('/process/form/_query', data);

// 删除
export const _delete = (id: string) => request.remove(`/process/form/${id}`);

/**
 * 验证设备ID是否重复
 * @param id 设备id
 * @returns 
 */
export const isExists = (id: string) => request.get(`/process/form/${id}/exists`)

export const _detail = (id: string) => request.get(`/process/form/${id}`);

