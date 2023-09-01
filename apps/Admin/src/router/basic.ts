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
    path: '/preview/:id',
    name: 'Preview',
    meta: {
      title: '预览',
    },
    component: () => import('@/components/ListPage/Preview/index.vue'),
  },
]
