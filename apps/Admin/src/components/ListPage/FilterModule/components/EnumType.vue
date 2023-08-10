<template>
  <div class="enum-type">
    <p>配置数据来源</p>
    <j-radio-group v-model:value="state.value" button-style="solid">
      <j-space size="large">
        <j-radio-button value="data" class="check-btn">
          数据字典
        </j-radio-button>
        <j-radio-button value="rearEnd" class="check-btn">
          后端能力
        </j-radio-button>
      </j-space>
    </j-radio-group>
    <div v-if="state.value === 'data'">
      <p class="tips">数据字典</p>
      <j-select
        style="width: 200px"
        v-model:value="state.dataValue"
        showSearch
        :options="dataOptions"
      />
    </div>
    <div v-else>
      <p class="tips">能力配置</p>
      <j-space size="large">
        <!--后端能力列表-->
        <j-select
          style="width: 200px"
          v-model:value="state.abilityValue"
          showSearch
          :options="abilityOptions"
        />
        <!--选中功能类型为SQL/函数时，下拉框后方展示指令下拉框-->
        <j-select
          v-if="
            state.abilityValue === 'SQL' || state.abilityValue === 'function'
          "
          style="width: 200px"
          v-model:value="state.instructValue"
          showSearch
          :options="instructOptions"
        />
      </j-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useConfigurationStore } from '@/store/filterModule'
const state = reactive({
  value:'data',
  dataValue: '',
  abilityValue: '',
  instructValue: '',
})
const configurationStore = useConfigurationStore()
const dataOptions = ref([])
const abilityOptions = ref([])
const instructOptions = ref([])

watch(
  () => state,
  () => {
    configurationStore.setConfigurationInfo(state, 'enum')
  },
  { immediate: true,deep:true },
)
</script>

<style scoped lang="less">
.enum-type {
  padding-left: 20px;
  .check-btn {
    width: 200px;
    text-align: center;
  }
  .tips {
    padding-top: 15px;
  }
}
</style>
