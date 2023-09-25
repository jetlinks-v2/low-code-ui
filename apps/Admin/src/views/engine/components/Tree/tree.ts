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

