import { useRequest } from '@jetlinks/hooks'
import { providerEnum } from '@/api/process/model'

export function useClassified() {
  const map = ref<Map<string, any>>(new Map())
  const { data: classified } = useRequest(providerEnum, {
    immediate: true,
    onSuccess(res) {
      return res.result.map((item) => {
        map.value.set(item.id, item)
        return {
          label: item.text,
          value: item.id,
        }
      })
    },
  })

  const getText = (key: string) => {
    return map.value.get(key)?.text
  }
  return {
    classified,
    getText,
  }
}
