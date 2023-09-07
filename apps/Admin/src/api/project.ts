import { request } from '@jetlinks/core'

//新增项目
export const addProject = (data: any) => request.post(`/low-code/info/_add`, data)

//编辑项目
export const editProject = (data: any) => request.post(`/low-code/info/_update`, data)


//删除项目
export const delProject = (id: any) => request.remove(`/low-code/info/${id}/_delete`)

//查询项目列表
export const queryProject = (data: any) => request.post(`/low-code/info/_query`,data)

//启用项目
export const enableProject = (id: any) => request.post(`/low-code/info/${id}/_enable`)

//禁用项目
export const disabledProject = (id: any) => request.post(`/low-code/info/${id}/_disabled`)

//项目列表不分页
export const queryProjectNoPaging = (data: any) => request.post(`/low-code/info/_query/no-paging`,data)

export const queryProjectDraft = (id: string) => request.post<Draft.Info>(`/low-code/info/draft/${id}/_detail`)

/**
 * 查询功能下的指令
 */
export const queryCommand = (data: any) => request.post(`/low-code/editor/support/commands`, data)

export const updateDraft = (id: string, data: any) => request.post(`/low-code/editor/draft/${id}/_update`, data)

/**
 * 发布草稿
 * @param id
 */
export const releaseDraft = (id: string) => request.put(`/low-code/editor/${id}/_deploy`)

/**
 * 校验草稿
 * @param id
 */
export const validateDraft = (id: string) => request.post(`/low-code/editor/${id}/_validate`, [])
