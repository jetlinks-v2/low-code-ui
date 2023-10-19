<template>
  <div>
    <j-button type="dashed" shape="round" @click="onBtn">
      {{ text }}
    </j-button>
    <j-modal
      v-model:visible="visible"
      :title="text"
      @ok="handleOk"
      @cancel="handleCancel"
      :maskClosable="false"
      destroyOnClose
    >
      <div ref="target" style="height: 300px;">
        <j-monaco-editor
          @errorChange="onErrorChange"
          v-model="_value"
          :language="language"
        />
      </div>
    </j-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, watch, inject } from 'vue'
import { useFocusWithin } from '@vueuse/core'
import { onlyMessage } from '@jetlinks/utils'

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
const _error = ref<any[]>([])

const { focused } = useFocusWithin(target)

watchEffect(() => {
  _value.value = props?.value //
})

const onBtn = () => {
  visible.value = true
}

const onErrorChange = (error: any[]) => {
  _error.value = error
}

const handleOk = () => {
  if (!_error.value?.length) {
    emits('update:value', _value.value)
    emits('change', _value.value)
    visible.value = false
  } else {
    onlyMessage('代码有误，请检查','error')
  }
}

const handleCancel = () => {
  visible.value = false
  _value.value = props.value
}

watch(
  focused,
  (v) => {
    if(designer) {
      designer.focused.value = v
    }
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>