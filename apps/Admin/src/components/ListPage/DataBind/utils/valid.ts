export const validDataBind = (data: any, functionOptions: any) => {
  const errorList: any = [];
  for(let key in data) {
    if(!data[key]) {
      errorList.push({
        key,
        message: '请配置'
      })
    } else if(key === 'function') {
      const isExist = functionOptions.find(item => item.id === data.function)
      if(!isExist) {
        errorList.push({
          key: 'function',
          message: '绑定功能已被删除，请重新选择'
        })
      }
    }
  }
  return errorList;
}