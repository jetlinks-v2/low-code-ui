import { RouteRecordItem } from '@jetlinks/types'
import { BasicLayoutPage } from '@/layout'

export const BASIC_ROUTER_DATA: any[] = [
  // {
  //   code: 'delivery',
  //   name: 'WEB IDE',
  //   url: '/delivery',
  //   redirect: '/delivery/center',
  //   children: [
  //     {
  //       code: 'center',
  //       name: 'WEB IDE',
  //       url: '/delivery/center',
  //       meta: {
  //         hideInMenu: true
  //       }
  //     },
  //   ]
  // },
  {
    code: 'center',
    name: 'WEB IDE',
    url: '/delivery/center',
  },
  {
    code: 'engine',
    name: '项目编辑器',
    url: '/engine/:id',
    meta: {
      hideInMenu: true
    }
  },
  {
    code: 'release',
    name: '发布',
    url: '/release/:id',
    meta: {
      hideInMenu: true
    }
  },
  {
    code: 'preview',
    name: '预览',
    url: '/preview/:project/:module/:id/:type/:sid',
    meta: {
      hideInMenu: true
    }
  },
  {
    code: 'process',
    name: '流程引擎',
    url: '/flow-engine',
    redirect: '/flow-engine/home',
    children: [
      {
        code: 'process/home',
        name: '流程模型',
        url: '/flow-engine/home',
        meta: {
          hideInMenu: true
        }
      },
      {
        code: 'process/model',
        name: '流程模型',
        url: '/flow-engine/model',
        meta: {
          hideInMenu: true
        }
      },
      {
        code: 'process/instance',
        name: '流程实例',
        url: '/flow-engine/instance',
        meta: {
          hideInMenu: true
        }
      },
      {
        code: 'process/monitor',
        name: '流程监控',
        url: '/flow-engine/monitor',
        meta: {
          hideInMenu: true
        }
      },
      {
        code: 'process/initiate',
        name: '发起流程',
        url: '/flow-engine/initiate',
        meta: {
          hideInMenu: true
        }
      },
      {
        code: 'process/form',
        name: '流程表单',
        url: '/flow-engine/form',
        meta: {
          hideInMenu: true
        }
      },
      {

        code: 'process/me/todo',
        name: '待办事项',
        url: '/flow-engine/me/todo',
        meta: {
          hideInMenu: true
        }
      },
      {
        code: 'process/me',
        name: '已办事项',
        url: '/flow-engine/me/finished',
        meta: {
          hideInMenu: true
        }
      },
      {
        code: 'process/me/cc',
        name: '抄送给我',
        url: '/flow-engine/me/cc',
        meta: {
          hideInMenu: true
        }
      },
      {
        code: 'process/me/initiate',
        name: '我发起的',
        url: '/flow-engine/me/initiate',
        meta: {
          hideInMenu: true
        }
      }
    ]
  },
]
export const BASIC_ROUTERS: RouteRecordItem[] = [
  {
    path: '/delivery',
    name: 'Delivery',
    redirect: '/delivery/center',
    component: BasicLayoutPage,
    meta: {
      title: '交付中心',
      keepAlive: true
    },
    children: [
      {
        path: '/delivery/center',
        name: 'delivery/center',
        meta: {
          title: '低码引擎',
          keepAlive: true
        },
        component: () => import('@/views/center/index.vue'),
      },
    ],
  },
  {
    path: '/engine/:id',
    name: 'Engine',
    component: () => import('@/views/engine/index.vue'),
    meta: {
      title: '项目编辑器',
    },
  },
  {
    path: '/release/:id',
    name: 'Release',
    component: () => import('@/views/release/index.vue'),
    meta: {
      title: '项目发布',
    },
  },
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('@/views/demo/index.vue'),
    meta: {
      title: '测试页',
    },
  },
  {
    path: '/card',
    name: 'Card',
    component: () => import('@/views/demo/Card.vue'),
    meta: {
      title: '测试页',
    },
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('@/views/demo/EditorModal.vue'),
    meta: {
      title: '测试页',
    },
  },
  {
    path: '/quick',
    name: 'Quick',
    component: () => import('@/views/demo/add.vue'),
    meta: {
      title: '测试页'
    }
  },
  {
    path: '/preview/:project/:module/:id/:type/:sid',
    name: 'Preview',
    meta: {
      title: '预览',
    },
    component: () => import('@/views/preview/index.vue'),
  },
  {
    path: '/list-page',
    name: 'ListPage',
    meta: {
      title: '标准列表页',
    },
    component: () => import('@/components/ListPage/index.vue'),
  },
  {
    path: '/members',
    name: 'Members',
    component: () => import('@/views/demo/members.vue'),
    meta: {
      title: '测试页',
    },
  },
  {
    path: '/flow-engine',
    name: 'FlowEngine',
    redirect: '/flow-engine/model',
    component: BasicLayoutPage,
    meta: {
      title: '流程引擎',
    },
    children: [
      {
        path: '/flow-engine/model',
        name: 'flow-engine/model',
        component: () => import('@/views/process/model/index.vue'),
        meta: {
          title: '流程模型'
        },
        children: [
            {
                path: '/flow-engine/model',
                name: 'flow-engine/model',
                component: () => import('@/views/process/model/index.vue'),
                meta: {
                    title: '流程模型'
                },
                children: [
                    {
                        path: 'detail',
                        name: 'detail',
                        component: () => import('@/views/process/model/Detail/index.vue'),
                        meta: {
                            title: '流程详情'
                        }
                    },
                ]
            },
            {
                path: '/flow-engine/instance',
                name: 'Instance',
                component: () => import('@/views/process/instance/index.vue'),
                meta: {
                    title: '流程实例',
                },
            },
            {
                path: '/flow-engine/monitor',
                name: 'Monitor',
                component: () => import('@/views/process/monitor/index.vue'),
                meta: {
                    title: '流程监控',
                },
            },
            {
                path: '/flow-engine/initiate',
                name: 'Initiate',
                component: () => import('@/views/process/initiate/index.vue'),
                meta: {
                    title: '发起流程',
                },
                children: [
                    {
                        path: 'initiate-detail',
                        name: 'initiate-detail',
                        component: () => import('@/views/process/initiate/Detail/index.vue'),
                        meta: {
                            title: '流程详情'
                        }
                    },
                ]
            },
            {
                path: '/flow-engine/me',
                name: 'Me',
                // component: () => import('@/views/process/me/index.vue'),
                meta: {
                    title: '我的流程',
                },
                children: [
                    {
                        path: '/flow-engine/me/todo',
                        name: 'todo',
                        component: () => import('@/views/process/me/index.vue'),
                        meta: {
                            title: '待办事项'
                        }
                    },
                    {
                        path: '/flow-engine/me/finished',
                        name: 'finished',
                        component: () => import('@/views/process/me/index.vue'),
                        meta: {
                            title: '已办事项'
                        }
                    },
                    {
                        path: '/flow-engine/me/cc',
                        name: 'cc',
                        component: () => import('@/views/process/me/index.vue'),
                        meta: {
                            title: '抄送给我'
                        }
                    },
                    {
                        path: '/flow-engine/me/initiate',
                        name: 'initiate',
                        component: () => import('@/views/process/me/index.vue'),
                        meta: {
                            title: '我发起的'
                        }
                    },
                ]
            },
            {
                path: '/flow-engine/form',
                name: 'Form',
                component: () => import('@/views/process/form/index.vue'),
                meta: {
                    title: '流程表单',
                },
                children: [
                    {
                        path: 'detail/:id',
                        name: 'detail/:id',
                        component: () => import('@/views/process/form/Detail/index.vue'),
                        meta: {
                            title: '我的表单'
                        }
                    },
                ]
            },
          {
            path: 'detail',
            name: 'detail',
            component: () => import('@/views/process/model/Detail/index.vue'),
            meta: {
              hideInMenu: true,
              title: '流程详情'
            }
          },
        ]
      },
      {
        path: '/flow-engine/instance',
        name: 'Instance',
        component: () => import('@/views/process/instance/index.vue'),
        meta: {
          title: '流程实例',
        },
      },
      {
        path: '/flow-engine/monitor',
        name: 'Monitor',
        component: () => import('@/views/process/monitor/index.vue'),
        meta: {
          title: '流程监控',
        },
      },
      {
        path: '/flow-engine/initiate',
        name: 'Initiate',
        component: () => import('@/views/process/initiate/index.vue'),
        meta: {
          title: '发起流程',
        },
        children: [
          {
            path: 'initiate-detail',
            name: 'initiate-detail',
            component: () => import('@/views/process/initiate/Detail/index.vue'),
            meta: {
              title: '流程详情'
            }
          },
        ]
      },
      {
        path: '/flow-engine/form',
        name: 'Form',
        component: () => import('@/views/process/form/index.vue'),
        meta: {
          title: '流程表单',
        },
        children: [
          {
            path: 'detail/:id',
            name: 'detail/:id',
            component: () => import('@/views/process/form/Detail/index.vue'),
            meta: {
              title: '我的表单'
            }
          },
        ]
      },
    ]
  },
]
