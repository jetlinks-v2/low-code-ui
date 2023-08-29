import { request } from '@jetlinks/core'

export const basicField = () => request.get('/dictionary/basic-field-types/items')

export const dictionaryList = () => request.post('/dictionary-item/_query/no-paging', {})
