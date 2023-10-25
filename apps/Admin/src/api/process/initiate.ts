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
export const start_api = ({data, start}: any) =>
  request.postParams(`/process/runtime/${data.id}/_create`, data, {start})
