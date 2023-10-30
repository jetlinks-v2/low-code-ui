import { useProduct } from "@/store";
import { queryCommand } from "@/api/project";
import { storeToRefs } from "pinia";
import { providerEnum } from "@/components/ProJect";

type CommandType = {
  id: string
  name: string
  description: string
  inputs: any[]
  output: Record<string, any>
}
export const useFunctions = () => {
  const functionOptions = ref<any[]>([])
  const commandOptions = ref<CommandType[]>()
  const pagesOptions = ref<any[]>([])
  const productStore = useProduct();
  const { data, info } = storeToRefs(productStore)
  watch(() => JSON.stringify(data.value), () => {
    const maps = [...productStore.getDataMap().values()]
    const newFunction = maps.filter(item => {
      return [providerEnum.CRUD, providerEnum.Function, providerEnum.SQL].includes(item.type)
    })
    const newPages = maps.filter(item => {
      return [providerEnum.FormPage, providerEnum.HtmlPage].includes(item.type)
    })
    if(JSON.stringify(newPages) !== JSON.stringify(pagesOptions.value)) {
      pagesOptions.value = newPages.map(item => {
        return {
          ...item,
          ...productStore.getById(item.id)
        }
      })
    }
    if(JSON.stringify(newFunction) !== JSON.stringify(functionOptions.value)) {
      functionOptions.value = newFunction.map(item => {
        return {
          ...item,
          ...productStore.getById(item.id)
        }
      })
    }
  }, { immediate: true })
  /***
   * 查询功能下的的指令
   * @param functionId 功能id
   */
  const handleFunction = (functionId_: string) => {
    console.log(functionId_);
    queryCommand(info.value.draftId, []).then(res => {
      commandOptions.value = res.result?.find(item => functionId_.includes(item.id))?.command || []
    })
  }

  const commandSourceTree = computed(() => {
    return (command: string) => {
      const _item = commandOptions.value?.find(
        (item) => item.id === command,
      )
      const arr: any[] = []
      if (_item?.output && _item?.output?.properties?.length) {
        arr.push({
          label: '输出',
          value: 'output',
          disabled: true,
          children: getArray(_item?.output?.properties || [], 'output'),
        })
      }
      return arr
    }
  })

  const getArray = (arr: any[], parentId: string) => {
    return (arr || []).map((i) => {
      let children: any[] = []
      if (i.valueType.type === 'array') {
        children = getArray(i.valueType?.elementType?.properties || [], i.id)
      }
      if (i.valueType.type === 'object') {
        children = getArray(i.valueType?.properties || [], i.id)
      }
      return {
        ...i,
        parentId,
        label: `${i.id}${i?.name ? '(' + i?.name + ')' : ''}`,
        value: `${i.id}_${parentId}`,
        disabled: children.length !== 0,
        children,
      }
    })
  }

  const findItem = (arr: any[], value: string) => {
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index]
      if (element.value === value) {
        return element
      }
      let _value = undefined
      if (element.children?.length) {
        _value = findItem(element.children, value)
      }
      if (_value) {
        return _value
      }
    }
  }
  
  return {
    functionOptions,
    commandOptions,
    pagesOptions,
    commandSourceTree,
    info,
    handleFunction,
  }
}