<template>
  <div class="string-type">
    <p>最大长度</p>
    <j-input v-model:value="state.value" maxlength="225" class="input"/>
  </div>
</template>

<script lang="ts" setup>
import { useConfigurationStore } from '@/store/filterModule'
const state = reactive({
  value: '',
})
const configurationStore = useConfigurationStore()

watch(
  () => state,
  () => {
    configurationStore.setConfigurationInfo(state, 'string')
  },
  { immediate: true, deep: true },
)
</script>

<style scoped lang="less">
.string-type {
  padding-left: 20px;
  .input{
    width: 500px
  }
}
</style>
