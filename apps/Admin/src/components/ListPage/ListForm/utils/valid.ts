export const validListForm = (data1, data2) => {
  console.log(data1, data2);
  let errorList: any = []
  if(data1.configured.includes('card')) {
    if(!data2.field1) errorList.push({
      key: 'field1',
      message: '字段1必填'
    })
    if(data2.specialStyle?.length && !data2.emphasisFiled?.length) {
      errorList.push({
        key: 'emphasisField',
        message: '请配置'
      })
    }
  }
  console.log(errorList);
  return errorList
}