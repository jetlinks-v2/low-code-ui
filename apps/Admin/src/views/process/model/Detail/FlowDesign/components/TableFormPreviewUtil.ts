import {ISchema} from "@/components/FormDesigner/typings";

const filterKey = ['text', 'table']
const layoutKey = ['card', 'grid', 'tabs', 'collapse', 'space', 'tabs-item', 'collapse-item', 'space-item', 'grid-item']

const filter = (columns:  ISchema[]) => {
  return columns.filter(item => !filterKey.includes(item.type))
}

export const handleFormToTable = (columns: ISchema[]) => {
  let array: any = []
  filter(columns).forEach(item => {
    if (layoutKey.includes(item.type) && item.children) {
      const newArr = handleFormToTable(item.children)
      array.concat(newArr)
    } else {
      const rules = item.formItemProps.rules
      array.push({
        ...item,
        dataIndex: item.key,
        form: { rules }
      })
    }
  })

  return array
}
