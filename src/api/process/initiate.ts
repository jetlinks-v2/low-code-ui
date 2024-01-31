import { request } from '@LowCode/utils/axios'

/**
 * 查询可发起流程
 * @returns
 */
export const getList_api = (data: any) =>
  request.post(`/process/runtime/startable/_query/no-paging`, data)

/**
 * 发起流程
 * @returns
 */
export const create_api = ({ id, data, start }: any) =>
  request.postParams(`/process/runtime/${id}/_create`, data, { start })

/**
 * 获取流程详情
 * @returns
 */
export const processDetail_api = (id: string) =>
  request.get(`/process/runtime/process/detail/${id}`)

  /**
 * 有草稿时保存
 * @returns
 */
export const save_api = ({ id, data }: any) =>
request.postParams(`/process/runtime/${id}/_save`, data)

  /**
 * 启动草稿
 * @returns
 */
  export const start_api = ({ id, data, start }: any) =>
  request.postParams(`/process/runtime/${id}/_start`, data, { start })
