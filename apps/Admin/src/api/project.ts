import { request } from '@jetlinks/core'

//新增项目
export const addProject = (data: any) => request.post(`/low-code/info/_add`, data)

//编辑项目
export const editProject = (data: any) => request.post(`/low-code/info/_update`, data)

//删除项目
export const delProject = (id: any) => request.remove(`/low-code/info/${id}/_delete`)

//查询项目列表
export const queryProject = (data: any) => request.post(`/low-code/info/_query`,data)

//项目列表不分页
export const queryProjectNoPaging = (data: any) => request.post(`/low-code/info/_query/no-paging`,data)