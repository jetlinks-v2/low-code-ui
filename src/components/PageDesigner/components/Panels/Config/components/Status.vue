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
    <j-form-item v-if="!['search'].includes(target.type)" label="数据源" :name="['componentProps', 'request']">
      <DataSource v-model:value="target.componentProps.request" @change="onDataChange" />
    </j-form-item>
    <j-form-item
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
      <j-form-item
      label="onCreated"
      :name="['componentProps', 'createdCode']"
    >
      <LifeCycle
          v-model:value="target.componentProps.createdCode"
          :id="target.key"
          :type="target.type"
          @change="onDataChange"
      />
    </j-form-item>
    <j-form-item
        label="onMounted"
        :name="['componentProps', 'mountedCode']"
    >
      <LifeCycle
          title="onMounted"
          v-model:value="target.componentProps.mountedCode"
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
import LifeCycle from './LifeCycle'

const { target } = useTarget()

const emits = defineEmits(['refresh'])

const onDataChange = () => {
  emits('refresh', target.value)
}
</script>
