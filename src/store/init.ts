import { initStore } from '@jetlinks-web/stores'
import { useUserStore } from '@LowCode/store/user'
import { useMenuStore } from '@LowCode/store/menu'
import { useSystemStore } from '@LowCode/store/system'
import { useAuthStore } from '@LowCode/store/auth'

export async function initStoreBus() {
  initStore({
    UserInfoStore: useUserStore(),
    MenuStore: useMenuStore(),
    SystemStore: useSystemStore(),
    AuthStore: useAuthStore(),
    useMenuStore: useMenuStore,
  })
}
