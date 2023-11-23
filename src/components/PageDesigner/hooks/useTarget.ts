import { computed } from 'vue'

const useTarget = () => {
  const designer: any = inject('PageDesigner', {})
  
  const target = computed(() => {
    return designer.selected.value?.[0]
  })

  return {
    target
  }
}

export default useTarget
