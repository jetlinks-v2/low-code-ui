import {defineStore} from "pinia";
import {queryProjectDraft} from "@/api/project";

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
      const hasChildren = item.children?.length || item.functions?.length

      treeData.push({
        ...item,
        title: item.name,
        type: 'module',
        parentId: parentId,
        selectable: !hasChildren,
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
  return treeData
}

type TreeData = {
  title: string
  id: string
  type: 'project' | 'module' | Draft.Provider

  children?: TreeData[]
  [key: string]: any
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

  const addDataFileItem = (record: any) => {

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
    getDataMap
  }
})
