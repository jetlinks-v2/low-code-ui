import { useProduct } from "@/store";
import { queryCommand } from "@/api/project";

type CommandType = {
  id: string
  name: string
  description: string
  inputs: any[]
  output: Record<string, any>
}
export const useFunctions = () => {
  const functionOptions = ref<any[]>([])
  const functionId = ref<string>('')
  const commandOptions = computed<CommandType[]>(() => {
    return functionOptions.value.find(item => item.id === functionId.value)?.command || []
  })
  const productStore = useProduct();
  const { info } = productStore
  queryCommand(info.draftId, []).then(res => {
    res.result?.forEach(item => {
      const other = productStore.getById(item.id);
      functionOptions.value.push({
        ...item,
        ...other
      })
    })
  })
  
  /***
   * 查询功能下的的指令
   * @param functionId 功能id
   */
  const handleFunction = (functionId_: string) => {
    functionId.value = functionId_;
  }
  return {
    functionOptions,
    commandOptions,
    handleFunction,
  }
}