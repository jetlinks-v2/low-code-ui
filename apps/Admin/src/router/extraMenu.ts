export const extraMenu = {
  'system/Role': [{ // 角色管理
    code: 'system/Role/Detail',
    url: '/Detail/:id',
    name: '角色详情'
  }],
  'system/Menu': [
    {
      code: 'system/Menu/Setting',
      url: '/Setting',
      name: '菜单配置'
    },
    {
      code: 'system/Menu/Detail',
      url: '/Detail/:id',
      name: '菜单详情'
    },
  ],
  'process/model': [{
    code: 'process/model/Detail',
    name: '流程详情',
    url: '/detail'
  }],
  // 'process/initiate': [{
  //   code: 'process/initiate/Detail',
  //   name: '流程详情',
  //   url: '/initiate-detail'
  // }],
  'process/form': [{
    code: 'process/form/Detail',
    name: '我的表单',
    url: '/detail/:id'
  }],
  // 'delivery': [{
  //   code: 'engine',
  //   name: '项目编辑器',
  //   url: '/engine/:id',
  //   meta: {
  //     hideInMenu: true
  //   }
  // }]
}
