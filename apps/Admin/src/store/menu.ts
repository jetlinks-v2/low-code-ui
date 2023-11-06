import { defineStore } from 'pinia'
import { router } from '@jetlinks/router'
import { cloneDeep } from 'lodash-es'
import { setParamsValue } from '@jetlinks/hooks'
import { onlyMessage } from '@jetlinks/utils'
import {handleMenus, handleMenusMap, handleSiderMenu} from '@/utils'
import { getOwnMenuThree } from '@/api/menu'
import { getGlobModules } from '@/router/globModules'
import { extraMenu } from '@/router/extraMenu'
import {BASIC_ROUTER_DATA, BASIC_ROUTERS} from "@/router/basic";
import { useAuthStore } from '@/store/auth'

const defaultOwnParams = [
    {
      terms: [
        {
          terms: [
            {
              column: 'owner',
              termType: 'eq',
              value: 'iot'
            },
            {
              column: 'owner',
              termType: 'isnull',
              value: '1',
              type: 'or'
            }
          ]
        }
      ]
    }
  ]

export const useMenuStore = defineStore('menu', () => {
    const menu = ref<any[]>([])
    const menusMap = ref<Map<string, any>>(new Map())
    const siderMenus = ref([])

    const authStore = useAuthStore()

    const hasRouteMenu = () => {
        return !!Object.keys(menu).length
    }

    const hasMenu = (code: string) => {
        return menusMap.value.has(code)
    }

    /**
     * 页面跳转
     * @param name 路由name
     * @param param1 {Object} 需要传递的参数
     */
    const jumpPage = (name: string, { params, query }: { params?: Record<string, any>, query?: Record<string, any>}) => {
        if (hasMenu(name)) {
            router.push({ name, params, query })
            setParamsValue(name, params)
        } else {
            onlyMessage('暂无权限，请联系管理员', 'error')
            console.warn(`没有找到对应的页面: ${name}`)
        }
    }

    const handleMenusMapById = (item: { name: string, path: string}) => {
      const { name, path } = item
      if (name) {
        menusMap.value.set(name, { path })
      }
    }

    const queryMenus = async () => {
        const resp = await getOwnMenuThree({ paging: false, terms: defaultOwnParams })
        const asyncRoutes = getGlobModules()
        menusMap.value.clear()

        if (resp.success) {
            const routes = handleMenus(cloneDeep(BASIC_ROUTER_DATA), extraMenu, asyncRoutes) // 处理路由
            // const routes: any[] = BASIC_ROUTERS
            if (routes.length) {
              routes.push({
                path: '/',
                redirect: routes[0].path
              })
            }

            authStore.handlePermission(resp.result) // 处理按钮权限
            menu.value = routes

            console.log('routes',routes)
            handleMenusMap(routes, handleMenusMapById)
            siderMenus.value = handleSiderMenu(cloneDeep(BASIC_ROUTER_DATA)) // 处理菜单
        }
    }

    return {
        menu,
        siderMenus,
        menusMap,
        hasRouteMenu,
        hasMenu,
        jumpPage,
        queryMenus
    }
})
