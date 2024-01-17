import { request } from '@/utils/axios'

export const _export = (projectId: string, functionId: string, commandId: string, data?: any, ) => request.postStream(`/low-code/runtime/${projectId}/${functionId}/${commandId}/_file`, data, {})

export const _import = (projectId: string, functionId: string, commandId: string, data?: any, ) => request.post(`/low-code/runtime/${projectId}/${functionId}/${commandId}`, data)

export const dictionaryItemList = (id: string) => request.get(`/dictionary/${id}/items`)

/**用户列表 */
export const userList = (data: any) => request.post(`/user/_query/no-paging`, data)

/**获取指定两个类型支持的所有正反向关系 */
export const relationListApi = (objectType: string, targetType: string) => request.get(`/relation/${objectType}/${targetType}/relations`)

/**查询指定类型数据的关系信息 */
export const relationApi = (objectType: string, id: string) => request.get(`/relation/${objectType}/${id}/related`)

/**保存指定类型数据的关系信息 */
export const saveRelationApi = (type: string, id: string, data: any) => request.patch(`/relation/${type}/${id}/_bind`, data)

/**获取所有的关系对象类型 */
export const relationTypeListApi = () => request.get(`/relation/types`)

/**查询关系结构体数据 */
export const relationStructureApi = (typeId: string) => request.post(`/relation/object/${typeId}/_query/no-paging`, {})
