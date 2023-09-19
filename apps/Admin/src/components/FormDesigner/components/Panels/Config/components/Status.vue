<template>
  <div>
    <j-form-item :validateFirst="true" v-if="type !== 'geo'" label="css样式" :name="['componentProps', 'cssCode']">
      <EditorBtn @change="onDataChange" v-model:value="target.componentProps.cssCode" text="编写css" language="css" />
    </j-form-item>
    <j-form-item :validateFirst="true" v-if="type !== 'geo'" label="JS代码" :name="['componentProps', 'eventCode']">
      <EditorBtn @change="onDataChange" v-model:value="target.componentProps.eventCode" text="编写代码" language="javascript" />
    </j-form-item>
    <j-form-item
      label="新增状态是否展示"
      :validateFirst="true"
      :name="['componentProps', 'visible']"
      :rules="[
        {
          required: true,
          message: '请选择',
        },
      ]"
      v-if="type !== 'root' && isShow"
    >
      <j-radio-group @change="onDataChange" v-model:value="target.componentProps.visible" button-style="solid">
        <j-radio-button :value="true">展示</j-radio-button>
        <j-radio-button :value="false">隐藏</j-radio-button>
      </j-radio-group>
    </j-form-item>
    <j-form-item
      label="编辑状态是否支持修改"
      :validateFirst="true"
      v-if="!['root', 'text'].includes(type) && isShow"
      :name="['componentProps', 'editable']"
      :rules="[
        {
          required: true,
          message: '请选择',
        },
      ]"
    >
      <j-radio-group @change="onDataChange" v-model:value="target.componentProps.editable" button-style="solid">
        <j-radio-button :value="true">支持</j-radio-button>
        <j-radio-button :value="false">不支持</j-radio-button>
      </j-radio-group>
    </j-form-item>
  </div>
</template>
<script lang="ts" setup>
import EditorBtn from './EditorBtn.vue'
import { computed, inject, unref } from 'vue'
import { useTarget } from '../../../../hooks'
import { findParentById } from '@/components/FormDesigner/utils/utils';

const designer: any = inject('FormDesigner')
const { target } = useTarget()

const emits = defineEmits(['refresh'])

const type = computed(() => {
  return target.value?.type
})

const isShow = computed(() => {
  const _item = findParentById(unref(designer.formData), unref(target))
  return !['card-item', 'tabs-item', 'collapse-item'].includes(_item?.type)
})

const onDataChange = () => {
  emits('refresh', target.value)
}
</script>