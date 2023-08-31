import { defineStore } from 'pinia'
import { clone, cloneDeep } from 'lodash-es'

export const useAllListDataStore = defineStore('allListData', () => {
  const listData = ref<any>(new Map())
  const listDataInfo = ref<any>({})
  const oranging = reactive<any>({
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
    dataBind: {
      function: undefined,
      command: undefined,
      functionInfo: []
    },
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
    const record = listData.value.get(id)

    const configurationInfo =
      type === 'enum' ||
      type === 'string' ||
      type === 'number' ||
      type === 'date'
    if (record) {
      if (configurationInfo) {
        record.configurationInfo[type] = data
      } else {
        record[type] = data
      }
    } else {
      listDataInfo.value = cloneDeep(oranging)
      if (configurationInfo) {
        listDataInfo.value.configurationInfo[type] = data
      } else {
        listDataInfo.value[type] = data
      }
      listData.value.set(id, listDataInfo.value)
    }
  }
  /**
   * 获取信息
   * @param type
   * @returns
   */
  const getALLlistDataInfo = (id: any) => {

    const data = listData.value.get(id)

    if (data) {
      return data
    } else {
      return cloneDeep(oranging)
    }
  }

  return {
    listData,
    listDataInfo,
    setALLlistDataInfo,
    getALLlistDataInfo,
  }
})
