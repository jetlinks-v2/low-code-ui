import {RouteRecordItem} from "@jetlinks/types";
import { BasicLayoutPage } from '@/layout'

export const USER_CENTER_ROUTE: RouteRecordItem = {
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
}
