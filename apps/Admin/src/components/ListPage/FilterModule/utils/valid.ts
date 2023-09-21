export const validFilterModule = (list: any[]) => {
  let errorList: any = [];
  list?.forEach((item, index) => {
    if(!item.name || item.name === '') {
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
    if(!item.id || item.id === '') {
      errorList.push({
        key: 'id' + index,
        message: '请配置'
      })
    } else if(item.id) {
      const result = list.filter(val => val.id == item.id)
      if(result.length > 1) {
        errorList.push({
          key: 'id' + index,
          message: '标识重复'
        })
      }
      if(item.id.length > 64) {
        errorList.push({
          key: 'id' + index,
          message: '最多可输入64个字符'
        })
      }
    }
    if(item.config) {
      if(item.config.value == 'data' && item.config.instructValue.length === 0) {
        errorList.push({
          key: 'config' + index,
          message: '请配置数据字典'
        })
      } else if(item.config.value === 'rearEnd') {
        if(item.config.abilityValue.length === 0) {
          errorList.push({
            key: 'config' + index,
            message: '请配置后端功能'
          })
        }
        if(item.config.dataValue.length === 0) {
          errorList.push({
            key: 'config' + index,
            message: '请配置后端指令'
          })
        }
      }
    }
  })
  return errorList
};