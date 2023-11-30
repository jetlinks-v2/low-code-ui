export const isEmpty = (value) => {  
  // 判断是否为空字符串  
  if (typeof value === 'string' && value.trim() === '') {  
    return true;  
  }  
    
  // 判断是否为null或undefined  
  if (value == null) {  
    return true;  
  }  
  
  // 判断是否为空对象  
  if (typeof value === 'object' && Object.keys(value).length === 0) {  
    return true;  
  }  
  
  // 判断是否为空数组  
  if (Array.isArray(value) && value.length === 0) {  
    return true;  
  }  
  
  return false; 
}  