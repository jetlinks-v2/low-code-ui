<template>
  <div class="form-warp">
    <PagePreview
      :pageValue="myValue"
      :data="config"
      ref="formRef"
    />
  </div>
</template>
<script lang="ts" setup>
import PagePreview from '@LowCode/components/PageDesigner/preview.vue'
import { watch, computed, ref } from 'vue'
import { useLifeCycle } from '../../hooks/useLifeCycle';
import {usePageProvider, useTool} from '../../hooks';

const props = defineProps({
  _key: {
    type: String,
    default: ''
  },
  value: {
    type: Array,
    default: [],
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

</script>
<style scoped>
.form-warp {
  /* border: 1px solid #e6e6e6; */
  padding-bottom: 18px;
}
</style>
