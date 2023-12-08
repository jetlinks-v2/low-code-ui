<template>
  <div class="form-warp" v-if="$self.visible">
    <PagePreview
      :pageValue="myValue"
      :data="config"
      ref="pageRef"
    />
  </div>
</template>
<script lang="ts" setup>
import PagePreview from '@LowCode/components/PageDesigner/preview.vue'
import { computed, ref } from 'vue'
import { useLifeCycle } from '../../hooks/useLifeCycle';
import {usePageProvider, usePubsub, useTool} from '../../hooks';

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
  },
  responder: {
    type: Object,
    default: () => ({})
  },
})

const pageRef = ref<any>(null)
const config = computed(() => {
  return JSON.parse(props.source?.code || '{}')
})

const { isEditModel } = useTool()

const { executionMounted } = useLifeCycle(props, {}, isEditModel)

const pageProvider = usePageProvider()

const $self = reactive({
  visible: true,
  value: props.value
})

onMounted(() => {
  executionMounted()
  pageProvider.addRef?.(props._key, pageRef)
})

const handleResponderFn = ($dep?: string, $depValue?: any) => {
  if (props?.responder?.responder) {
    const handleResultFn = new Function('$self', '$dep', '$depValue', props?.responder?.responder)
    handleResultFn($self, $dep, $depValue)
  }
}

usePubsub(props._key, $self, props.responder?.dependencies, handleResponderFn)

const myValue = computed(() => {
  return $self.value || props.value
})
</script>
<style scoped>
.form-warp {
  padding-bottom: 18px;
}
</style>
