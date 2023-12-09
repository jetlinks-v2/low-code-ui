<template>
  <div v-if="$self.visible">
    <ErrorImage :width="width" :src="_value"></ErrorImage>
  </div>
</template>

<script lang="ts" setup>
import {computed} from "vue"
import {useLifeCycle, usePubsub, useTool} from "../../hooks";
import ErrorImage from '@LowCode/components/Image/index.vue'
import {handleDataSourceFn} from "../../utils/utils";

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
  src: ''
})

const setVisible = (flag: boolean) => {
  $self.visible = flag
}
const setSrc = (_val: any) => {
  $self.src = _val
}

const { executionMounted } = useLifeCycle(props, {setVisible, setSrc}, isEditModel)

const handleResponderFn = ($dep?: string, $depValue?: any) => {
  if (props.responder?.responder) {
    const handleResultFn = new Function('$self', '$dep', '$depValue', props.responder?.responder)
    handleResultFn($self, $dep, $depValue)
  }
}

usePubsub(props._key, $self, props.responder?.dependencies, handleResponderFn)

handleDataSourceFn(props?.request || {}, unref(isEditModel)).then((_val: any) => {
  if (_val) {
    $self.src = _val
  }
})

onMounted(() => {
  executionMounted()
})
const _value = computed(() => {
  return $self?.src || props.src
})
</script>
