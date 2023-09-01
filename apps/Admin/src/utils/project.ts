import { providerEnum } from  '@/components/ProJect/index'
import {cloneDeep} from "lodash-es";
export const Integrate = (data: any[]) => {
  const cloneData = cloneDeep(data)
  const { children, ...project } = cloneData[0]

  const arr = handleChildren(children)

  return {
    ...project,
    modules: arr
  }
}


const handleChildren = (children: any[]) => {
  const newChildren = children.map(item => {
    if (item.type) {
      item.provider = item.type
    }
    return item
  })
  const arr: any[] = newChildren.filter(item => item.type === providerEnum.Module).map(item => {
    if (item.children?.length) {
      item.children = handleChildren(item.children)
    }
    return item
  })

  const resources = newChildren.filter(item => [providerEnum.HtmlPage, providerEnum.ListPage, providerEnum.FormPage].includes(item.type))
  const functions = newChildren.filter(item => [providerEnum.CRUD, providerEnum.SQL, providerEnum.Function].includes(item.type))

  if (resources.length) {
    arr.push({ resources })
  }

  if (functions.length) {
    arr.push({ functions })
  }

  return arr
}
