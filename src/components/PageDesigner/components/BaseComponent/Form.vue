<template>
  <div class="form-warp">
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
import { watch, computed, ref, inject } from 'vue'
import { useLifeCycle } from '../../hooks/useLifeCycle';
import {usePageProvider, useTool} from '../../hooks';

const designer: any = inject('PageDesigner')
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
  }
})

const emit = defineEmits(['update:value', 'change'])

const myValue = ref(props.value)
const formRef = ref<any>(null)
const config = computed(() => {
  return JSON.parse(props.source?.code || '{}')
})

const { isEditModel } = useTool()

const { executionMounted } = useLifeCycle(props, {}, isEditModel)

const pageProvider = usePageProvider()

const onValueChange = (e) => {
  emit('update:value', e)
  emit('change', e)
}

watch(
  () => props.value,
  (newVal) => {
    myValue.value = newVal
  },
  {
    deep: true,
    immediate: true,
  },
)

onMounted(() => {
  executionMounted()
  pageProvider.addSlot?.(props._key, formRef)
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
  /* border: 1px solid #e6e6e6; */
  padding-bottom: 18px;
}
</style>
