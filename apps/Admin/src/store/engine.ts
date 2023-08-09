import {defineStore} from "pinia";

type FileItemType = {
  id: string
  title: string
  type: string
}

export const useEngine = defineStore('engine', () => {
  const files = ref<FileItemType[]>([])
  const activeFile = ref()
  const content = ref()

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

  /**
   * 新增打开的文件
   * @param key
   */
  const addFile = (record) => {
    activeFile.value = record.id
    if (!files.value.some(item => item.id === record)) {
      files.value.push(record)
    }
  }

  watch(() => activeFile.value, () => {
    console.log(activeFile.value)
  }, { immediate: true })

  return {
    files,
    activeFile,
    content,
    removeFile
  }
})
