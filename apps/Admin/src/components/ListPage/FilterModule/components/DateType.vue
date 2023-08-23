<template>
  <div class="date-type">
    <p>精度</p>
    <j-select
      style="width: 200px"
      v-model:value="state.accuracy"
      showSearch
      :options="options"
    />
    <p class="tips">默认值</p>
    <j-radio-group v-model:value="state.defaultValue" button-style="solid">
      <j-space size="large">
        <j-radio-button value="not" class="check-btn"> 无 </j-radio-button>
        <j-radio-button value="time" class="check-btn">
          系统当前时间
        </j-radio-button>
      </j-space>
    </j-radio-group>
  </div>
</template>

<script lang="ts" setup>
import { useFilterModuleStore } from '@/store/filterModule'
interface Emit {
  (e: 'update:state', value: any): void
}

const emits = defineEmits<Emit>()
const configurationStore = useFilterModuleStore()
const data = configurationStore.getConfigurationInfo('date')
const state = reactive({
  accuracy:data?.accuracy || 'year',
  defaultValue:data?.defaultValue || 'not',
})
const options = [
  { value: 'year', label: '年-月-日' },
  { value: 'hour', label: '时-分-秒' },
]

watch(
  () => state,
  () => {
    emits('update:state', state)
  },
  { immediate: true, deep: true },
)
</script>

<style scoped lang="less">
.date-type {
  padding-left: 20px;
  .check-btn {
    width: 200px;
    text-align: center;
  }
}
</style>
