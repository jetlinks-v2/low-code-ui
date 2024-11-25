import { BasicLayoutPage, BlankLayoutPage, Iframe } from '@LowCode/layout'
import { shallowRef, h, defineAsyncComponent } from 'vue'

type Buttons = Array<{ id: string }>

type MenuItem = {
    icon: string,
    name: string
    code: string
    url: string
    isShow?: boolean
    buttons?: Buttons
    meta?: any
}

const hasAppID = (item: { appId?: string, url: string, options: any, code: string }): { isApp: boolean, appUrl: string, code: string } => {
    const isApp = !!item.appId || item.options?.owner
    const isLowCode = !!item.options?.LowCode

    let _code = item.url

    if (isLowCode) {
      _code = item.code
    } else if (isApp) {
      _code = `/${item.appId || item.options?.owner}${item.url}`
    }

    return {
        isApp: !!item.appId,
        appUrl: `/${item.appId}${item.url}`,
        code: _code
    }
}

const handleButtons = (buttons?: Buttons) => {
    return buttons?.map((b) => b.id) || []
}

const handleMeta = (item: MenuItem, isApp: boolean) => {
    const meta = item.meta
    return {
        ...meta,
        icon: item.icon,
        title: meta?.title || item.name,
        hideInMenu: meta?.hideInMenu ?? item.isShow === false,
        buttons: handleButtons(item.buttons),
        isApp
    }
}

const findComponents = (code: string, level: number, isApp: boolean, components: any, mate: any, hasChildren: boolean) => {
    const myComponents = components[code]
    if (level === 1) { // BasicLayoutPage

      if (myComponents && !hasChildren) {
        return mate?.hasLayout === false ? () => myComponents() : h(BasicLayoutPage, {}, () => [h(defineAsyncComponent(() => myComponents()), {})])
      }
      if (isApp && !hasChildren) {
        return h(BasicLayoutPage, {}, () => [h(Iframe, {})])
      }
      return shallowRef(BasicLayoutPage)
    } else if (level === 2) { // BlankLayoutPage or components
      return myComponents ? () => myComponents() : BlankLayoutPage
    } else if (isApp){ // iframe
      return () => Iframe
    } else if(myComponents) { // components
        return () => myComponents()
    }
    // return components['demo'] // 开发测试用
    return undefined
}

const hasExtraChildren = (item: MenuItem, extraMenus: any ) => {
    const extraItem = extraMenus[item.code]

    if (extraItem) {
        return extraItem.map(e => ({
          ...e,
          url: `${item.url}${e.url}`,
          isShow: false
        }))
    }

    return undefined
}

export const handleMenus = (menuData: any, extraMenus: any, components: any, level: number = 1) => {
    if (menuData && menuData.length) {
        return menuData.map(item => {
            const { isApp, appUrl, code } = hasAppID(item) // 是否为第三方程序
            const meta = handleMeta(item, isApp)
            const route: any = {
                path: isApp ? appUrl : `${item.url}`,
                name: isApp ? code : item.code,
                // url: isApp ? appUrl : item.url,
                meta: meta,
                children: item.children
            }

            route.component = findComponents(item.code, level, isApp, components, item.meta, !!item.chidlren?.length)

            const extraRoute = hasExtraChildren(item, extraMenus)

            if (extraRoute && !isApp) { // 包含额外的子路由
                route.children = route.children ? [...route.children, ...extraRoute] : extraRoute
            }

            if (route.children && route.children.length) {
              route.children = handleMenus(route.children, extraMenus, components, level + 1)
            }

            if (item.redirect) {
              route.redirect = item.redirect
            } else {
              const showChildren = route.children?.filter(r => !r.meta?.hideInMenu) || []

              if (route.children && route.children.length && showChildren.length) {
                route.redirect = showChildren[0].path
              }
            }

            return route
        })
    }

    return []
}

export const handleMenusMap = (menuData: any, cb: (data: any) => void) => {
  if (menuData && menuData.length) {
    menuData.forEach(item => {
      cb(item)
      if (item.children) {
        handleMenusMap(item.children, cb)
      }
    })
  }
}

const hideInMenu = (code: string) => {
  return ['account-center', 'message-subscribe'].includes(code)
}

const handleUrl = (item: any, isApp: boolean, appUrl?: string) => {
  if (isApp) {
    return appUrl
  }

}

export const handleSiderMenu = (menuData: any) => {
  if (menuData && menuData.length) {
    return menuData.filter(item => {
      if (('isShow' in item && item.isShow === false) || item.meta?.hideInMenu === true) {
        return false
      }
      return true
    }).map(item => {
      const { isApp, appUrl, code } = hasAppID(item) // 是否为第三方程序
      const meta = handleMeta(item, isApp)
      const route: any = {
        path: isApp ? appUrl : `${item.url}`,
        name: isApp ? code : item.code,
        url: isApp ? appUrl : item.url,
        meta: meta,
        children: item.children
      }

      if (route.children && route.children.length) {
        route.children = handleSiderMenu(route.children)
      }

      route.meta.hideInMenu = hideInMenu(item.code)

      return route
    })
  }
  return []
}


export const handleAuthMenu = (menuData: any, cb: (code, buttons) => void) => {
  if (menuData && menuData.length) {
    return menuData.forEach(item => {
      const { code, buttons, children} = item

      if (buttons) {
        cb(code, buttons.map(a => a.id))
      }

      if (children) {
        handleAuthMenu(children, cb)
      }
    })
  }
}

export const handleMenuInit = (menus: any[], mode?: string) => {
    return menus?.map(item => {
        if (item.code === 'process') {
            item.redirect = `${item.url}/home`
            item.children =  [
                {
                    code: 'process/home',
                    name: mode === 'tags' ? item.name : '',
                    url: item.redirect,
                },
                ...(item.children || [])
            ]

            item.meta = {
                hideChildrenInMenu: true
            }
        }
        if (item.code === 'web_ide') {
            item.code = 'center'
        }
        return item
    }) || []
}
