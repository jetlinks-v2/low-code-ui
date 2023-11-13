import { onBeforeMount, onMounted} from 'vue'
import type { Ref } from 'vue'


type SelectionFn = {
  insertNode: (node: HTMLElement) => void
  handlePointerup: () => void
  status: Ref<boolean>
}

export const useSelection = (El: Ref<HTMLDivElement>): SelectionFn => {
  let selection:Selection | null = null
  let range: Range | undefined = undefined
  const status = ref<boolean>(false)

  const insertNode = (node) => {
    if (node && range) {
      range?.deleteContents() // 删除选取
      range?.insertNode(node)
      range?.setStartAfter(node)
    }
  }

  const handlePointerup = () => {
    selection = getSelection()
    range = selection?.getRangeAt(0)
    status.value = true
  }

  const bindEventListener = () => {
    El.value?.addEventListener('pointerup', handlePointerup);
  }

  const removeEventListener = () => {
    El.value?.removeEventListener('pointerup', handlePointerup);
  }


  onMounted(() => {
    bindEventListener()
  })

  onBeforeMount(() => {
    removeEventListener()
  })

  return {
    status,
    insertNode,
    handlePointerup
  }
}
