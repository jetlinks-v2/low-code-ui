<template>
  <span :style="style" v-if="$self.visible">{{ _value }}</span>
</template>

<script lang="ts" setup>
import {computed} from "vue"
import {useLifeCycle, usePubsub, useTool} from "../../hooks";
import {handleDataSourceFn} from "../../utils/utils";

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
})

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
