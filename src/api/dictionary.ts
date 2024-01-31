import { request } from '@LowCode/utils/axios'

export const basicField = () => request.get('/dictionary/basic-field-types/items')

export const dictionaryItemList = (data: any) => request.post('/dictionary-item/_query/no-paging', data)
export const dictionaryList = (data: any) => request.post('/dictionary/_query/no-paging', data)
