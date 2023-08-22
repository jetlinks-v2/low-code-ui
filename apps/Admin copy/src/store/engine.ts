import {defineStore} from "pinia";
import { useProduct } from './product'

type FileItemType = {
  id: string
  title: string
  type: string
  parentName: string
  parentId: string
}

export const useEngine = defineStore('engine', () => {
  const files = ref<FileItemType[]>([])
  const activeFile = ref()
  const content = ref()
  const expandedKeys = ref<string[]>([])
  const openFile = ref<any>()

  const product = useProduct()

  /**
   * 当前选中的文件
   * @param key
   */
  const handleActiveKey = (key) => {
    const arr = [...files.value]
    const index = arr.findIndex(item => item.id === key)

    if (key !== activeFile.value) return

    if (arr.length > 1) {
      const _index = index === 0 ? 1 : index - 1 // 是否为第一个
      activeFile.value = arr[_index].id
    } else { // 只有一个pane时
      activeFile.value = ''
    }
  }

  /**
   * 删除打开的文件
   * @param key
   */
  const removeFile = (key) => {
    const arr = [...files.value]
    handleActiveKey(key)
    files.value = arr.filter(item => item.id !== key)
  }

  const getExpandsKeys = (id: string) => {
    const arrSet: Set<string> = new Set([...expandedKeys.value])
    const map = product.getDataMap()

    let currentNode = map.get(id)

    if (id !== activeFile.value) { // 不是当前选中项
      openFile.value = currentNode
    }

    if (currentNode && !expandedKeys.value.includes(currentNode.parentId)) { // 当前节点的parentId不在expandedKeys中
      while (currentNode) {
        if (!arrSet.has(currentNode.id)) {
          arrSet.add(currentNode.id)
        }
        const parentId = currentNode.parentId
        currentNode = map.get(parentId)
      }

      expandedKeys.value = [...arrSet.values()]
    }
  }

  const expandedAll = () => {
    const map = product.getDataMap()
    expandedKeys.value = [...map.keys()]
  }

  const packUpAll = () => {
    expandedKeys.value = []
  }

  const selectFile = (key: string) => {
    getExpandsKeys(key)
  }

  /**
   * 新增打开的文件
   * @param record
   */
  const addFile = (record: FileItemType) => {
    activeFile.value = record.id

    if (!files.value.some(item => item.id === record.id)) {
      files.value.push(record)
    }

    selectFile(record.id)
  }

  watch(() => activeFile.value, () => {
    console.log(activeFile.value)
  }, { immediate: true })

  return {
    files,
    activeFile,
    content,
    expandedKeys,
    openFile,
    removeFile,
    addFile,
    selectFile,
    expandedAll,
    packUpAll
  }
})
