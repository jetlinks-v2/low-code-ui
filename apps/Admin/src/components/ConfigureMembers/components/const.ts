export const defaultColumns = (key: string) => {
  return [
    {
      title: key === 'org' ? '组织' : key === 'user' ? '用户' : '角色',
      // dataIndex: 'organization',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      ellipsis: true,
      scopedSlots: true,
    },
  ]
}

/**
 * 将树形结构数据扁平化
 * @param tree
 */
export const flattenTree = (tree: any[]) => {
  return tree.reduce((pre: any[], cur: any) => {
    pre.push(cur)
    if (cur.children) {
      pre = pre.concat(flattenTree(cur.children))
    }
    return pre
  }, [])
}
