import {createAuthRoute, initRouteAssignStore} from '@jetlinks-web/router'
import type { RouteLocationNormalized } from '@jetlinks-web/router'
import { useUserStore } from '@LowCode/store/user'
import { useMenuStore } from '@LowCode/store/menu'
import { useSystemStore } from '@LowCode/store/system'
import { useAuthStore } from '@LowCode/store/auth'
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
