export const validListData = (list: any[]) => {
  let errorList: any = [];
  list?.forEach(item => {
    for(let key in item) {
      if(!item[key] || item[key] === '') {
        errorList.push({
          key: item.id,
          message: '请配置'
        })
      }
    }
  })
  return errorList
};