export const validFilterModule = async (list: any[]): Promise<any[]> => {
  console.log(list);
  let errorList: any = [];
  list.forEach(item => {
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
  if (errorList.length > 0) {
    return errorList;
  } else {
    return [];
  }
};