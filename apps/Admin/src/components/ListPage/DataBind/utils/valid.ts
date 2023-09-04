export const validDataBind = (data: any) => {
  const errorList: any = [];
  for(let key in data) {
    if(!data[key]) {
      errorList.push({
        key,
        message: '请配置'
      })
    }
  }
  return errorList;
}