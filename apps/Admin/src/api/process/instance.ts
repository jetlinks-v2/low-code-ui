import { request } from '@jetlinks/core'

/**
 * 条件查询实例
 * @returns 
 */
export const getList_api = (data: any) => request.post(`/process/deployment/_query`,data);

/**
 * 复制为模型
 */
export const copy_api = (data: any) => request.post(`/process/deployment/${data.id}/_convert_to_definition`, data);

/**
 * 删除实例
 */
export const del_api = (id: string) => request.remove(`/process/deployment/${id}`)
