import { defineStore } from "pinia";
import { useProduct } from './product'
import dayjs from "dayjs";
import { cloneDeep } from "lodash-es";

type FileItemType = {
  id: string
  title: string
  type: string
  parentName: string
  parentId: string
  [key: string]: any
}

export const useEngine = defineStore('engine', () => {
  const files = ref<FileItemType[]>([])
  const activeFile = ref()
  const content = ref()
  const expandedKeys = ref<string[]>([])
  const openFile = ref<any>()
  const copyFile = ref<string>('')
  const product = useProduct()
  const isExpandAll = ref(false)

  const initEngineState = () => {
    activeFile.value = null
    copyFile.value = ''
    openFile.value = null
    expandedKeys.value = []
    content.value = []
    files.value = []
    isExpandAll.value = false
  }

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

  const getExpandsKeys = (id: string, type?: string) => {
    console.log(id)
    const arrSet: Set<string> = new Set([...expandedKeys.value])
    const map = product.getDataMap()

    let currentNode = map.get(id)

    if (id !== activeFile.value) { // 不是当前选中项
      openFile.value = currentNode
    }

    if (currentNode && !expandedKeys.value.includes(currentNode.parentId) && type !== 'project') { // 当前节点的parentId不在expandedKeys中
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
    isExpandAll.value = true
  }

  const packUpAll = () => {
    expandedKeys.value = []
    isExpandAll.value = false
  }

  const selectFile = (key: string, type?: string) => {
    getExpandsKeys(key, type)
  }

  /**
   * 新增打开的文件
   * @param record
   */
  const addFile = (record: FileItemType,open?:any) => {
    // console.log('------open',open)
    if(!open){
      activeFile.value = record.id
    }
    const type = record.type
    if (!files.value.some(item => item.id === record.id)) {
      const cloneRecord = cloneDeep(record)
      if (type === 'project') {
        delete cloneRecord.children
      }
      if(type!=='module'&& type!=='project'){
        files.value.unshift(cloneRecord)
      }
      // files.value.push(cloneRecord)
    }
    selectFile(record.id, type)
  }


  const updateTree = (data: any[], record: any) => {
    const arr  = cloneDeep(data)
    return arr.map(item => {
      if (item.id === record.id) {
        return { 
          ...item, 
          ...record,
          others:{
            ...item.others,
            ...record.others,
            modifyTime:dayjs().format('YYYY-MM-DD HH:mm:ss')
          }
         }
      } else if (item.children) {
        item.children = updateTree(item.children, record)
      }
      return item
    })
  }

  const addTree = (data: any[], record: any) => {
   return  data.map(item => {
      if (item.id === record.parentId) {
        const add = {
          ...record,
          others:{
            createTime:dayjs().format('YYYY-MM-DD HH:mm:ss'),
            modifyTime:dayjs().format('YYYY-MM-DD HH:mm:ss'),
            useList:[]
          },
        }
        return {
          ...item,
          children: item.children?.length ? [...item.children, add] : [add]
        }
      } else if (item.children) {
       item.children= addTree(item.children, record)
      }
      return item
    })
  }

  /**
   * 更新文件
   * @param record
   * @param type
   */
  const updateFile = (record: any, type: string,open?:any) => {
    const index = files.value.findIndex(item => item.id === record.id)

    files.value = files.value.map(item => {
      return product.getById(item.id)
    })

    if (['del', 'edit'].includes(type)) {
      if( type === 'del'){
        files.value.splice(index,1)
        activeFile.value = record.id ===activeFile.value? product.data[0].id : activeFile.value
      }else{
        files.value[index] = record
      }
    } else if (type === 'add') {
      addFile(record,open)
    }
  }

  /**
 * 复制文件
 * @param record
 */
  const setCopyFile = (record: FileItemType) => {
    copyFile.value = record.id
  }

  const setActiveFile = (v) => {
    activeFile.value = v
  }

  // watch(() => activeFile.value, () => {
  //   console.log(activeFile.value)
  // }, { immediate: true })

  return {
    files,
    activeFile,
    content,
    expandedKeys,
    openFile,
    copyFile,
    isExpandAll,
    removeFile,
    addFile,
    selectFile,
    expandedAll,
    packUpAll,
    setCopyFile,
    updateFile,
    initEngineState,
    setActiveFile
  }
})
