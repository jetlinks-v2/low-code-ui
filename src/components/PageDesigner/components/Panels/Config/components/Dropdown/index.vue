<template>
  <div>
    <j-form-item
        :validateFirst="true"
        label="菜单点击事件"
        :name="['componentProps', 'clickCode']"
    >
      <EditorBtn
          v-model:value="target.componentProps.clickCode"
          language="javascript"
          @change="onDataChange"
          text="配置"
      />
    </j-form-item>
    <j-form-item
        :validateFirst="true"
        label="重选事件"
        :name="['componentProps', 'reloadCode']"
    >
      <EditorBtn
          v-model:value="target.componentProps.reloadCode"
          language="javascript"
          @change="onDataChange"
          text="配置"
      />
    </j-form-item>
    <j-form-item
        label="下拉菜单"
        :name="['componentProps', 'menu']"
        required
        :validateFirst="true"
    >
      <Menu
          @change="onDataChange"
          v-model:value="target.componentProps.menu"
      />
    </j-form-item>
  </div>
</template>

<script lang="ts" setup>
import {useTarget} from '@LowCode/components/PageDesigner/hooks'
import Menu from './Menu/index.vue'
import EditorBtn from "../EditorBtn.vue";

const {target} = useTarget()

const emits = defineEmits(['refresh'])
const onDataChange = () => {
  emits('refresh', target.value)
}
</script>
