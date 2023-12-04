<template>
  <div>
    <j-form-item
        :validateFirst="true"
        v-if="!['geo', 'device', 'product', 'org', 'user', 'role'].includes(type)"
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
        v-if="!['geo', 'device', 'product', 'org', 'user', 'role'].includes(type)"
        label="JS代码"
        :name="['componentProps', 'eventCode']"
    >
      <EditorBtn
          @change="onDataChange"
          v-model:value="target.componentProps.eventCode"
          text="编写代码"
          language="javascript"
          tip="function (value, refs)"
      />
    </j-form-item>
    <template v-if="!['root'].includes(type)">
      <j-form-item
          label="onMounted事件"
          :validateFirst="true"
          :name="['componentProps', 'mountedCode']"
      >
        <EditorBtn
            @change="onDataChange"
            v-model:value="target.componentProps.mountedCode"
            text="编写代码"
            language="javascript"
            tip="function (refs)"
        />
      </j-form-item>
    </template>
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
      <CheckButton
          :options="[
          { label: '展示', value: true },
          { label: '隐藏', value: false },
        ]"
          @change="onDataChange"
          v-model:value="target.componentProps.visible"
      />
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
      <CheckButton
          :options="[
          { label: '支持', value: true },
          { label: '不支持', value: false },
        ]"
          @change="onDataChange"
          v-model:value="target.componentProps.editable"
      />
    </j-form-item>
  </div>
</template>
<script lang="ts" setup>
import EditorBtn from './EditorBtn.vue'
import {computed, inject, unref} from 'vue'
import {useTarget} from '../../../../hooks'
import {findParentById} from '@LowCode/components/FormDesigner/utils/utils'
import {CheckButton} from '@LowCode/components/index'

const designer: any = inject('FormDesigner')
const {target} = useTarget()

const emits = defineEmits(['refresh'])

const type = computed(() => {
  return target.value?.type
})

const isShow = computed(() => {
  const _item = findParentById(unref(designer.formData), unref(target))
  return !['card-item', 'tabs-item', 'collapse-item'].includes(_item?.type) && designer?.type === 'low-code'
})

const onDataChange = () => {
  emits('refresh', target.value)
}
</script>
