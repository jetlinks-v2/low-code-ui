import { defineStore } from 'pinia'

export const useFilterModuleStore = defineStore('filterModule', () => {
  const configurationInfo = ref<any>({
    enum: {},
    string: {},
    number: {},
    date: {},
  })

  /**
   * 设置信息
   * @param data
   */
  const setConfigurationInfo = (data: any, type: string) => {
    configurationInfo.value[type] = { ...data }
  }

  /**
   * 获取信息
   */
  const getConfigurationInfo = (type: string) => {
    return configurationInfo.value[type]
  }

  return {
    configurationInfo,
    setConfigurationInfo,
    getConfigurationInfo,
  }
})
