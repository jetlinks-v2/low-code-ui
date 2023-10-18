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
import FormPreview from '@/components/FormDesigner/preview.vue'
import { watch, computed, ref } from 'vue'

const props = defineProps({
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
})

const emit = defineEmits(['update:value'])

const myValue = ref(props.value)
const formRef = ref<any>(null)
const config = computed(() => {
  return JSON.parse(props.source?.code || '{}')
})

const onValueChange = (e) => {
  emit('update:value', e)
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

const onSave = () => {
  return new Promise((resolve, reject) => {
    formRef.value
      ?.onSave()
      .then((_data) => {
        resolve(_data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

defineExpose({ onSave })
</script>
<style scoped>
.form-warp {
  border: 1px solid #e6e6e6;
}
</style>
