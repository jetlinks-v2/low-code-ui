<template>
  <div class="form-warp" v-if="$self.visible">
    <FormPreview
      :value="myValue"
      :mode="mode"
      :data="config"
      ref="formRef"
      :disabled="disabled"
      @stateChange="onValueChange"
    />
  </div>
</template>
<script lang="ts" setup>
import FormPreview from '@LowCode/components/FormDesigner/preview.vue'
import { computed, ref } from 'vue'
import { useLifeCycle } from '../../hooks/useLifeCycle';
import {usePageProvider, useTool, usePubsub} from '../../hooks';
import {handleDataSourceFn} from "../../utils/utils";

const props = defineProps({
  _key: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  value: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  source: {
    type: Object,
    default: () => ({}),
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

const formRef = ref<any>(null)
const config = computed(() => {
  return JSON.parse(props.source?.code || '{}')
})

const { isEditModel } = useTool()

const pageProvider = usePageProvider()

const $self = reactive({
  visible: true,
  value: undefined
})

const setVisible = (flag: boolean) => {
  if(unref(isEditModel)) return
  $self.visible = flag
}
const setValue = (_val: any) => {
  if(unref(isEditModel)) return
  $self.value = _val
}

const onSave = () => {
  return new Promise((resolve, reject) => {
    formRef.value
        ?.onSave()
        .then((_data: any) => {
          resolve(_data)
        })
        .catch((err: any) => {
          reject(err)
        })
  })
}

const { executionMounted } = useLifeCycle(props, {setVisible, onSave}, isEditModel)

const onValueChange = (e: any) => {
  $self.value = e
}

const handleResponderFn = ($dep?: string, $depValue?: any) => {
  if (props.responder?.responder) {
    const handleResultFn = new Function('$self', '$dep', '$depValue', props?.responder?.responder)
    handleResultFn($self, $dep, $depValue)
  }
}

usePubsub(props._key, $self, props.responder?.dependencies, handleResponderFn, props?.name)

handleDataSourceFn(props?.request || {}, unref(isEditModel)).then((_val: any) => {
  if (_val) {
    $self.value = _val
  }
})

onMounted(() => {
  executionMounted()
  pageProvider.addRef?.(props._key, formRef)
})

const myValue = computed(() => {
  return $self?.value || props.value
})
</script>
<style scoped>
.form-warp {
  padding-bottom: 18px;
}
</style>
