export const validListData = (list: any[]) => {
  let errorList: any = [];
  list?.forEach((item, index) => {
    if(!item.name.length) {
      errorList.push({
        key: 'name' + index,
        message: '请配置'
      })
    } else if(item.name) {
      if(item.name.length > 64) {
        errorList.push({
          key: 'name' + index,
          message: '最多可输入64个字符'
        })
      }
    }
    if(!item.id?.length) {
      errorList.push({
        key: 'id' + index,
        message: '请配置'
      })
    } else if(item.id) {
      const result = list.filter(val => val.id == item.id)
      if(result.length > 1 || item.id.length > 64) {
        errorList.push({
          key: 'id' + index,
          message: result.length > 1 ? '标识重复' : '最多可输入64个字符'
        })
      }
    }
  })
  console.log(errorList);
  return errorList
};