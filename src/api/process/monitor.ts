import { request } from '@LowCode/utils/axios'

/**
 * 查询流程监控
 * @returns
 */
export const getList_api = (data: any) => {
  const { history, params, ...rest } = data
  return request.postParams(
    `/process/runtime/processes/_query`,
    {
      ...rest,
      ...params,
    },
    {
      history,
    },
  )
}

/**
 * 查询流程监控
 * @returns
 */
export const getAllList_api = (data: any) => {
  const { history, params, ...rest } = data
  return request.postParams(
    `/process/runtime/processes/_query/no-paging`,
    {
      ...rest,
      ...params,
    },
    {
      history,
      distinctBy: 'creatorId'
    },
  )
}

/**
 * 获取流程详情
 * @returns
 */
export const getDetail_api = (id: string) =>
  request.get(`/process/runtime/process/detail/${id}`)

/**
 * 关闭流程监控
 * @returns
 */
export const close_api = (processId: string) =>
  request.put(`/process/runtime/${processId}/_repeal`)

/**
 * 根据关联信息查询流程
 * @param data 
 * @returns 
 */
export const process_list = (data: any) => request.post(`/process/runtime/processes/withLink/_query`, data)

/**
 * 转交流程
 * @param data 
 * @returns 
 */
export const process_tran = (data: any) => request.post(`/process/runtime/_transfer`, data)

/**
 * 原办理人
 * @param data 
 * @returns 
 */
export const original_list = (data: any) => request.post(`/process/runtime/identity/_query/no-paging?distinctBy=dimensionKey`, data)
