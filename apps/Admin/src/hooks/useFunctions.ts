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
    queryCommand(info.value.draftId, []).then(res => {
      commandOptions.value = res.result?.find(item => item.moduleId + '.' + item.id === functionId_)?.command || []
    })
  }
  return {
    functionOptions,
    commandOptions,
    pagesOptions,
    handleFunction,
  }
}