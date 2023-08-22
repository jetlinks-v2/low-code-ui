<template>
  <Scrollbar>
    <div class="config-container">
      <p>页面搭建</p>
      <j-form ref="formRef" :model="modelRef" layout="vertical">
        <j-collapse
          v-model:activeKey="activeKey"
          :expand-icon-position="'right'"
        >
          <j-collapse-panel
            v-for="item in panelsList"
            :key="item.key"
            :header="item.header"
          >
            <component
              @change="onChange"
              :is="Panels[item.key]"
              v-bind="{ type: _type, value: modelRef }"
            />
          </j-collapse-panel>
        </j-collapse>
      </j-form>
    </div>
  </Scrollbar>
</template>
  
<script lang="ts" setup>
import { ref, reactive, unref, computed, inject, watchEffect } from 'vue'
import { Scrollbar } from 'jetlinks-ui-components'
import Base from './components/Base.vue'
import InputLimit from './components/InputLimit.vue'
import Check from './components/Check.vue'
import Descriptions from './components/Descriptions.vue'
import Event from './components/Event.vue'
import Status from './components/Status.vue'
import Source from './components/Source.vue'
import Form from './components/Form.vue'
import { map } from 'lodash-es'

const designer: any = inject('FormDesigner')
const formRef = ref<any>()
const modelRef = reactive({ ...unref(designer.selected) })

const _type = computed(() => {
  return designer.selected?.value?.type || 'root'
})

const Panels = {
  Base,
  InputLimit,
  Check,
  Descriptions,
  Event,
  Status,
  Source,
  Form,
}

const panelsList = computed(() => {
  const arr: any[] = []
  if(['root'].includes(unref(_type))) {
    arr.push({
      key: 'Form',
      header: '表单样式',
    })
  }
  if (!['root'].includes(unref(_type))) {
    arr.push({
      key: 'Base',
      header: '基础信息',
    })
  }
  if (['input', 'textarea', 'input-password', 'input-number'].includes(unref(_type))) {
    arr.push({
      key: 'InputLimit',
      header: '输入限制',
    })
  }
  if (['input', 'textarea', 'input-password', 'input-number'].includes(unref(_type))) {
    arr.push({
      key: 'Check',
      header: '失焦校验',
    })
  }
  if (['select-card'].includes(unref(_type))) {
    arr.push({
      key: 'Source',
      header: '数据来源',
    })
  }
  if (
    ['input', 'textarea', 'select-card', 'input-password', 'switch', 'input-number', 'tree-select'].includes(
      unref(_type),
    )
  ) {
    arr.push({
      key: 'Descriptions',
      header: '说明',
    })
  }
  if (
    [
      'root',
      'text',
      'input',
      'textarea',
      'select-card',
      'input-password',
      'switch',
      'input-number',
      'tree-select'
    ].includes(unref(_type))
  ) {
    arr.push({
      key: 'Event',
      header: '整体配置',
    })
  }
  if (
    [
      'text',
      'input',
      'textarea',
      'select-card',
      'input-password',
      'switch',
      'input-number',
      'tree-select'
    ].includes(unref(_type))
  ) {
    arr.push({
      key: 'Status',
      header: '状态配置',
    })
  }

  return [...arr]
})

const activeKey = ref<string[]>(map(panelsList.value, 'key'))

watchEffect(() => {
  Object.assign(modelRef, unref(designer.selected))
})

const onChange = (value: any) => {
  if (designer.selected?.value?.context?.updateProps) {
    designer.selected?.value?.context?.updateProps(value)
  }
}

const onSave = () => {
  formRef.value
      .validateFields()
      .then((values) => {
        console.log('Received values of form: ', values)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
}

defineExpose({ onSave })
</script>

<style lang="less" scoped>
.config-container {
  height: 100%;
  margin-top: 10px;
}
</style>