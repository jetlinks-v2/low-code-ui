<template>
  <div v-if="$self.visible">
    <j-tag v-bind="omit(props, ['closeIcon', 'icon'])">
      <template v-if="icon" #icon><AIcon :type="icon" /></template>
      <template v-if="icon" #closeIcon><AIcon :type="closeIcon" /></template>
      {{ _value }}
    </j-tag>
  </div>
</template>

<script lang="ts" setup>
import { omit } from "lodash-es";
import {usePubsub} from "@LowCode/components/PageDesigner/hooks";
import {computed} from "vue";

const props = defineProps({
  _key: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: "",
  },
  closable: {
    type: Boolean,
    default: false,
  },
  closeIcon: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  responder: {
    type: Object,
    default: () => ({})
  }
});

const $self = reactive({
  visible: true,
  text: props.text
})

const handleResponderFn = ($dep?: string, $depValue?: any) => {
  if (props.responder?.responder) {
    const handleResultFn = new Function('$self', '$dep', '$depValue', props?.responder?.responder)
    handleResultFn($self, $dep, $depValue)
  }
}

usePubsub(props._key, $self, props.responder?.dependencies, handleResponderFn)

const _value = computed(() => {
  return $self?.text || props.text
})
</script>