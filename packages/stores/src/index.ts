import { createPinia } from 'pinia'
import type { App } from 'vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export function setupPinia(app: App) {
    app.use(pinia)
}

export * from 'pinia'

export * from './global'
