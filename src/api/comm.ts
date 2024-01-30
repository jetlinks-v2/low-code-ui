import { request } from '@LowCode/utils/axios'

export const FileStatic = '/file/upload'
export const fileUpload = (data: any, params?: any) => request.post(FileStatic, data, {params})

//上传接口
const BASE_API_PATH= import.meta.env.VITE_APP_BASE_API
export const _fileUpload = (options?: string) => options ? `${BASE_API_PATH}/file/upload?options=${options}` : `${BASE_API_PATH}/file/upload`

/**
 * 保存查询记录
 * @param data
 * @param target
 */
export const saveSearchHistory = (data: any, target:string) => request.post(`/user/settings/${target}`, data)

/**
 * 获取查询记录
 * @param target
 */
export const getSearchHistory = (target:string) => request.get(`/user/settings/${target}`)

/**
 * 删除指定查询记录
 * @param id
 * @param target
 */
export const deleteSearchHistory = (target:string, id:string) => request.remove(`/user/settings/${target}/${id}`)
