import { initStore } from '@jetlinks/stores'
import { useUserStore } from '@/store/user'
import { useMenuStore } from '@/store/menu'
import { useSystemStore } from '@/store/system'
import { useAuthStore } from '@/store/auth'
import { useClassified } from '@/store/classified'

export async function initStoreBus() {
  initStore({
    UserInfoStore: useUserStore(),
    MenuStore: useMenuStore(),
    SystemStore: useSystemStore(),
    AuthStore: useAuthStore(),
    // Classified: useClassified()
  })
}
