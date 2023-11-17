import { request } from '@jetlinks/core'

//工作流表单
// 保存
export const _save = (data: any) => request.patch('/process/form', data);

export const _update = (data: any) => request.post('/process/form/new-version/_insert', data);

// 查询
export const _query = (data: any) => request.post('/process/form/latest/_query', data);

//流程表单创建人
export const _queryCreator = (data: any) => request.post('/process/form/latest/_query/no-paging?distinctBy=creatorId', data);

// 删除
export const _delete = (id: string) => request.remove(`/process/form/key/${id}`);

/**
 * 验证设备ID是否重复
 * @param key 表单key
 * @returns 
 */
export const isExists = (key: string) => request.post(`/process/form/_exists`, {
    terms: [
        {
            value: 'true',
            termType: 'eq',
            column: 'latest',
        },
        {
            value: key,
            termType: 'eq',
            column: 'key',
        }
    ],
})

export const _detail = (id: string) => request.get(`/process/form/${id}`);

