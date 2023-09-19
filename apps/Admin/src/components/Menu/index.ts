//根据id删除
export const DeleteTreeById = (tree: any[], id: string) => {
  return tree.filter(item => {
    if (item.id === id) {
      return false
    }
    if (item.children) {
      item.children = DeleteTreeById(item.children, id)
    }
    return true
  })
}

//判断tree层级
export const getTreeLevel = (tree, level = 0) => {
  let maxLevel = level;

  tree.forEach((node) => {
    if (node.children && node.children.length > 0) {
      const childLevel = getTreeLevel(node.children, level + 1);
      maxLevel = Math.max(maxLevel, childLevel);
    }
  });

  return maxLevel;
};


const updateTree = (data: any[], record: any) => {
  return data.map(item => {
    if (item.id === record.id) {
      return {
        ...item,
        ...record
      }
    } else if (item.children) {
      item.children = updateTree(item.children, record)
    }
    return item
  })
}
const isIdInTree = (tree, id) => {
  for (const node of tree) {
    if (node.id === id) {
      return true;
    }
    if (node.children && node.children.length > 0) {
      if (isIdInTree(node.children, id)) {
        return true;
      }
    }
  }
  return false;
};
//根据id判断新增还是编辑
export const handleTreeModal = (data, record) => {
  const arr = updateTree(data, record)
  if (isIdInTree(arr, record.id)) {
    return arr
  } else {
    return [...arr, record]
  }
}

//sortIndex
export const handleSort = (tree) => {
  return tree.map((item, index) => {
    if (item) {
      return {
        ...item,
        sortIndex: index
      }
    }
    if (item.children) {
      item.children = handleSort(item.children)
    }
    return item
  })
}