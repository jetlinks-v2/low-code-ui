<template>
  <div class="enum-type">
    <j-form layout="vertical">
      <j-form-item label="配置数据来源">
        <j-radio-group v-model:value="state.value" button-style="solid" @change="handleChangeType">
          <j-space size="large">
            <j-radio-button value="data" class="check-btn">
              数据字典
            </j-radio-button>
            <j-radio-button value="rearEnd" class="check-btn">
              后端能力
            </j-radio-button>
          </j-space>
        </j-radio-group>
      </j-form-item>
      <j-form-item v-if="state.value === 'data'" label="数据字典" required>
        <j-row>
          <j-col :span="10">
            <ErrorItem
              :error-data="errorData('dataValue' + props.data._sortIndex)"
            >
              <a-select
                style="width: 100%"
                v-model:value="state.dataValue"
                showSearch
                allowClear
                :options="dataOptions"
                optionFilterProp="label"
              >
              </a-select>
            </ErrorItem>
          </j-col>
        </j-row>
      </j-form-item>
      <j-form-item
        v-else-if="state.value === 'rearEnd'"
        label="能力配置"
        required
      >
        <j-space size="large" style="align-items: start">
          <!--后端能力列表-->
          <ErrorItem
            :error-data="errorData('abilityValue' + props.data._sortIndex)"
          >
            <a-select
              style="width: 200px"
              v-model:value="state.abilityValue"
              showSearch
              allowClear
              optionFilterProp="title"
              placeholder="请选择"
              @change="state.instructValue = state.output = null"
            >
              <a-select-option
                v-for="item in functionOptions"
                :key="item.fullId"
                :value="item.fullId"
                :title="item.title"
              >
                <img :src="getImages(item.type)" class="options-img" />
                {{ item.title }}
              </a-select-option>
            </a-select>
          </ErrorItem>
          <!--选中功能类型为SQL/函数时，下拉框后方展示指令下拉框-->
          <ErrorItem
            :error-data="errorData('instructValue' + props.data._sortIndex)"
          >
            <a-select
              style="width: 200px"
              v-model:value="state.instructValue"
              optionFilterProp="name"
              showSearch
              allowClear
              placeholder="请选择"
              :options="commandOptions"
              :field-names="{ label: 'name', value: 'id' }"
              @change="state.output = null"
            />
          </ErrorItem>
        </j-space>
        <j-row style="margin-top: 16px;">
            <j-col :span="21">
              <j-form-item>
                <ErrorItem :error-data="errorData('output' + props.data._sortIndex)">
                <j-tree-select
                  showSearch
                  placeholder="请选择"
                  v-model:value="state.output"
                  :treeData="commandSourceTree(state.instructValue)"
                  :treeDefaultExpandedKeys="['output', 'inputs']"
                  :treeCheckStrictly="false"
                  @select="handleChangeData"
                />
              </ErrorItem>
              </j-form-item>
            </j-col>
          </j-row>
      </j-form-item>
    </j-form>
  </div>
</template>

<script lang="ts" setup>
import { useFunctions } from '@LowCode/hooks/useFunctions'
import { queryDictionary } from '@LowCode/api/form'
import { useImages } from '../../hooks/useImages'
import { ErrorItem } from '../..'
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
  //校验错误
  errorList: {
    type: Array,
    default: () => [],
  },
})

const { functionOptions, commandOptions, commandSourceTree, handleFunction } = useFunctions()
const errorData = computed(() => {
  return (val: string): any => {
    return props.errorList?.find((item: any) => item.childKey === val)
  }
})
const { getImages } = useImages()
const emits = defineEmits<Emit>()
const data = props.data?.config || null

const state = reactive({
  value: data?.value || null,
  dataValue: data?.dataValue || null,
  abilityValue: data?.abilityValue || null,
  instructValue: data?.instructValue || null,
  output: data?.output || null,
  outputKey: data?.outputKey || null,
})
const dataOptions = ref([])

const handleChangeData = (selectKey: string, e) => {
  state.outputKey = e.id;
  // let arr: any[] = []
  // e.forEach((item) => {
  //   arr.push(findItem(sourceList.value, item))
  // })
  // dataBind.data.dataSource = arr.map((item) => {
  //   return {
  //     id: item.id,
  //     name: item.name,
  //     type: item.valueType?.type,
  //     value: item.value,
  //   }
  // })
}

/**查询数据字典列表 */
const queryData = () => {
  queryDictionary().then((res) => {
    dataOptions.value = res.result.filter(item => item.status !== 0).map((item) => {
      return {
        label: item.name,
        value: item.id,
      }
    })
  })
}
queryData()

const handleChangeType = () => {
  if(state.value === 'data') {
    state.abilityValue = null
    state.instructValue = null
    state.output = null
  } else {
    state.dataValue = null
  }
}

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
