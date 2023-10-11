<template>
  <div class="form-warp">
    <FormPreview
      :value="myValue"
      :mode="mode"
      :data="config"
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
  // disabled: {
  //   type: Boolean,
  //   default: false,
  // },
  // data: {
  //   type: Object,
  //   default: () => ({}),
  // },
  source: {
    type: Object,
    default: () => ({}),
  }
})

const emit = defineEmits(['update:value'])

const myValue = ref(props.value)

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
    immediate: true
  }
)
</script>
<style scoped>
.form-warp {
  border: 1px solid #e6e6e6;
}
</style>
