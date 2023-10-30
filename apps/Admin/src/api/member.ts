import { request } from '@jetlinks/core'

/**
 * 查询关系
 * @returns 
 */
// export const getRelation_api = (data: any) => request.post(`/relation/_query/no-paging`, data);
export const getRelation_api = (data: any) => request.get(`/relation/${data.objectType}/${data.targetType}/relations`);

/**
 * 根据定义解析支持的变量
 */
export const getVar_api = (data: any) => request.post(`/process/definition/parse-variables`, data);
