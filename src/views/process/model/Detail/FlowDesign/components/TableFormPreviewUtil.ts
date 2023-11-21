import {ISchema} from "@LowCode/components/FormDesigner/typings";

const filterKey = ['text', 'table']
const layoutKey = ['card', 'grid', 'tabs', 'collapse', 'space', 'tabs-item', 'card-item', 'collapse-item', 'space-item', 'grid-item']

const filter = (columns:  ISchema[]) => {
  return columns.filter(item => !filterKey.includes(item.type))
}

export const handleFormToTable = (columns: ISchema[]) => {
  console.log(columns,'--')
  let array: any = []
  filter(columns).forEach(item => {
    if (layoutKey.includes(item.type)) {
      const newArr = handleFormToTable(item.children || [])
      array = [...array, ...newArr]
      console.log(array)
    } else {
      const rules = item.formItemProps.rules
      array.push({
        ...item,
        title: item.formItemProps?.label,
        dataIndex: item.formItemProps?.name || item.key,
        form: { rules }
      })
    }
  })

  return array
}
