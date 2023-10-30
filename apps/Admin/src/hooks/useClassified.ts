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
          label: item.value,
          value: item.id,
        }
      })
    },
  })

  const getText = (key: string | undefined) => {
    return map.value.get(key)?.value
  }
  return {
    classified,
    getText,
  }
}
