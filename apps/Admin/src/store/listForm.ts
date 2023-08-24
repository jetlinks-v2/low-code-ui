import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash-es'

export const useAllListDataStore = defineStore('allListData', () => {
  const listData = ref<any>([])
  const listDataInfo = ref<any>({})
  const oranging = reactive<any>({
    id: '',
    listFormInfo: {
      customIcon: '',
      dynamicIcon: '',
      field2Titel: '',
      field3Titel: '',
      field1: '',
      field2: '',
      field3: '',
      emphasisField: '',
      specialStyle: `{
      "error": "",
      "offline": "",
      "warning": "#13c2c2"
    }`,
    },
    showType: {
      type: 'list',
      configured: ['list'],
      configurationShow: false,
      defaultForm: 'list',
    },
    pagingData: [
      { pageSize: 12 },
      { pageSize: 24 },
      { pageSize: 48 },
      { pageSize: 96 },
    ],
    listDataInfo: {},
    datasource: [],
    searchData: [],
    configurationInfo: {
      enum: {},
      string: {},
      number: {},
      date: {},
    },
    addButton: [],//表头按钮
    actionsButton: [],//row操作按钮
  })
  /**
   * 设置信息
   * @param data
   * @param type
   */
  const setALLlistDataInfo = (type: string, data: any, id: string) => {
    const index = listData.value.findIndex((item: any) => item.id === id)
    console.log(index)

    const configurationInfo =
      type === 'enum' ||
      type === 'string' ||
      type === 'number' ||
      type === 'date'
    if (index !== -1) {
      if (configurationInfo) {
        listData.value[index].configurationInfo[type] = data
      } else {
        listData.value[index][type] = data
      }
    } else {
      listDataInfo.value = { ...oranging }
      if (configurationInfo) {
        listDataInfo.value.configurationInfo[type] = data
      } else {
        listDataInfo.value[type] = data
      }
      listDataInfo.value.id = id
      listData.value.push(listDataInfo.value)
    }
  }
  /**
   * 获取信息
   * @param type
   * @returns
   */
  const getALLlistDataInfo = (id: any) => {
    console.log(id)

    const data = listData.value.find((item: any) => item.id === id)
    console.log(data)

    if (data) {
      return data
    } else {
      return cloneDeep(oranging)
    }
  }

  return {
    setALLlistDataInfo,
    getALLlistDataInfo,
  }
})
