export const validListData = async (list: any[]): Promise<any[]> => {
  console.log(list);
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
  console.log(errorList);
  return errorList.length ? errorList : [];
};