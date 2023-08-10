import { log } from 'console';
import { defineStore } from 'pinia'

export const useConfigurationStore = defineStore('configuration', () => {
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
    console.log(data,11111);

    configurationInfo.value[type] = { ...data }
    console.log(configurationInfo.value);
    
  }

  /**
   * 获取信息
   */
  const getConfigurationInfo = (type: string) => {
    console.log(configurationInfo.value[type]);
    return configurationInfo.value[type]
  }

  return {
    configurationInfo,
    setConfigurationInfo,
    getConfigurationInfo,
  }
})
