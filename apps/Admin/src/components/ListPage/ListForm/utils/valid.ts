export const validListForm = (data1, data2) => {
  let errorList: any = []
  if(data1.configured.includes('card')) {
    if(!data2.field1.length) errorList.push({
      key: 'field1',
      message: '字段1必填'
    })
  }
  return errorList
}