export const validMenu = (data: any) => {
  if(!data) return []
  let errorList: any = [];
  if(data.main) {
    if(data?.name === '' || (data?.name.length < 2 || data?.name.length > 16)) {
      errorList.push({
        key: 'name',
        message: '请输入2-16个字符'
      })
    }
    if(data?.icon === '') {
      errorList.push({
        key: 'icon',
        message: '请配置图标'
      })
    }
  }
  return errorList
};