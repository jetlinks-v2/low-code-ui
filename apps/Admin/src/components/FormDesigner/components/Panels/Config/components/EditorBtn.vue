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
      <j-monaco-editor
        v-model="_value"
        :language="language"
      />
    </j-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'

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
    default: 'css'
  }
})

const emits = defineEmits(['update:value', 'change'])
const visible = ref<boolean>(false)
const _value = ref<string>()

watchEffect(() => {
  _value.value = props?.value // 
})

const onBtn = () => {
  visible.value = true
}

const handleOk = () => {
  emits('update:value', _value.value)
  emits('change', _value.value)
  visible.value = false
}
</script>