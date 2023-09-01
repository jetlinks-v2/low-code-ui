import { defineStore } from "pinia";
import { queryProjectDraft, updateDraft} from "@/api/project";
import { useEngine } from './engine'
import dayjs from 'dayjs';
import { throttle, cloneDeep, omit } from 'lodash-es'
import { Integrate } from '@/utils/project'

type TreeData = {
  title: string
  id: string
  type: 'project' | 'module' | Draft.Provider
  provider?: Draft.Provider
  children?: TreeData[]
  [key: string]: any
}

const handleChildren = (children: any[], parentId: string): TreeData[] => {
  const treeData: TreeData[] = []
  children.forEach(item => {
    const hasChildren = item.children?.length

    if (item.functions) {
      item.functions.forEach(a => {
        treeData.push({
          title: a.name,
          type: a.provider,
          parentId: parentId,
          ...a
        })
      })
    }

    if (item.resources) {
      item.resources.forEach(a => {
        treeData.push({
          title: a.name,
          type: a.provider,
          parentId: parentId,
          ...a
        })
      })
    }

    treeData.push({
      ...item,
      title: item.name,
      type: 'module',
      parentId: parentId,
      children: hasChildren ? handleChildren(item.children, item.id) : []
    })
  })

  return treeData
}

/**
 * 保存草稿
 */
const updateProductReq = throttle((data: any[]) => {
  const integrateData = Integrate(data)
  updateDraft(integrateData.draftId, integrateData)
}, 1000)

export const useProduct = defineStore('product', () => {
  const data = ref<TreeData[]>([]) // 项目
  const dataMap: Map<string, any> = new Map()
  const dataById = ref()

  const engine = useEngine()

  const handleDataMap = (data?: TreeData[]) => {
    data?.forEach?.(item => {
      const { children, ...extra } = item
      dataMap.set(item.id, extra)

      if (children?.length) {
        handleDataMap(item.children)
      }
    })
  }

  const getDataMap = () => {
    return dataMap
  }

const findParent=(data, target, result) =>{
  for (let item of data) {
    if (item.id === target.id) {
      //将查找到的目标数据加入结果数组中
      result.unshift(item)
      return true
    }
    if (item.children && item.children.length > 0) {
      //根据查找到的结果往上找父级节点
      let isFind = findParent(item.children, target, result)
      if (isFind) {
        result.unshift(item)
        return true
      }
    }
  }
  //走到这说明没找到目标
  return false
}

  const addProduct = (data: any[], record: any, parentId: string) => {
    return data.map(item => {
      if (item.id === parentId) {
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
      }
      if(item.children){
        item.children = addProduct(item.children,record,parentId)
      }
      return item
    })
  }

  const updateProduct = (data: any[], record: any) => {
    const arr= cloneDeep(data)
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
        item.children = updateProduct(item.children, record)
      }
      return item
    })
  }
  const removeProduct = (data: any[], record: any) => {
    return data.filter(item => {
      if (item.id === record.id) {
        return false
      }
      if (item.children) {
        item.children = removeProduct(item.children, record)
      }
      return true
    })
  }

  const getProduct = (data: any[], id: string) => {
    data.some(item => {
      if (item.id === id) {
        dataById.value = item
        return true
      }
      if (item.children) {
        getProduct(item.children, id)
      }
      return false
    })
    return dataById.value
  }

  const add = (record: any, parentId: string) => {
    dataMap.set(record.id, record)
    data.value = addProduct(data.value, record, parentId)
    engine.updateFile(record, 'add')
    updateProductReq(data.value)
  }

  const update = (record: any) => {
    dataMap.set(record.id, omit(record, ['children']))
    data.value = updateProduct(data.value, record)
    engine.updateFile(record, 'edit')
    updateProductReq(data.value)
  }

  const remove = (record: any) => {
    // dataMap.delete(record.id))
    data.value = removeProduct(data.value, record)
    dataMap.delete(record.id)
    engine.updateFile(record, 'del')
    updateProductReq(data.value)
  }
  //通过id查找对应节点
  const getById = (id: string) => {
    return getProduct(data.value, id)
  }

  //通过id查找所属全部父节点
  const getParent = (record)=>{
    const arr = []
    findParent(data.value,record,arr)
    return arr;
  }

  const queryProduct = async (id?: string, cb?: () => void) => {
    if (!id) return
    dataMap.clear()
    const resp = await queryProjectDraft(id)
    if (resp.success) {
      const result = resp.result
      const treeData: TreeData[] = []
      const children: TreeData[] = result.modules ? handleChildren(result.modules, result.id) : []
      treeData.push({
        version: result.version,
        draftName: result.draftName,
        draftId: result.draftId,
        id: result.id,
        title: result.name,
        type: 'project',
        children: children
      })
      handleDataMap(treeData);
      data.value = treeData
      cb?.()
    }
  }

  const initProjectState = () => {
    data.value = []
    dataMap.clear()
    dataById.value = null

    engine.initEngineState()
  }

  return {
    data,
    queryProduct,
    getDataMap,
    add,
    update,
    remove,
    getById,
    getParent,
    initProjectState
  }
},{
  persist: false
})
