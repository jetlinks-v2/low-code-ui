<template>
  <div class="number-type">
    <p>最大值</p>
    <j-input-number
      v-model:value="state.max"
      class="input"
      :precision="0"
      :min="state.min"
      :max="9999"
      :step="1"
    />
    <p class="tips">最小值</p>
    <j-input-number
      v-model:value="state.min"
      class="input"
      :precision="0"
      :max="state.max"
      :step="1"
    />
  </div>
</template>

<script lang="ts" setup>
interface Emit {
  (e: 'update:state', value: any): void
}
const props = defineProps({
  id: {
    type: null,
  },
  data: {
    type: Object,
    default: () => {},
  },
})
const emits = defineEmits<Emit>()
const data = props.data?.config || null

const state = reactive({
  max: data?.max || null,
  min: data?.min || null,
})

watch(
  () => state,
  () => {
    emits('update:state', state)
  },
  { immediate: true, deep: true },
)
</script>

<style scoped lang="less">
.number-type {
  padding-left: 20px;
  .tips {
    padding-top: 20px;
  }
  .input {
    width: 500px;
  }
}
</style>
