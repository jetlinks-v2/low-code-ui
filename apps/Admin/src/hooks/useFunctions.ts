import { useProduct } from "@/store";
import { queryCommand } from "@/api/project";
import { providerEnum } from "@/components/ProJect";

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
  const productStore = useProduct();
  const { data } = productStore
  
  productStore.getDataMap()?.forEach((value) => {
    if([providerEnum.Function, providerEnum.CRUD, providerEnum.SQL].includes(value.type)) {
      functionOptions.value.push(value)
    }
  })

  /***
   * 查询功能下的的指令
   * @param functionId 功能id
   */
  const handleFunction = async (functionId: string) => {
    commandOptions.value = [];
    const params = {
      modules: [
          {
          id: data?.[0].id,
          name: data?.[0].title,
          functions: [productStore.getById(functionId)]
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
    handleFunction,
  }
}