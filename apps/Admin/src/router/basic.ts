import { RouteRecordItem } from '@jetlinks/types'
import { BasicLayoutPage } from '@/layout'

export const BASIC_ROUTER_DATA: any[] = [
  {
    code: 'delivery',
    name: 'WEB IDE',
    url: '/delivery',
    children: [
      {
        code: 'center',
        name: '交付中心',
        url: '/delivery/center'
      },
    ]
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
    children: [
      {
        code: 'process/model',
        name: '流程模型',
        url: '/flow-engine/model',
      },
      {
        code: 'process/instance',
        name: '流程实例',
        url: '/flow-engine/instance'
      },
      {
        code: 'process/monitor',
        name: '流程监控',
        url: '/flow-engine/monitor'
      },
      {
        code: 'process/initiate',
        name: '发起流程',
        url: '/flow-engine/initiate'
      },
      {
        code: 'process/form',
        name: '流程表单',
        url: '/flow-engine/form'
      },
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
