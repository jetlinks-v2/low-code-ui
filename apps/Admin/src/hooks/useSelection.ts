import { onBeforeMount, onMounted} from 'vue'
import type { Ref } from 'vue'


type SelectionFn = {
  insertNode: (node: HTMLElement) => void
}

export const useSelection = (El: Ref<HTMLDivElement>): SelectionFn => {
  let selection:Selection | null = null
  let range: Range | undefined = undefined

  const insertNode = (node) => {
    if (node && range) {
      range?.deleteContents() // 删除选取
      range?.insertNode(node)
      range?.setStartAfter(node)
    }
  }

  const handlePointerup = (e) => {
    selection = getSelection()
    range = selection?.getRangeAt(0)
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
    insertNode
  }
}
