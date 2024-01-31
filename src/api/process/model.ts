import { request } from '@LowCode/utils/axios'

/**
 * 条件查询流程模型
 * @returns
 */
export const getProcess_api = (data: any) => request.post(`/process/definition/detail/_query`, data);

/**
 * 条件查询所有流程模型
 * @returns
 */
export const getAllProcess_api = (data: any) => request.post(`/process/definition/detail/_query/no-paging`, data);

/**
 * 保存模型
 * @returns
 */
export const saveProcess_api = (data: any) => request.patch(`/process/definition`, data);

export const validateProcess_api = (data: any) => request.get(`/process/definition/_validate`, data);
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
/**
 * 获取模型详情
 */
export const detail_api = (id: string) => request.get(`/process/definition/${id}`)
/**
 * 更新模型
 */
export const update_api = (data: any) => request.put(`/process/definition/${data.id}`, data)
/**
 * 查询表单列表
 */
export const queryForm_api = (data: any) => request.post(`/process/form/_query`, data)
/**
 * 查询表单列表不分页
 */
export const queryFormNoPage_api = (data: any) => request.post(`/process/form/_query/no-paging`, data)
/**
 * 根据定义解析支持的变量
 */
export const queryVariables_api = (data: any) => request.post(`/process/definition/parse-variables`, data)

// 获取角色
export const getRole_api = (data: any) => request.post(`/role/_query/no-paging`, data);
// 获取组织
export const getOrg_api = (data: any) => request.post(`/organization/_all/tree`, data);
// 获取用户
export const getUser_api = (data: any) => request.post(`/user/_query/no-paging`, data);
// 获取产品
export const getProduct_api = (data: any) => request.post(`/device-product/_query/no-paging`, data);
// 获取设备
export const getDevice_api = (data: any) => request.post(`/device-instance/_query/no-paging`, data);
