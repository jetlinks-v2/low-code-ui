import { RouteRecordItem } from '@jetlinks/types'
import { BasicLayoutPage } from '@/layout'

export const BASIC_ROUTERS: RouteRecordItem[] = [
    {
        path: '/delivery',
        name: 'Delivery',
        redirect: '/delivery/center',
        component: BasicLayoutPage,
        meta: {
            title: '交付中心',
        },
        children: [
            {
                path: '/delivery/center',
                name: 'delivery/center',
                meta: {
                    title: '低码引擎',
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
        ]
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
        path: '/flow-designer',
        name: 'FlowDesigner',
        component: () => import('@/views/demo/flow.vue'),
        meta: {
            title: '测试页'
        }
    },
]
