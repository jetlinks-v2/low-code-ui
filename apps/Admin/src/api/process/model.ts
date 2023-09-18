import { request } from '@jetlinks/core'

/**
 * 条件查询流程模型
 * @returns 
 */
export const getProcess_api = (data: any) => request.post(`/process/definition/_query`,data);

/**
 * 保存模型
 * @returns 
 */
export const saveProcess_api = (data: any) => request.patch(`/process/definition`,data);
/**
 * 获取模型类型
 * @returns 
 */
export const providerEnum = () => request.get('/dictionary/sys_process_classification/items')

/**
 * 部署模型
 */
export const deploy_api = (id: string) => request.post(`/process/definition/${id}/_deploy`)
/**
 * 删除模型
 */
export const del_api = (id: string) => request.remove(`/process/definition/${id}`)
