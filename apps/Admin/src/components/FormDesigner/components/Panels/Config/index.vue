<template>
  <Scrollbar>
    <div class="config-container">
      <j-form ref="formRef" :model="modelRef" layout="vertical">
        <template v-if="_type === 'root'">
          <p>表单布局</p>
          <j-form-item label="标签对齐方式" name="layout">
            <j-radio-group
              v-model:value="designer.selected.componentProps.layout"
              button-style="solid"
            >
              <j-radio-button value="horizontal">Horizontal</j-radio-button>
              <j-radio-button value="vertical">Vertical</j-radio-button>
              <j-radio-button value="inline">Inline</j-radio-button>
            </j-radio-group>
          </j-form-item>
        </template>
        <template v-else>
          <p>页面搭建</p>
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
                v-bind="{ type: _type, value: designer.selected }"
              />
            </j-collapse-panel>
          </j-collapse>
        </template>
      </j-form>
    </div>
  </Scrollbar>
</template>
  
<script lang="ts" setup>
import { useFormDesignerStore } from '@/store/designer'
import { ref, reactive, unref, computed } from 'vue'
import { Scrollbar } from 'jetlinks-ui-components'
import Base from './components/Base.vue'
import InputLimit from './components/InputLimit.vue'
import Check from './components/Check.vue'
import Descriptions from './components/Descriptions.vue'
import Event from './components/Event.vue'
import Status from './components/Status.vue'
import Source from './components/Source.vue'
import { map } from 'lodash-es'

const designer = useFormDesignerStore()
const formRef = ref<any>()
const modelRef = reactive({ ...designer.selected })

const _type = computed(() => {
  return designer.selected?.type || ''
})

const Panels = {
  Base,
  InputLimit,
  Check,
  Descriptions,
  Event,
  Status,
  Source,
}

const panelsList = computed(() => {
  const arr: any[] = []
  arr.push({
    key: 'Base',
    header: '基础信息',
  })
  if (['input', 'textarea', 'input-password'].includes(unref(_type))) {
    arr.push({
      key: 'InputLimit',
      header: '输入限制',
    })
  }
  if (['input', 'textarea', 'input-password'].includes(unref(_type))) {
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
    ['input', 'textarea', 'select-card', 'input-password', 'switch'].includes(
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
      'text',
      'input',
      'textarea',
      'select-card',
      'input-password',
      'switch',
    ].includes(unref(_type))
  ) {
    arr.push({
      key: 'Event',
      header: '交互事件',
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
  console.log(designer.selected)
  Object.assign(modelRef, designer.selected)
})

const onChange = (value: any) => {
  if (designer.selected?.context?.updateProps) {
    designer.selected?.context?.updateProps(value)
  }
}
</script>

<style lang="less" scoped>
.config-container {
  height: 100%;
}
</style>