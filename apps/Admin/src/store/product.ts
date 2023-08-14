import {defineStore} from "pinia";
import {queryProjectDraft} from "@/api/project";

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
  const treeData:TreeData[] = []

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

  const addProduct = (data: any[], record: any, parentId: string) => {
    data.some(item => {
      if (item.id === parentId) {
        item.children = item.children?.length ? [...item.children, record] : [record]
        return true
      } else if (item.children) {
        addProduct(item.children, record, parentId)
      }
      return false
    })
  }

  const add = (record: any, parentId: string) => {
    dataMap.set(record.id, record)
    addProduct(data.value, record, parentId)
  }

  const update = (record: any) => {

  }

  const remove = (record: any) => {

  }

  const queryProduct = async (id?: string) => {
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
    }
  }

  return {
    data,
    queryProduct,
    getDataMap,
    add
  }
})
