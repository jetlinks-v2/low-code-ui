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
import {useLifeCycle, usePubsub, useTool} from "@LowCode/components/PageDesigner/hooks";
import {computed} from "vue";
import {handleDataSourceFn} from "../../utils/utils";

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
  mountedCode:{
    type: String,
    default: ''
  },
  createdCode:{
    type: String,
    default: ''
  },
  responder: {
    type: Object,
    default: () => ({})
  },
  request: {
    type: Object,
    default: () => ({})
  }
});

const { isEditModel } = useTool()

const $self = reactive({
  visible: true,
  text: ''
})

const setVisible = (flag: boolean) => {
  if(unref(isEditModel)) return
  $self.visible = flag
}
const setText = (_val: any) => {
  if(unref(isEditModel)) return
  $self.text = _val
}

const { executionMounted } = useLifeCycle(props, {setVisible, setText}, isEditModel)

const handleResponderFn = ($dep?: string, $depValue?: any) => {
  if (props.responder?.responder) {
    const handleResultFn = new Function('$self', '$dep', '$depValue', props.responder?.responder)
    handleResultFn($self, $dep, $depValue)
  }
}

usePubsub(props._key, $self, props.responder?.dependencies, handleResponderFn)

handleDataSourceFn(props?.request || {}, unref(isEditModel)).then((_val: any) => {
  if (_val) {
    $self.text = _val
  }
})

onMounted(() => {
  executionMounted()
})
const _value = computed(() => {
  return $self?.text || props.text
})
</script>