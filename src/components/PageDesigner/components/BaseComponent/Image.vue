<template>
    <j-image :width="width" :src="_value" ></j-image>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import {usePageDependencies, useTool} from "../../hooks";

const props = defineProps({
    value: {
        type: String,
        default: 'https://aliyuncdn.antdv.com/vue.png'
    },
    width: {
        type: Number,
        default: 200
    },
    responder: {
      type: Object,
      default: () => ({})
    }
})

const { dependencies } = usePageDependencies(props.responder?.dependencies)
const { isEditModel } = useTool()
const handleResponderFn = (value: any = {}) => {
  const handleResultFn = new Function('value', props.responder?.responder)
  return handleResultFn.call(this, value)
}

const _value = computed(() => {

  if (props.responder?.responder && !isEditModel.value) {
    return handleResponderFn(dependencies.value)
  }
    return props.value
})
</script>
