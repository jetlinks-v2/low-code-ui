import { defineStore } from "pinia";
import {addDraft, queryProjectDraft, updateDraft,deleteDraft,moveDraft} from "@LowCode/api/project";
import { useEngine } from './engine'
import dayjs from 'dayjs';
import {throttle, cloneDeep, omit, debounce} from 'lodash-es'
import {Integrate, IntegrateFilterType} from '@LowCode/utils/project'
import { providerEnum } from  '@LowCode/components/ProJect/index'
import { filterTreeNodes } from '@jetlinks-web/utils'

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
  return treeData.sort((a,b) => a.others.tree_index - b.others.tree_index)
}

/**
 * 保存草稿
 */
// const updateProductReq = debounce((draftData: any[], cb) => {
//   const integrateData = Integrate(draftData)
//   console.log('updateProductReq', new Date().getTime(),draftData)
//   updateDraft(integrateData.draftId, integrateData).then(resp => {
//     if (resp.success) {
//       const { children, ...oldProject } = draftData[0]
//       cb?.({
//         ...resp.result,
//         ...oldProject
//       })
//     }
//   })
// }, 100)
export const useProduct = defineStore('product', () => {
  const data = ref<TreeData[]>([]) // 项目
  const dataMap: Map<string, any> = new Map()
  const dataById = ref()
  const info = ref()
  const published = ref(false)
  let dataCache = '[]'

  const engine = useEngine()

  const handleDataProvider = (item: any) => {
    const type = item.others.type
    item.provider = item.others.type
    // item.others.tree_index = index

    if ([providerEnum.HtmlPage, providerEnum.ListPage, providerEnum.FormPage,providerEnum.PageDesign].includes(type)) {
      item.provider = 'page-code'
    }

    return item
  }


  const updateProductReq = debounce((record, cb) => {
    const _record = handleDataProvider(record)
    updateDraft(info.value.draftId || info.value.id,getType(record.type) , record.id, _record).then(resp=>{
      if(resp.success){
        cb?.(resp.result)
      }
    })
  }, 100)


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
      if (item.id === target?.id) {
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
            useList:[],
            ...record.others,
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
      id: modules?.[0]?.id || extra.id,
      title: modules?.[0]?.name || extra.name,
      type: 'project',
      children: children,
      // others: extra.others
    })
    handleDataMap(treeData);
    data.value = treeData
    updateDataCache()
    if (isActive) {
      engine.setActiveFile(treeData[0]?.id)
    }
    info.value = {
      ...extra,
      draftId: extra.draftId || extra.id,
      id: modules?.[0]?.id || extra.id,
      title: modules?.[0]?.name || extra.name,
      others: modules ? modules[0]?.others : {}
    }
    published.value = extra.state?.value === 'published'

  }
//获取后端type
  const getType = (type:string)=>{
    const modules = [providerEnum.Module,'project']
    const functions = [providerEnum.CRUD,providerEnum.Function,providerEnum.SQL]
    const resources = [providerEnum.FormPage,providerEnum.HtmlPage,providerEnum.Page,providerEnum.PageDesign]
    if(modules.includes(type)){
      return 'modules'
    }else if(functions.includes(type)){
      return 'functions'
    }else if(resources.includes(type)){
      return 'resources'
    }else{
      return 'extensions'
    }
  }

  const add = (record: any, parentId: string,open?:any) => {
    dataMap.set(record.id, record)
    data.value = addProduct(data.value, record, parentId)
    const _record = handleDataProvider(record)
    addDraft(info.value.draftId,getType(record.others.type || record.type) , _record, parentId ? { moduleId: parentId } : {})
    updateDataCache()
    engine.updateFile(record,'add',open)
    // updateProductReq(record, (result) => {
    //   handleProjectData(result)
    // })
  }

  const update = async (record: any, cb?: Function) => {
    // debugger;
    dataMap.set(record.id, omit(record, ['children']))
    data.value = updateProduct(data.value, record)
    updateDataCache()
    engine.updateFile(record, 'edit')

    updateProductReq(omit(record, ['children']), (result) => {
      handleProjectData(result,false)
      cb?.()
    })
  }

  const remove = (record: any) => {
    // dataMap.delete(record.id))
    data.value = removeProduct(data.value, record)
    dataMap.delete(record.id)
    updateDataCache()
    engine.updateFile(record, 'del')
    deleteDraft(info.value.draftId,getType(record.type),record.id)
    // updateProductReq(record, (result) => {
    //   handleProjectData(result)
    // })
  }

  const move = (record:any,parentId:string,index:number)=>{
    updateDataCache()
    moveDraft(info.value.draftId,getType(record.type), record.id, { moduleId: parentId,index: index})
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

  const getServerModulesData = async (filter?: IntegrateFilterType) => {
    const integrateData = Integrate(data.value, filter)
    return integrateData?.modules || []
  }

  const queryProduct = async (id?: string, cb?: () => void) => {
    if (!id) return
    dataMap.clear()
    initProjectState()
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
    move,
    getById,
    getParent,
    initProjectState,
    getServerModulesData,
    published,
    filterTree
  }
})

