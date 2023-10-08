<!-- 配置表单内容 -->
<template>
  <j-button type="primary" block size="small" ghost @click="visible = true">
    配置表单内容
  </j-button>
  <div v-for="(fields, index) in forms" :key="index">
    <div v-for="(field, idx) in fields">{{ field }}</div>
  </div>
  <j-modal
    v-model:visible="visible"
    width="900px"
    @ok="handleOk"
    @cancel="visible = false"
  >
    <template #title>
      <j-space>
        <span>请确认当前节点需要候选人办理的表单内容</span>
        <j-tooltip placement="right">
          <template #title>
            未提供“读”权限的表单子字段对当前节点的办理人加密展示
          </template>
          <AIcon type="QuestionCircleOutlined" />
        </j-tooltip>
      </j-space>
    </template>
    <j-row :gutter="20">
      <j-col :span="8">
        <j-input>
          <template #suffix>
            <AIcon type="SearchOutlined" />
          </template>
        </j-input>
        <j-checkbox style="margin: 5px 0">全部内容</j-checkbox>
        <div class="form-box">
          <div
            class="form-item"
            v-for="(form, index) in formList"
            :key="'form' + index"
          >
            <div class="form-title">
              <div class="name">{{ form.name }}</div>
              <div class="permission">
                <j-checkbox-group
                  v-model:value="form.accessModes"
                  :options="permissions"
                />
              </div>
            </div>
            <div
              class="form-fields"
              v-for="(field, idx) in form.configuration.schema.properties"
              :key="'field' + idx"
            >
              <div class="field-title">
                <div class="name">{{ field.title }}</div>
                <div class="permission">
                  <j-checkbox-group
                    v-model:value="field.accessModes"
                    :options="permissions"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </j-col>
      <j-col :span="16"> 表单名称 </j-col>
    </j-row>
  </j-modal>
</template>

<script setup lang="ts">
import type { TreeProps } from 'ant-design-vue'
import { queryFormNoPage_api } from '@/api/process/model'
import { useFlowStore } from '@/store/flow'

const flowStore = useFlowStore()

type Emits = {
  (e: 'update:value', data: any[]): void
}

const emits = defineEmits<Emits>()
const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
})

const visible = ref(false)
const forms = computed({
  get: () => props.value,
  set: (val) => emits('update:value', val),
})

const formList = ref([])

const permissions = ref([
  { label: '读', value: 'read' },
  { label: '写', value: 'write' },
])

/**
 * 获取所有表单字段数据, 不分页, 并根据forms渲染已经存在的字段权限
 */
const getFormList = async () => {
  const { result } = await queryFormNoPage_api({ paging: false })
  formList.value = result.map((m) => {
    const _properties = m.configuration.schema.properties
    // 已经存在的字段
    const _fields = forms.value[m.id]
    if (_fields && _fields.length) {
      Object.keys(_properties).forEach((key) => {
        const _currentField = _fields.find((f) => f.id === key)
        _properties[key]['accessModes'] = _currentField
          ? _currentField.accessModes
          : []
      })
      return { accessModes: [], ...m }
    } else {
      Object.keys(_properties).forEach((key) => {
        _properties[key]['accessModes'] = []
      })
      return { accessModes: [], ...m }
    }
  })
}
getFormList()

/**
 * 确认之后, 将数据同步至父组件的basicFormData.forms
 */
const handleOk = () => {
  formList.value.forEach((item) => {
    const _properties = item.configuration.schema.properties
    forms.value[item.id] = []
    Object.keys(_properties).forEach((key) => {
      if (_properties[key]['accessModes'].length) {
        forms.value[item.id].push({
          id: key,
          required: true,
          accessModes: _properties[key]['accessModes'],
        })
      }
    })
  })
  //   console.log('forms.value: ', forms.value)
  visible.value = false
}

watch(
  () => visible.value,
  (val) => {
    if (val) getFormList()
  },
)
</script>

<style lang="less" scoped>
.form-box {
  max-height: 500px;
  overflow: auto;
  .form-item {
    .form-title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    .form-fields {
      padding-left: 30px;
      .field-title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
