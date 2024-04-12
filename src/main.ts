import { createApp } from 'vue'
import App from './App.vue'
import { setupPinia } from '@jetlinks-web/stores'
import { initRoute } from '@jetlinks-web/router'
import { initPackages } from './package'
import { setupRouter } from '@LowCode/router/guard'
import { initStoreBus } from '@LowCode/store'
import globalComponents from '@jetlinks-web/components'
// import components from './components'
import JComponents from 'jetlinks-ui-components'
import 'ant-design-vue/dist/antd.variable.min.css'
import './style.css'
import { LOGIN_ROUTE } from '@LowCode/router/basic'

let app: any = null

async function mount() {
  app = createApp(App)

  setupPinia(app)

  await initPackages()

  const router = await initRoute({ Login: LOGIN_ROUTE })

  app.use(router)

  await initStoreBus()
  await setupRouter()

  app.use(JComponents)
  app.use(globalComponents)
  // app.use(components)

  if (process.env.NODE_ENV === 'development') { // 开启性能标记
    app.config.performance = true
  }
  router.isReady().then(() => app.mount('#app'))
}

async function unmount() {
  await app.unmount()
  app = null
}

console.log(123123123)

// 如果不在微前端环境，则直接执行mount渲染
if (window.__MICRO_APP_ENVIRONMENT__) {
  console.log(2222222)
  window[`micro-app-${window.__MICRO_APP_NAME__}`] = { mount, unmount }
} else {
  mount()
}
// 监听卸载操作
window.addEventListener('unmount', async function() {
  await unmount()
  // 卸载所有数据监听函数
  window.eventCenterForAppNameVite.clearDataListener()
  console.log('子应用已卸载')
})
