import { request } from '@jetlinks-web/core'

export const basicField = () => request.get('/dictionary/basic-field-types/items')

export const dictionaryItemList = () => request.post('/dictionary-item/_query/no-paging', {})
export const dictionaryList = (data) => request.post('/dictionary/_query/no-paging', data)
