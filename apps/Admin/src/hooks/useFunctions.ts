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
  const productStore = useProduct();
  const { data, info } = storeToRefs(productStore)
  watch(() => JSON.stringify(data.value), () => {
    const newFunction = [...productStore.getDataMap().values()].filter(item => {
      return [providerEnum.CRUD, providerEnum.Function, providerEnum.SQL].includes(item.type)
    })
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
    handleFunction,
  }
}