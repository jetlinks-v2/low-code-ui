export const validFilterModule = async (list: any[]) => {
  console.log(list);
  let errorList: any = [];
  list.forEach(item => {
    if(!item.name || item.name === '') {
      errorList.push(item)
    }
  })
  if (errorList.length > 0) {
    throw errorList;
  } else {
    return [];
  }
};