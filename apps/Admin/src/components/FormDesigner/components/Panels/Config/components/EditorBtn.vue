<template>
  <div>
    <j-button type="dashed" shape="round" @click="onBtn">
      {{ text }}
    </j-button>
    <j-modal
      v-model:visible="visible"
      :title="text"
      @ok="handleOk"
      @cancel="visible = false"
    >
      <div ref="target"><j-monaco-editor v-model="_value" :language="language" /></div>
    </j-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, watch, inject } from 'vue'
import { useFocusWithin } from '@vueuse/core'

const designer: any = inject('FormDesigner')

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  value: {
    type: String,
  },
  language: {
    type: String,
    default: 'css',
  },
})

const emits = defineEmits(['update:value', 'change'])
const visible = ref<boolean>(false)
const _value = ref<string>()
const target = ref()

const { focused } = useFocusWithin(target)

watchEffect(() => {
  _value.value = props?.value //
})

const onBtn = () => {
  visible.value = true
}

const handleOk = () => {
  console.log(_value.value)
  // emits('update:value', _value.value)
  // emits('change', _value.value)
  // visible.value = false
}

watch(
  focused,
  (v) => {
    designer.focused.value = v
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>