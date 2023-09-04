import { providerEnum } from  '@/components/ProJect/index'
import { cloneDeep, omit } from "lodash-es";
export const Integrate = (data: any[]) => {
  const cloneData = cloneDeep(data)
  const { children, ...project } = cloneData[0]

  const arr = handleChildren([{
    id: project.id,
    name: project.title,
    children: children,
    type: providerEnum.Module,
  }])

  return {
    ...project,
    modules: arr
  }
}

const handleModuleChildren = (data: any[]) => {
  const resources: any[] = []
  const functions: any[] = []
  const children: any[] = []

  data?.forEach?.(item => {
    const type = item.others.type
    item.provider = item.others.type
    console.log(item)
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

const handleChildren = (data: any[]) => {
  const modules: any[] = []
  data.forEach(item => {
    console.log(item)
    if (item.type === providerEnum.Module) {
      let extra = handleModuleChildren(item.children)
      if (extra.children) {
        extra.children = handleChildren(extra.children)
      }
      modules.push({
        ...item,
        ...extra
      })
    }
  })
  console.log(modules)
  return modules
}
