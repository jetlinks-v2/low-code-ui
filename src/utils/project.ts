import { providerEnum } from  '@LowCode/components/ProJect/index'
import { cloneDeep, omit } from "lodash-es";

export type IntegrateFilterType = { key: string, value: Array<any>}
export const Integrate = (data: any[], filter?: IntegrateFilterType) => {
  const cloneData = cloneDeep(data)
  const { children, others, ...project } = cloneData[0]

  const arr = handleChildren([{
    id: project.id,
    name: project.title,
    children: children,
    type: providerEnum.Module,
    others
  }], filter)

  return {
    ...project,
    others,
    modules: arr
  }
}

const handleModuleChildren = (data: any[], filter?: IntegrateFilterType) => {
  const resources: any[] = []
  const functions: any[] = []
  const children: any[] = []

  const filterData = filter && filter.key ? data?.filter?.(item =>  !filter.value.includes(item[filter.key])) : data
  filterData?.forEach?.((item, index) => {
    const type = item.others.type
    item.provider = item.others.type
    item.others.tree_index = index

    if ([providerEnum.HtmlPage, providerEnum.ListPage, providerEnum.FormPage].includes(type)) {
      item.provider = 'page-code'
      resources.push(omit(item, ['fullId']))
    }
    if ([providerEnum.CRUD, providerEnum.SQL, providerEnum.Function].includes(type)) {
      functions.push(omit(item, ['fullId']))
    }

    if (item.type === providerEnum.Module) {
      children.push(omit(item, ['fullId']))
    }
  })

  return {
    resources, functions, children
  }
}

const handleChildren = (data: any[], filter?: IntegrateFilterType) => {
  const modules: any[] = []
  data.forEach(item => {
    if (item.type === providerEnum.Module) {
      let extra = handleModuleChildren(item.children, filter)
      if (extra.children) {
        extra.children = handleChildren(extra.children, filter)
      }
      modules.push({
        ...item,
        ...extra
      })
    }
  })
  return modules
}
