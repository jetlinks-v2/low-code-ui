import { request } from '@jetlinks/core'

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
