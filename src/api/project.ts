import { request } from '@jetlinks-web/core'

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
export const queryCommand = (id: string, data?: any) => request.post(`/low-code/editor/${id}/support/commands`, data)

/**
 * 新增草稿
 @param id 草稿id
 @param type 新增标识(extensions,modules,functions,resources)
 @param data 新增本体
 @param params {Object} moduleId=上级文件夹id(没有则不传)
 */
export const addDraft = (id: string, type: string, data: any, params?: any) => request.postParams(`/low-code/editor/draft/${id}/${type}/_insert`, data, params)

/**
 * 更新草稿
 * @param id 草稿id
 * @param type 更新标识(extensions,modules,functions,resources)
 * @param updateId 需要更新的功能或资源id
 * @param data 更新本体
 */

export const updateDraft = (id: string, type: string, updateId: string, data: any) => request.post(`/low-code/editor/draft/${id}/${type}/${updateId}/_update`, data)

//更新project other
export const updateProjectDraft = (id: string, data: any) => request.post(`/low-code/editor/draft/${id}/_update`, data)

/**
 * 删除草稿
 * @param id 草稿id
 * @param type 删除标识(extensions,modules,functions,resources)
 * @param deleteId 需要删除的功能或资源id
 */
export const deleteDraft = (id: string, type: string, deleteId: string) => request.post(`/low-code/editor/draft/${id}/${type}/${deleteId}/_delete`)

/**
 * 拖动草稿
 * @param id 草稿id
 * @param type 删除标识(extensions,modules,functions,resources)
 * @param  需要移动的功能或资源id
 */
export const moveDraft = (id: string, type: string, moveId:string, params: any) => request.postParams(`/low-code/editor/draft/${id}/${type}/${moveId}/_move`,{},params)

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
