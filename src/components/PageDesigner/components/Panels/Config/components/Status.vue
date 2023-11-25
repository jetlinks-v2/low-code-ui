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
    <j-form-item
        label="响应器"
        :name="['componentProps', 'responder']"
    >
      <Responder
        v-model:value="target.componentProps.responder"
      />
    </j-form-item>
  </div>
</template>
<script lang="ts" setup>
import EditorBtn from './EditorBtn.vue'
import { useTarget } from '../../../../hooks'
import Responder from './Responder'

const { target } = useTarget()

const emits = defineEmits(['refresh'])

const showDataSource = computed(() => {

})

const onDataChange = () => {
  emits('refresh', target.value)
}
</script>
