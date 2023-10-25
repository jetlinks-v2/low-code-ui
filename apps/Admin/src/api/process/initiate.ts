import { request } from '@jetlinks/core'

/**
 * 查询可发起流程
 * @returns
 */
export const getList_api = (data: any) =>
  request.post(`/process/runtime/startable/_query`, data)

/**
 * 发起流程
 * @returns
 */
export const start_api = ({ data, start }: any) =>
  request.postParams(`/process/runtime/${data.id}/_create`, data, { start })

/**
 * 获取流程详情
 * @returns
 */
export const processDetail_api = (id: string) =>
  request.get(`/process/runtime/process/detail/${id}`)
