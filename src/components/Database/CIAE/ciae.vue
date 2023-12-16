<template>
  <div class="ciae-warp" ref="warpRef">
    <div class="header">
      <j-button type="primary" @click="allSettingData.visible = true">整体配置</j-button>
      <j-button type="primary" @click="validate">校验</j-button>
    </div>
    <div style="height: calc(100% - 60px)">
      <QuickEditTable
          serial
          validate
          ref="tableRef"
          :data="dataSource"
          :columns="myColumns"
          :height="500"
          :scroll="{x: 1600, y: 500}"
      >
        <template #key="{record, valueChange}">
          <j-input v-model:value="record.key" @change="() => { valueChange(record.key); updateProject()}" />
        </template>
        <template #text="{record, valueChange}">
          <j-input v-model:value="record.text" @change="() => { valueChange(record.text); updateProject()}" />
        </template>
        <template #type="{record, valueChange}">
          <j-select v-model:value="record.type" :options="typeOptions" style="width: 100%" @change="() => { valueChange(record.type); updateProject()}" />
        </template>
        <template #command="{record}">
          <SettingConfig v-model:value="record.command" :id="data.id" :warp="warpRef" />
        </template>
        <template #action="{record, index}">
          <j-space>
            <PermissionButton
                type="link"
                class="action-btn"
                :hasPermission="true"
                :tooltip="{ title: '新增'}"
                @click="() => add(index)"
            >
              <AIcon type="PlusCircleOutlined"/>
            </PermissionButton>
            <PermissionButton
                type="link"
                class="action-btn"
                :hasPermission="true"
                :tooltip="{ title: '复制'}"
                @click="() => copy(record, index)"
            >
              <AIcon type="CopyOutlined"/>
            </PermissionButton>
            <PermissionButton
                danger
                type="link"
                class="action-btn"
                placement="topRight"
                :hasPermission="true"
                :tooltip="{ title: '删除'}"
                :popConfirm="{
                title: '确认删除？',
                onConfirm: () => deleteFn(index)
              }"
            >
              <AIcon type="DeleteOutlined"/>
            </PermissionButton>
          </j-space>
        </template>
        <template #empty>
          <j-button type="dashed" @click="() => add(0)" style="width: 100%;margin-top: 12px;">
            <template #icon>
              <AIcon type="PlusCircleOutlined"/>
            </template>
            新增
          </j-button>
        </template>
      </QuickEditTable>
    </div>
    <CheckSpin :spinning="loading" />
    <AllSetting
      v-if="allSettingData.visible"
      :value="allSettingData.data"
      :warp="warpRef"
      @save="allSettingSave"
      @cancel="allSettingData.visible = false"
    />
  </div>
</template>

<script setup name="CIAE">
import { regular } from "@jetlinks-web/utils";
import { upperCase } from "@LowCode/utils/comm";
import { typeOptions } from './util'
import SettingConfig from './settingConfig.vue'
import { QuickEditTable } from '../../index'
import {cloneDeep, omit, debounce} from "lodash-es";
import AllSetting from "./AllSetting.vue";
import { useProduct } from "@LowCode/store/product";
import { defineExpose } from 'vue'
import { CheckSpin } from '@LowCode/components'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
})

const tableRef = ref()
const project = useProduct()
const dataSource = ref(props.data?.headers || [])
const warpRef = ref()
const loading = ref(false)

const allSettingData = reactive({
  data: {
    importCommand: props.data?.importCommand,
    exportCommand: props.data?.exportCommand,
    fileName: props.data?.fileName,
  },
  visible: false
})


const myColumns = [
  {
    title: 'key',
    dataIndex: 'key',
    tooltip: '蛇形命名',
    form: {
      rules: {
        asyncValidator: (rule, value, callback, source) => {
          if (!value) {
            return Promise.reject('请输入列名')
          }

          if (!regular.isModalReg(value)) {
            return Promise.reject('请以小写字母开头，使用字母、数字和下划线完成命名')
          }

          if (typeOptions.some(item =>
              item.type === upperCase(value) ||
              item.type === (value.charAt(0).toUpperCase() + value.slice(1))
          )) {
            return Promise.reject('不能与保留字重名')
          }

          const someName = dataSource.value.filter(item => item.index !== source.record.index).some(item => item.name === value)

          if (someName) {
            return Promise.reject('有重复列名')
          }
          return Promise.resolve()
        }
      }
    }
  },
  {
    title: 'name',
    dataIndex: 'text',
    ellipsis: true,
    form: {
      rules: {
        asyncValidator: (rule, value) => {
          if (!value) {
            return Promise.reject('请输入name')
          }
          return Promise.resolve()
        }
      }
    }
  },
  {
    title: '数据类型',
    dataIndex: 'type',
    width: 150,
    form: {
      rules: {
        asyncValidator: (rule, value) => {
          if (!value) {
            return Promise.reject('请选择数据类型')
          }
          return Promise.resolve()
        }
      }
    }
  },
  {
    title: '下拉配置',
    dataIndex: 'command',
    tooltip: '开启后，导入/导出文件时该列可以选用的数据将以下拉框形式展示',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 200
  }
]

const updateProject = debounce(() => {
  const obj = {
    ...props.data,
    headers: dataSource.value?.map(record => omit(record, ['index', '_quick_id', 'offsetTop'])) || [],
    ...allSettingData.data
  }
  project.update(obj)
}, 300)

const updateDataSource = (record, index) => {
  const _record = omit(record, ['index', '_quick_id', 'offsetTop'])
  dataSource.value.splice(index, 0, _record)
  updateProject()
}

const add = (index) => {
  const record = {
    key: undefined,
    text: undefined,
    type: undefined,
    command: undefined
  }
  updateDataSource(record, index)
  updateProject()
}

const copy = (record, index) => {
  const cloneRecord = cloneDeep(record)
  if (cloneRecord.key) {
    cloneRecord.key = `copy_${cloneRecord.key}`
  }

  updateDataSource(cloneRecord, index)
  updateProject()
}

const deleteFn = (index) => {
  dataSource.value.splice(index - 1, 1)
  updateProject()
}


const allSettingSave = (data) => {
  allSettingData.data = data
  allSettingData.visible = false
  updateProject()
}

const validate = () => {
  return new Promise(async (resolve, reject) => {
    loading.value = true

    try {
      tableRef.value.validates()
    } catch (e) {
      reject(e)
    }
    loading.value = false
  })
}

defineExpose({
  validate: validate
})

</script>

<style scoped lang="less">
.ciae-warp {
  height: 100%;
  padding: 24px;

  :deep(.quick-table-warp) {
    height: 100%;
  }

  .header {
    padding-bottom: 16px;
    display: flex;
    justify-content: space-between;
  }

}
</style>
