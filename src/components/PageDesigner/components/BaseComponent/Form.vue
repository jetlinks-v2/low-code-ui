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

const props = defineProps({
  _key: {
    type: String,
    default: ''
  },
  value: {
    type: Array,
    default: [],
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
  onMounted:{
    type: String,
    default: ''
  },
  onCreated:{
    type: String,
    default: ''
  },
  responder: {
    type: Object,
    default: () => ({})
  },
})

const formRef = ref<any>(null)
const config = computed(() => {
  return JSON.parse(props.source?.code || '{}')
})

const { isEditModel } = useTool()

const { executionMounted } = useLifeCycle(props, {}, isEditModel)

const pageProvider = usePageProvider()

onMounted(() => {
  executionMounted()
  pageProvider.addRef?.(props._key, formRef)
})

const $self = reactive({
  visible: true,
  value: props.value
})

const onValueChange = (e: any) => {
  $self.value = e
}

const handleResponderFn = ($dep?: string, $depValue?: any) => {
  if (props.responder?.responder) {
    const handleResultFn = new Function('$self', '$dep', '$depValue', props?.responder?.responder)
    handleResultFn($self, $dep, $depValue)
  }
}

usePubsub(props._key, $self, props.responder?.dependencies, handleResponderFn)

const myValue = computed(() => {
  return $self?.value || props.value
})

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

defineExpose({ onSave })
</script>
<style scoped>
.form-warp {
  padding-bottom: 18px;
}
</style>
