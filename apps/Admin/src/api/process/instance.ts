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

/**
 * 修改实例状态
 * @returns 
 */
export const updateState_api = (data: any) => request.put(`/process/deployment/${data.id}`, data);

/**
 * 查询对应流程实例可发起成员
 * @returns 
 */
export const getMembers_api = (id: string) => request.get(`/process/deployment/${id}/allowedMembers/_query`);

/**
 * 查询对应流程实例可发起成员
 * @returns 
 */
export const updateMembers_api = (id:string, data: any) => request.post(`/process/deployment/${id}/allowedMembers/_updata`, data);
