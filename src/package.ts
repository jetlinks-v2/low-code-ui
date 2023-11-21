import { h } from 'vue'
import {initRequest, initWebSocket} from '@jetlinks-web/core'
import { getToken } from '@jetlinks-web/utils'
import { TOKEN_KEY, BASE_API } from '@jetlinks-web/constants'
import { Modal } from 'jetlinks-ui-components'

// const LicenseModal = () => {
//   Modal.error({
//     key: 'License',
//     title: 'License已到期或者错误',
//     content: h(
//       'a',
//       {
//         onClick: () => {
//           Modal.destroyAll?.()
//           window.location.href = '/#/init-license'
//         },
//       },
//       '请更新License',
//     ),
//   })
// }

/**
 * 初始化package
 */
export const initPackages = async () => {
  // 初始化axios,获取环境变量中的代理标识
  const _initRequest = async () => {
    initRequest(() => ({
      errorHandler(error) { // 自定义请求错误处理
        // if (error.response) {
        //   const { data } = error.response.data as any
        //   if (data?.code === 'license required') {
        //     LicenseModal()
        //   }
        // }
      },
      exit() {
        window.parent.postMessage({ token: 'LOSE' }, '*')
      }
    }))
  }

  /**
   * 初始化websocket
   */
  const initWs = async () => {
    const token = getToken()
    const protocol = document.location.protocol.replace('http', 'ws')
    const host = document.location.host
    const url = `${protocol}//${host}${BASE_API}/messaging/${token}?:${TOKEN_KEY}=${token}`

    await initWebSocket(url)
  }

  await Promise.all([_initRequest(), initWs()])
}
