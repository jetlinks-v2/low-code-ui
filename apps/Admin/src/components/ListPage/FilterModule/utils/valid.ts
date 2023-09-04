export const validFilterModule = (list: any[]) => {
  let errorList: any = [];
  list?.forEach(item => {
    if(!item.name || item.name === '') {
      errorList.push({
        key: item.id,
        message: '请配置'
      })
    }
    if(!item.id || item.id === '') {
      errorList.push({
        key: item.id,
        message: '请配置'
      })
    }
  })
  return errorList
};