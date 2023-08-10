import {RouteRecordItem} from "@jetlinks/types";
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
      }
    ]
  },
  {
    path: '/engine/:id',
    name: 'Engine',
    component: () => import('@/views/engine/index.vue'),
    meta: {
      title: '项目编辑器'
    }
  },
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('@/views/demo/index.vue'),
    meta: {
      title: '测试页'
    }
  },
]
