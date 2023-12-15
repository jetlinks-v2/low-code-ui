<template>
  <div class="ciae-warp">
    <div class="header">
      <j-button type="primary">整体配置</j-button>
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
          <j-input v-model:value="record.key" @change="() => { valueChange(record.key);}" />
        </template>
        <template #text="{record, valueChange}">
          <j-input v-model:value="record.text" @change="() => { valueChange(record.text);}" />
        </template>
        <template #type="{record, valueChange}">
          <j-select v-model:value="record.type" :options="typeOptions" @change="() => { valueChange(record.type);}" />
        </template>
        <template #command="{record}">
          <SettingConfig v-model:value="record.command" />
        </template>
<!--        <template #action="{record}">-->
<!--          <j-button>+</j-button>-->
<!--        </template>-->
      </QuickEditTable>
    </div>
  </div>
</template>

<script setup name="CIAE">
import { regular } from "@jetlinks-web/utils";
import { upperCase } from "@LowCode/utils/comm";
import { typeOptions } from './util'
import SettingConfig from './settingConfig.vue'
import { QuickEditTable } from '../../index'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
})

const dataSource = ref([])
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

          if (typesOptions.value.some(item =>
              item.javaType === upperCase(value) ||
              item.javaType === (value.charAt(0).toUpperCase() + value.slice(1))
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
    width: 150,
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 100
  }
]
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
  }

}
</style>
