import {createAuthRoute, initRouteAssignStore} from '@jetlinks-web/router'
import type { RouteLocationNormalized } from '@jetlinks-web/router'
import { useUserStore } from '@/store/user'
import { useMenuStore } from '@/store/menu'
import { useSystemStore } from '@/store/system'
import { useAuthStore } from '@/store/auth'
import { setToken } from '@jetlinks-web/utils'
import {isString} from "lodash-es";

async function setupRouter() {

    initRouteAssignStore({
        UserInfoStore: useUserStore(),
        MenuStore: useMenuStore(),
        SystemStore: useSystemStore(),
        AuthStore: useAuthStore()
    })

    createAuthRoute((to: RouteLocationNormalized) => {
      if (isString(to.query.token) && to.query.token) {
        setToken(to.query.token)
      }
    })
}

export { setupRouter }
