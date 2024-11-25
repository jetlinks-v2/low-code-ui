import {defineStore} from '@jetlinks-web/stores'
import {router} from '@jetlinks-web/router'
import {cloneDeep} from 'lodash-es'
import {setParamsValue} from '@jetlinks-web/hooks'
import {onlyMessage} from '@jetlinks-web/utils'
import {handleMenus, handleMenusMap, handleSiderMenu, handleMenuInit} from '@LowCode/utils'
import {getOwnMenuThree} from '@LowCode/api/menu'
import {getGlobModules} from '@LowCode/router/globModules'
import {extraMenu} from '@LowCode/router/extraMenu'
import {BASIC_ROUTER_DATA, BASIC_ROUTERS} from "@LowCode/router/basic";
import {useAuthStore} from '@LowCode/store/auth'

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

export const useMenuStore = defineStore('lowcode_menu', () => {
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
   * @param options {Object} 需要传递的参数
   */
  const jumpPage = (name: string, options: { params?: Record<string, any>, query?: Record<string, any> } = {}) => {
    if (hasMenu(name)) {
      const { params, query } = options
      router.push({name, params, query})
      setParamsValue(name, params)
    } else {
      onlyMessage('暂无权限，请联系管理员', 'error')
      console.warn(`没有找到对应的页面: ${name}`)
    }
  }

  const jumpPageByCode = (code: string, options: { params?: Record<string, any>, query?: Record<string, any> } = {}) => {
    if (hasMenu(code)) {
      const { params = {}, query = {} } = options
      const _menuItem = menusMap.value.get(code)
      router.push({path: _menuItem.path, params, query})
      setParamsValue(code, params)
    } else {
      onlyMessage('暂无权限，请联系管理员', 'error')
      console.warn(`没有找到对应的页面: ${code}`)
    }
  }

  const handleMenusMapById = (item: { name: string, path: string }) => {
    const {name, path} = item
    if (name) {
      menusMap.value.set(name, {path})
    }
  }

  const handleMenuMapFn = (data: any[]) => {
    handleMenusMap(data, handleMenusMapById)
  }

  const queryMenus = async () => {
    const resp = await getOwnMenuThree({paging: false, terms: defaultOwnParams})
    const asyncRoutes = getGlobModules()
    menusMap.value.clear()

    if (resp.success) {
      const result = resp.result
      const allMenus = handleMenuInit(cloneDeep(result))
      const filterMenu = handleMenuInit(result.filter(item => ['process', 'web_ide'].includes(item.code)))

      const systemMenu = result.find(item => item.code === 'system')

      if (systemMenu) {
        systemMenu.meta = {
          hideInMenu: true
        }

        allMenus.push(systemMenu)
        filterMenu.push(systemMenu)
      }
      const workFlowMenu = [ ...filterMenu, ...BASIC_ROUTER_DATA]

      const routes = handleMenus(cloneDeep([ ...allMenus, ...BASIC_ROUTER_DATA]), extraMenu, asyncRoutes) // 处理路由
      const base_routers = handleMenus(cloneDeep(workFlowMenu), extraMenu, asyncRoutes) // 处理路由
      if (base_routers.length) {
        base_routers.push({
          path: '/',
          redirect: base_routers[0].path
        })
      }

      authStore.handlePermission(resp.result) // 处理按钮权限
      menu.value = base_routers

      console.log(routes)
      handleMenusMap(routes, handleMenusMapById)
      siderMenus.value = handleSiderMenu(cloneDeep(filterMenu)) // 处理菜单
      console.log(siderMenus.value)
    }
  }

  return {
    menu,
    siderMenus,
    menusMap,
    hasRouteMenu,
    hasMenu,
    jumpPage,
    queryMenus,
    jumpPageByCode,
    handleMenuMapFn
  }
})
