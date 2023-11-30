import { BasicLayoutPage } from '@LowCode/layout'

export const BASIC_ROUTER_DATA: any[] = [
  // {
  //   code: 'center',
  //   name: 'WEB IDE',
  //   url: '/delivery/center',
  // },
  {
    code: 'engine',
    name: '项目编辑器',
    url: '/engine/:id',
    meta: {
      hideInMenu: true,
      hasLayout: false
    }
  },
  {
    code: 'release',
    name: '发布',
    url: '/release/:id',
    meta: {
      hideInMenu: true,
      hasLayout: false
    }
  },
  {
    code: 'preview',
    name: '预览',
    url: '/preview/:project/:module/:id/:type/:sid',
    meta: {
      hideInMenu: true,
      hasLayout: false
    }
  },
  // {
  //   code: 'process',
  //   name: '流程引擎',
  //   url: '/flow-engine',
  //   redirect: '/flow-engine/home',
  //   children: [
  //     {
  //       code: 'process/home',
  //       name: '',
  //       url: '/flow-engine/home',
  //       meta: {
  //         hideInMenu: true
  //       }
  //     },
  //     {
  //       code: 'process/model',
  //       name: '流程模型',
  //       url: '/flow-engine/model',
  //       meta: {
  //         hideInMenu: true
  //       }
  //     },
  //     {
  //       code: 'process/instance',
  //       name: '流程实例',
  //       url: '/flow-engine/instance',
  //       meta: {
  //         hideInMenu: true
  //       }
  //     },
  //     {
  //       code: 'process/monitor',
  //       name: '流程监控',
  //       url: '/flow-engine/monitor',
  //       meta: {
  //         hideInMenu: true
  //       }
  //     },
  //     {
  //       code: 'process/initiate',
  //       name: '发起流程',
  //       url: '/flow-engine/initiate',
  //       meta: {
  //         hideInMenu: true
  //       }
  //     },
  //     {
  //       code: 'process/form',
  //       name: '流程表单',
  //       url: '/flow-engine/form',
  //       meta: {
  //         hideInMenu: true
  //       }
  //     },
  //     {
  //
  //       code: 'process/me/todo',
  //       name: '待办事项',
  //       url: '/flow-engine/me/todo',
  //       meta: {
  //         hideInMenu: true
  //       }
  //     },
  //     {
  //       code: 'process/me/finished',
  //       name: '已办事项',
  //       url: '/flow-engine/me/finished',
  //       meta: {
  //         hideInMenu: true
  //       }
  //     },
  //     {
  //       code: 'process/me/cc',
  //       name: '抄送给我',
  //       url: '/flow-engine/me/cc',
  //       meta: {
  //         hideInMenu: true
  //       }
  //     },
  //     {
  //       code: 'process/me/initiate',
  //       name: '我发起的',
  //       url: '/flow-engine/me/initiate',
  //       meta: {
  //         hideInMenu: true
  //       }
  //     }
  //   ]
  // },
]
export const BASIC_ROUTERS: RouteRecordItem[] = [
  {
    path: '/engine/:id',
    name: 'Engine',
    component: () => import('@LowCode/views/engine/index.vue'),
    meta: {
      title: '项目编辑器',
    },
  },
  {
    path: '/release/:id',
    name: 'Release',
    component: () => import('@LowCode/views/release/index.vue'),
    meta: {
      title: '项目发布',
    },
  },
  {
    path: '/preview/:project/:module/:id/:type/:sid',
    name: 'Preview',
    meta: {
      title: '预览',
    },
    component: () => import('@LowCode/views/preview/index.vue'),
  },
]

export const LOGIN_ROUTE: any = {
  path: '/login',
  name: 'Login',
  // @ts-ignore
  component: () => import('@LowCode/views/login/index.vue'),
  meta: {
    title: '登录页'
  }
}
