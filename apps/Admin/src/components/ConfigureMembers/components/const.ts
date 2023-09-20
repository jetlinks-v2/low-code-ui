export const defaultColumns = (key: string) => {
  return [
    {
      title: key === 'organization' ? '组织' : key === 'user' ? '用户' : '角色',
      // dataIndex: 'organization',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '权重',
      dataIndex: 'weights',
      key: 'weights',
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
