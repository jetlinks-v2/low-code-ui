import { request } from '@LowCode/utils/axios'

/**
 * 条件查询实例
 * @returns 
 */
export const getList_api = (data: any) => request.post(`/process/deployment/detail/_query`,data);

/**
 * 条件查询所有实例
 * @returns 
 */
export const getAllInstance_api = (data: any) => request.post(`/process/deployment/detail/_query/no-paging`, data);

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
export const getMembers_api = (id: string) => request.get(`/process/deployment/${id}/allowed-members`);

/**
 * 全量修改流程实例可发起成员
 * @returns 
 */
export const updateMembers_api = (id:string, data: any) => request.put(`/process/deployment/${id}/allowed-members`, data);
