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
        :field-names="{ label: 'name', value: 'id' }"
      >
      </j-select>
    </div>
    <div v-else>
      <p class="tips">能力配置</p>
      <j-space size="large">
        <!--后端能力列表-->
        <j-select
          style="width: 200px"
          v-model:value="state.abilityValue"
          showSearch
        >
          <j-select-option
            v-for="item in functionOptions"
            :key="item.fullId"
            :value="item.fullId"
          >
            <img :src="getImages(item.type)" class="options-img">
            {{ item.title }}
          </j-select-option>
        </j-select>
        <!--选中功能类型为SQL/函数时，下拉框后方展示指令下拉框-->
        <j-select
          style="width: 200px"
          v-model:value="state.instructValue"
          showSearch
          :options="commandOptions"
          :field-names="{ label: 'name', value: 'id' }"
        />
      </j-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useFunctions } from '@/hooks/useFunctions'
import { queryDictionary } from '@/api/form'
import { useImages } from '../../hooks/useImages';
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

const { functionOptions, commandOptions, handleFunction } = useFunctions()
const { getImages } = useImages()
const emits = defineEmits<Emit>()
const data = props.data?.config || null

const state = reactive({
  value: data?.value || 'data',
  dataValue: data?.dataValue || '',
  abilityValue: data?.abilityValue || '',
  instructValue: data?.instructValue || '',
})
const dataOptions = ref([])

/**查询数据字典列表 */
const queryData = () => {
  queryDictionary().then((res) => {
    dataOptions.value = res.result
  })
}
queryData()

watch(
  () => state.abilityValue,
  () => {
    handleFunction(state.abilityValue)
  },
  { immediate: true },
)

watch(
  () => state,
  () => {
    emits('update:state', state)
  },
  { immediate: true, deep: true },
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
