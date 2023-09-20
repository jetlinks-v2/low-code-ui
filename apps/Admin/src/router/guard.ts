import { createAuthRoute, initRouteAssignStore } from '@jetlinks/router'
import { useUserStore } from '@/store/user'
import { useMenuStore } from '@/store/menu'
import { useSystemStore } from '@/store/system'
import { useAuthStore } from '@/store/auth'
import { setToken } from '@jetlinks/utils'

async function setupRouter() {

    initRouteAssignStore({
        UserInfoStore: useUserStore(),
        MenuStore: useMenuStore(),
        SystemStore: useSystemStore(),
        AuthStore: useAuthStore()
    })

    createAuthRoute((to) => {
      if (to.query.token) {
        setToken(to.query.token)
      }
    })
}

export { setupRouter }
