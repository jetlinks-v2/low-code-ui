import { providerEnum } from "@/components/ProJect";

export const validDataBind = (data: any, functionOptions: any) => {
  const errorList: any = [];
  const isExist = functionOptions.find(item => item.fullId === data.function)
  console.log(data);
  for(let key in data) {
    if(!data.dataSource.length && key === 'dataSource') {
      errorList.push({
        key,
        message: '请配置'
      })
    } else if(!data[key]) {
      errorList.push({
        key,
        message: '请配置'
      })
    } else if(key === 'function') {
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