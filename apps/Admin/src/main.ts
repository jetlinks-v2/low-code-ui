import { createApp } from 'vue'
import App from './App.vue'
import { setupPinia } from '@jetlinks/stores'
import { initRoute } from '@jetlinks/router'
import { initPackages } from './package'
import { setupRouter } from '@/router/guard'
import { initStoreBus } from '@/store'
import globalComponents from '@jetlinks/components'
import components from './components'
import JComponents from 'jetlinks-ui-components'
import 'jetlinks-ui-components/es/style.js'
import 'ant-design-vue/dist/antd.variable.min.css'
import './style.css'

(async () => {
    const app = createApp(App)

    setupPinia(app)

    await initPackages()

    const router = initRoute()

    app.use(router)

    await initStoreBus()
    await setupRouter()

    app.use(JComponents)
    app.use(globalComponents)
    app.use(components)

    if (process.env.NODE_ENV === "development") { // 开启性能标记
      app.config.performance = true;
    }
    app.mount('#app')
})()
