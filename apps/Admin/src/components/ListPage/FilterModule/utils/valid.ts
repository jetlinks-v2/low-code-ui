import { useProduct } from "@/store";
import { providerEnum } from "@/components/ProJect";
export const validFilterModule = (list: any[]) => {
  const productStore = useProduct();
  const functionList = [...productStore.getDataMap().values()].filter(item => {
    return [providerEnum.CRUD, providerEnum.Function, providerEnum.SQL].includes(item.type)
  })
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
    if(item.config?.value == 'data' && item.config?.dataValue?.length === 0) {
      errorList.push({
        key: 'config' + index,
        childKey: 'dataValue' + index,
        message: '请配置数据字典'
      })
    } else if(item.config?.value === 'rearEnd') {
      if(!item.config?.abilityValue || item.config?.abilityValue?.length === 0) {
        errorList.push({
          key: 'config' + index,
          childKey: 'abilityValue' + index,
          message: '请配置后端功能'
        })
      } else {
        const result = functionList.filter(val => val.fullId === item.config?.abilityValue)
        if(result.length === 0) {
          errorList.push({
            key: 'config' + index,
            childKey: 'abilityValue' + index,
            message: '后端功能不存在'
          })
        }
      }
      if(!item.config?.instructValue || item.config?.instructValue?.length === 0) {
        errorList.push({
          key: 'config' + index,
          childKey: 'instructValue' + index,
          message: '请配置后端指令'
        })
      }
    }
  })
  console.log(errorList);
  return errorList
};