import { request } from '@jetlinks-web/core'

//获取用户列表
export const getUserList = (data: any) => request.post('/user/_query', data);

//获取全部用户列表不分页
export const getUser_PaginateNot = (data: any) => request.post('/user/_query/no-paging', data);

//获取角色列表
export const getRoleList = (data: any, type: Boolean = true) => request.post(`/role/group/detail/_query/tree?queryByRole=${type}`, data);

//获取组织列表
export const getTissue = (data: any) => request.post('/organization/_all/tree', data)

/**
 * 查询产品列表(分页)
 * @param data 查询条件
 */
export const queryProductList = (data: any) => request.post('/device-product/_query', data)

/**
 * 查询设备列表(分页)
 */
export const queryDeviceList = (data: any) => request.post('/device-instance/_query', data)

/**
 * 查询产品列表(不分页)
 */
export const queryProductNoPage = (data: any) => request.post('/device-product/_query/no-paging', data)

/**
 * 查询设备列表(不分页)
 */
export const queryDeviceNoPage = (data: any) => request.post('/device-instance/_query/no-paging', data)
/**
 * 查询字典列表
 */
export const queryDictionary = () => request.post('/dictionary/_query/no-paging', { paging: false, sorts: [{ name: 'createTime', order: 'desc' }, { name: 'name', order: 'desc' }] })

/**
* 字典查询下拉数据
*/
export const queryDictionaryData = (id: string) => request.post(`/dictionary-item/_query/no-paging`, { paging: false, terms: [{ value: id, termType: 'eq', column: 'dictId' }], sorts: [{name: "ordinal", order: "asc"}] })

/**
 * 获取功能预支持的指令
 */
export const queryEndCommands = (id: string, data?: any) => request.post(`/low-code/editor/project/${id}/support/commands`, data)
export const queryDraftCommands = (id: string, data?: any) => request.post(`/low-code/editor/${id}/support/commands`, data)

/**
 * 获取功能预支持的指令
 */
export const queryEndCommand = (id: string, data?: any) => request.post(`/low-code/editor/${id}/support/commands`, data)

/**
 * 执行功能命令
 */
export const queryRuntime = (projectId: string, functionId: string, commandId: string, data?: any,) => request.post(`/low-code/runtime/${projectId}/${functionId}/${commandId}`, data)


/**
 * 获取地区类型
 */
export const getGeoType = () => request.post(`/district/category/_query/no-paging`, {})

/**
 * 获取地区
 */
export const getGeoTree = ( data: any) => request.post(`/area/_all/tree`, data)



/**
 * 根据类别条件查询地区（树结构）
 * categoryId：类型id
 */
export const GeoTreeByName = (categoryId: string, data: any) => request.post(`/district/byCategory/${categoryId}/_tree`, data)

/**
 * 外层获取发布项目时
 */
export const queryProject = () => request.post(`/low-code/info/_query/no-paging`, {
    paging: false,
    sorts: [
        {
            name: 'createTime',
            order: 'desc',
        },
    ],
    terms: [
        {
            value: 'published',
            termType: 'eq',
            column: 'state',
            type: 'and',
        },
        {
            value: 'enabled',
            termType: 'eq',
            column: 'running_state',
            type: 'and',
        },
    ],
})

// 下载文件
export const downloadFile = (url: string) => request.getStream(url)



