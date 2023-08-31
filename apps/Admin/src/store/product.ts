import { defineStore } from "pinia";
import { queryProjectDraft } from "@/api/project";
import { useEngine } from './engine'
import dayjs from 'dayjs';

type TreeData = {
  title: string
  id: string
  type: 'project' | 'module' | Draft.Provider
  provider?: Draft.Provider
  children?: TreeData[]
  [key: string]: any
}


const handleModules = (modules: Draft.Module[]) => {

}

const handleFunctions = (functions: Draft.Function[]) => {

}

const handleResources = (resources: Draft.Resource[]) => {

}

const handleChildren = (children: Draft.Module, parentId: string): TreeData[] => {
  const treeData: TreeData[] = []

  if (children.children) {
    children.children.forEach(item => {
      const hasChildren = item.children?.length || item.functions?.length || item.resources?.length

      treeData.push({
        ...item,
        title: item.name,
        type: 'module',
        parentId: parentId,
        children: hasChildren ? handleChildren(item, item.id) : []
      })
    })
  }

  if (children.functions) {
    children.functions.forEach(item => {
      treeData.push({
        title: item.name,
        type: item.provider,
        parentId: parentId,
        ...item
      })
    })
  }

  if (children.resources) {
    children.resources.forEach(item => {
      treeData.push({
        title: item.name,
        type: item.provider,
        parentId: parentId,
        ...item
      })
    })
  }
  return treeData
}

export const useProduct = defineStore('product', () => {
  const data = ref<TreeData[]>([]) // 项目
  const dataMap: Map<string, any> = new Map()
  const engine = useEngine()
  const dataById = ref()

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
    return data.map(item => {
      if (item.id === record.id) {
        return { 
          ...item, 
          ...record,
          others:{
            ...item.others,
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
    console.log('add----', data.value)
  }

  const update = (record: any,) => {
    dataMap.set(record.id, record)
    data.value = updateProduct(data.value, record)
    engine.updateFile(record, 'edit')
  }

  const remove = (record: any) => {
    // dataMap.delete(record.id))
    data.value = removeProduct(data.value, record)
    dataMap.delete(record.id)
    engine.updateFile(record, 'del')
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
      const firstModule = result.modules?.[0]
      if (firstModule) {
        const treeData: TreeData[] = []
        const children: TreeData[] = handleChildren(firstModule, firstModule.id)
        treeData.push({
          ...firstModule,
          id: firstModule.id,
          title: firstModule.name,
          type: 'project',
          selectable: false,
          children: children
        })
        handleDataMap(treeData);
        data.value = treeData
      } else {
        data.value = []
      }
      cb?.()
    }
  }

  return {
    data,
    queryProduct,
    getDataMap,
    add,
    update,
    remove,
    getById,
    getParent
  }
})
