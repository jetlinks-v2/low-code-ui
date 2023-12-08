<template>
  <ErrorImage :width="width" :src="_value"></ErrorImage>
</template>

<script lang="ts" setup>
import {computed} from "vue"
import {usePubsub} from "../../hooks";
import ErrorImage from '@LowCode/components/Image/index.vue'

const props = defineProps({
  _key: {
    type: String,
    default: ''
  },
  src: {
    type: String,
  },
  width: {
    type: Number,
    default: 80
  },
  responder: {
    type: Object,
    default: () => ({})
  },
})

const $self = reactive({
  visible: true,
  src: props.src
})

const handleResponderFn = ($dep?: string, $depValue?: any) => {
  if (props.responder?.responder) {
    const handleResultFn = new Function('$self', '$dep', '$depValue', props?.responder?.responder)
    handleResultFn($self, $dep, $depValue)
  }
}

usePubsub(props._key, $self, props.responder?.dependencies, handleResponderFn)

const _value = computed(() => {
  return $self?.src || props.src
})
</script>
