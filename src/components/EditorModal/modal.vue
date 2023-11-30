<template>
  <j-modal
    visible
    :title="title"
    :height="height || 500"
    :width="width || 600"
    @ok="save"
    @cancel="cancel"
    :maskClosable="false"
  >
    <div :style="{height: height + 'px'}">
      <j-monaco-editor
        v-model="myValue"
        :language="language"
        @errorChange="errorChange"
      />
    </div>
  </j-modal>
</template>

<script setup name="EditorModal">
import { onlyMessage } from '@jetlinks-web/utils';
import { defaultProps } from './data'

const props = defineProps({
  ...defaultProps()
})

const emit = defineEmits(['save', 'cancel'])

const myValue = ref(props.value)

const title = computed(()=>props.language==='javascript'?'交互事件':'样式配置')

const errorMessage = ref([])
const errorChange = (v) => {
  console.log(v);
  errorMessage.value = v
}
const cancel = () => {
  emit('cancel')
}

const save = () => {
  if(errorMessage.value.length){
    onlyMessage('代码存在错误', 'error')
    return
  }
  emit('save', myValue.value)
}

</script>

<style scoped>
</style>
