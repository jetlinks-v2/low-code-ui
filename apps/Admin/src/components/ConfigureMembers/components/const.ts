export const defaultColumns = (key: string) => {
  return [
    {
      title: key === 'org' ? '组织' : key === 'user' ? '用户' : '角色',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: 120,
    },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      ellipsis: true,
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      ellipsis: true,
      scopedSlots: true,
      width: 80,
    },
  ]
}
export const leftData = {
  org: [
    {
      key: 'org',
      title: '固定组织',
      description: '固定组织下的所有成员均可以作为候选人',
    },
    {
      key: 'var',
      title: '按变量',
      description:
        '指定流程表单中的组织选择组件作为组织变量来源，其下方的所有成员均可作为候选人',
    },
    {
      key: 'relation',
      title: '按关系',
      description:
        '指定流程表单或流程节点中的变量，其所属组织下的所有成员均可作为候选人',
    },
  ],
  user: [
    {
      key: 'user',
      title: '固定用户',
      description: '勾选的所有用户均可以作为候选人',
    },
    {
      key: 'var',
      title: '按变量',
      description:
        '指定流程表单中的用户选择组件，其获取到的用户变量均可作为候选人',
    },
    {
      key: 'relation',
      title: '按关系',
      description:
        '指定流程表单或流程节点中的变量，与变量间符合某种关系的成员可以作为候选人',
    },
  ],
  role: [
    {
      key: 'role',
      title: '固定角色',
      description: '所有被分配了对应角色的用户均可以作为候选人',
    },
    {
      key: 'var',
      title: '按变量',
      description:
        '指定流程表单中的角色选择组件，其获取到的角色变量下的所有用户均可作为候选人',
    },
    {
      key: 'relation',
      title: '按关系',
      description:
        '指定流程表单或流程节点中的人员变量，与人员变量拥有相同角色的用户可以作为候选人',
    },
  ],
}
