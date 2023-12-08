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
    <template v-if="!types.includes(target.type)">
      <j-form-item
      label="onCreated"
      :name="['componentProps', 'onCreated']"
    >
      <LifeCycle
          v-model:value="target.componentProps.onCreated"
          :id="target.key"
          :type="target.type"
          @change="onDataChange"
      />
    </j-form-item>
    <j-form-item
        label="onMounted"
        :name="['componentProps', 'onMounted']"
    >
      <LifeCycle
          title="onMounted"
          v-model:value="target.componentProps.onMounted"
          :id="target.key"
          :type="target.type"
          @change="onDataChange"
      />
    </j-form-item>
    </template>
  </div>
</template>
<script lang="ts" setup>
import EditorBtn from './EditorBtn.vue'
import { useTarget } from '../../../../hooks'
import Responder from './Responder'
import DataSource from './DataSource'
import LifeCycle from './LifeCycle'

const { target } = useTarget()

const emits = defineEmits(['refresh'])

const types = ['text','button','dropdown','tag']

const showResponder = computed(() => {
  return !['search'].includes(target.value.type)
})

const onDataChange = () => {
  emits('refresh', target.value)
}
</script>
