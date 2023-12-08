<template>
  <span :style="style" v-if="$self.visible">{{ _value }}</span>
</template>

<script lang="ts" setup>
import {computed} from "vue"
import {usePubsub} from "../../hooks";

const props = defineProps({
  _key: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  },
  style: {
    type: Object,
    default: () => ({})
  },
  responder: {
    type: Object,
    default: () => ({})
  }
})

const $self = reactive({
  visible: true,
  text: props.text
})

const handleResponderFn = ($dep?: string, $depValue?: any) => {
  if (props.responder?.responder) {
    const handleResultFn = new Function('$self', '$dep', '$depValue', props.responder?.responder)
    handleResultFn($self, $dep, $depValue)
  }
}

usePubsub(props._key, $self, props.responder?.dependencies, handleResponderFn)

const _value = computed(() => {
  return $self?.text || props.text
})
</script>
