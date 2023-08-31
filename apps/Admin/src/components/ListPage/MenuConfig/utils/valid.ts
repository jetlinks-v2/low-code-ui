export const validMenu = (data: any) => {
  if(!data) return []
  let errorList: any = [];
  if(data.systemMenu) {
    if(data?.name === '') {
      errorList.push({
        key: 'name',
        message: '请配置'
      })
    }
    if(data?.icon === '') {
      errorList.push({
        key: 'icon',
        message: '请配置'
      })
    }
  }
  return errorList
};