import { defineStore } from "pinia";
import { queryProjectDraft, updateDraft} from "@/api/project";
import { useEngine } from './engine'
import dayjs from 'dayjs';
import {throttle, cloneDeep, omit, result} from 'lodash-es'
import { Integrate } from '@/utils/project'
import { providerEnum } from  '@/components/ProJect/index'
import { filterTreeNodes } from '@jetlinks/utils'

type TreeData = {
  title: string
  id: string
  type: 'project' | 'module' | Draft.Provider
  provider?: Draft.Provider
  children?: TreeData[]
  [key: string]: any
}

const handleChildren = (children: any, parentId: string): TreeData[] => {
  const treeData: TreeData[] = []

  if (children.children) {
    children.children.forEach(item => {
      const hasChildren = item.children?.length || item.functions?.length || item.resources?.length
      const others = Object.assign(item.others || {}, { type: item.provider })
      treeData.push({
        ...item,
        others,
        title: item.name,
        type: providerEnum.Module,
        parentId: parentId,
        children: hasChildren ? handleChildren(item, item.id) : []
      })
    })
  }

  if (children.functions) {
    children.functions.forEach(item => {
      const type = item.others?.type || item.provider
      const others = Object.assign(item.others || {}, { type })
      treeData.push({
        ...item,
        others,
        type,
        title: item.name,
        parentId: parentId,
      })
    })
  }

  if (children.resources) {
    children.resources.forEach(item => {
      const type = item.others?.type || item.provider
      const others = Object.assign(item.others || {}, { type })
      treeData.push({
        ...item,
        others,
        type,
        title: item.name,
        parentId: parentId,
      })
    })
  }
  return treeData
}

/**
 * 保存草稿
 */
const updateProductReq = throttle((draftData: any[], cb) => {
  const integrateData = Integrate(draftData)
  updateDraft(integrateData.draftId, integrateData).then(resp => {
    if (resp.success) {
      const { children, ...oldProject } = data.value
      cb?.({
        ...resp.result,
        ...oldProject
      })
    }
  })
}, 1000)

export const useProduct = defineStore('product', () => {
  const data = ref<TreeData[]>([]) // 项目
  const dataMap: Map<string, any> = new Map()
  const dataById = ref()
  const info = ref()
  const published = ref(false)
  let dataCache = '[]'

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

  const getDataMap = (): Map<string, any> => {
    return dataMap
  }

  const getDataMapByType = (type: string) => {
    return [...dataMap.values()].filter(item => item.others?.type === type)
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
            ...record.others,
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

  /**
   * 更新缓存
   */
  const updateDataCache = () => {
    dataCache = JSON.stringify(data.value)
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

  /**
   * 将后端结构转换为前端需要的数据结构
   * @param result
   * @param isActive
   */
  const handleProjectData = (result, isActive?: boolean) => {
    const {modules, ...extra } = result
    const treeData: TreeData[] = []
    const children: TreeData[] = modules?.[0] ? handleChildren(modules[0], extra.id) : []
    treeData.push({
      ...extra,
      title: extra.name,
      type: 'project',
      children: children,
      others: modules ? modules[0]?.others : {}
    })
    handleDataMap(treeData);
    data.value = treeData
    updateDataCache()
    if (isActive) {
      engine.setActiveFile(treeData[0]?.id)
    }
    info.value = extra
    published.value = extra.state?.value === 'published'
  }

  const add = (record: any, parentId: string,open?:any) => {
    dataMap.set(record.id, record)
    data.value = addProduct(data.value, record, parentId)
    updateDataCache()
    engine.updateFile(record,'add',open)
    updateProductReq(data.value, (result) => {
      handleProjectData(result)
    })
  }

  const update = (record: any) => {
    // console.log('item---',record)
    dataMap.set(record.id, omit(record, ['children']))
    data.value = updateProduct(data.value, record)
    updateDataCache()
    engine.updateFile(record, 'edit')
    updateProductReq(data.value, (result) => {
      handleProjectData(result)
    })
  }

  const remove = (record: any) => {
    // dataMap.delete(record.id))
    data.value = removeProduct(data.value, record)
    dataMap.delete(record.id)
    updateDataCache()
    engine.updateFile(record, 'del')
    updateProductReq(data.value, (result) => {
      handleProjectData(result)
    })
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
  
  //通过名称搜索
  const filterTree = (name) =>{
    data.value = name ? filterTreeNodes(JSON.parse(dataCache), name, 'title') : JSON.parse(dataCache)
    engine.expandedAll()
  }

  const getServerModulesData = async () => {
    const integrateData = Integrate(data.value)
    return integrateData?.modules || []
  }

  const queryProduct = async (id?: string, cb?: () => void) => {
    if (!id) return
    dataMap.clear()
    const resp = await queryProjectDraft(id)
    if (resp.success) {
      handleProjectData(resp.result, true)
      cb?.()
    }
  }

  const initProjectState = () => {
    data.value = []
    dataMap.clear()
    dataById.value = null
    info.value = null
    engine.initEngineState()
  }

  return {
    data,
    info,
    queryProduct,
    getDataMap,
    getDataMapByType,
    add,
    update,
    remove,
    getById,
    getParent,
    initProjectState,
    getServerModulesData,
    published,
    filterTree
  }
})
