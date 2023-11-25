<template>
  <div>
    <j-form-item
      :validateFirst="true"
      label="css样式"
      :name="['componentProps', 'cssCode']"
    >
      <EditorBtn
        @change="onDataChange"
        v-model:value="target.componentProps.cssCode"
        text="编写css"
        language="css"
      />
    </j-form-item>
    <j-form-item
      :validateFirst="true"
      label="JS代码"
      :name="['componentProps', 'eventCode']"
    >
      <EditorBtn
        @change="onDataChange"
        v-model:value="target.componentProps.eventCode"
        text="编写代码"
        language="javascript"
      />
    </j-form-item>
    <j-form-item label="数据源" :name="['componentProps', 'request']">
      <DataSource v-model:value="target.componentProps.request" @change="onDataChange" />
    </j-form-item>
    <j-form-item
        v-if="showResponder"
        label="响应器"
        :name="['componentProps', 'responder']"
    >
      <Responder
        v-model:value="target.componentProps.responder"
        :id="target.key"
        :type="target.type"
        @change="onDataChange"
      />
    </j-form-item>

  </div>
</template>
<script lang="ts" setup>
import EditorBtn from './EditorBtn.vue'
import { useTarget } from '../../../../hooks'
import Responder from './Responder'
import DataSource from './DataSource'

const { target } = useTarget()

const emits = defineEmits(['refresh'])

const showResponder = computed(() => {
  return !['search'].includes(target.value.type)
})

const onDataChange = () => {
  console.log('refresh', target.value)
  emits('refresh', target.value)
}
</script>
