<template>
  <div class="string-type">
    <p>最大长度</p>
    <j-input-number
      v-model:value="state.value"
      :min="1"
      :max="99"
      :precision="0"
      class="input"
    />
  </div>
</template>

<script lang="ts" setup>
import { useFilterModuleStore } from '@/store/filterModule'
interface Emit {
  (e: 'update:state', value: any): void
}

const emits = defineEmits<Emit>()
const configurationStore = useFilterModuleStore()
const data = configurationStore.getConfigurationInfo('string')

const state = reactive({
  value: data?.value || null,
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
.string-type {
  padding-left: 20px;
  .input {
    width: 500px;
  }
}
</style>
