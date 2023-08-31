import { useProduct } from "@/store";
import { queryCommand } from "@/api/project";
import { providerEnum } from "../components/ProJect";
import { storeToRefs } from "pinia";

type CommandType = {
  id: string
  name: string
  description: string
  inputs: any[]
  output: Record<string, any>
}
export const useFunctions = () => {
  const functionOptions = ref<Draft.Function[]>([])
  const commandOptions = ref<CommandType[]>([])
  const pages = ref<Draft.Resource[]>([])
  const { data } = storeToRefs(useProduct())
  
  /**
   * 获取草稿下的所有功能和页面资源
   */
  const findFunctionsPages = (data: any[]) => {
    data.forEach((item) => {
      if (item.functions && item.functions.length) {
        functionOptions.value.push(...item.functions)
      }
      if (item.type == providerEnum.Page) {
        pages.value.push(item)
      }
      if (item.children) {
        findFunctionsPages(item.children)
      }
    })
  }
  findFunctionsPages(data.value)

  /***
   * 查询功能下的的指令
   * @param functionId 功能id
   */
  const handleFunction = async (functionId: string) => {
    const params = {
      modules: [
          {
          id: data.value?.[0].id,
          name: data.value?.[0].name,
          functions: functionOptions!.value?.filter(item => item.id === functionId)
        }
      ]
    }
    const res = await queryCommand(params)
    if(res.success) {
      commandOptions.value = res.result?.[0]?.command
    }
  }
  return {
    functionOptions,
    commandOptions,
    pages,
    handleFunction,
  }
}