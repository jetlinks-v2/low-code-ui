export const validListForm = (data1, data2) => {
  console.log(data1, data2);
  let errorList: any = []
  if(data1.configured.includes('card')) {
    if(!data2.field1) errorList.push('字段1必填')
    if(!data2.field2) errorList.push('字段2必填')
    if(!data2.field3) errorList.push('字段3必填')
  }
  console.log(errorList);
  return errorList
}