//找对应节点
export const restParentId = (tree, parentId=null) => {
    return tree.map(item => {
        if (item) {
            item = {
                ...item,
                parentId:parentId
            }
        }
        if(item.children){
            item.children = restParentId(item.children,item.id)
        }
        return item
    })
};
//根据id找节点
let record:any;
export const findById = (tree:any[], id:string) => {
    
    tree.some(item => {
        if (item.id === id) {
            record = item
          return true
        }
        if (item.children) {
            findById(item.children, id)
        }
        return false
      })
      return  record

};
