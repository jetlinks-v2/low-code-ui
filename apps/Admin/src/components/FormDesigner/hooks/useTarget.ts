import { computed } from 'vue'

const useTarget = () => {
  const designer: any = inject('FormDesigner', {})
  
  const target = computed(() => {
    return designer.selected
  })

  return {
    target
  }
}

export default useTarget
