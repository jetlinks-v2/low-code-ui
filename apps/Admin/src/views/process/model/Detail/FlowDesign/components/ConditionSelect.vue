<template>
  <div v-for="(item, index) in conditionSelect" :key="index">
    <j-select
      v-if="index > 0"
      v-model:value="item.type"
      :options="[
        { label: '或者', value: 'or' },
        { label: '并且', value: 'and' },
      ]"
      class="operator-select"
      placeholder="请选择"
      style="width: 90px; margin-bottom: 10px"
    />
    <div class="condition-select">
      <j-tree-select
        v-model:value="item.selectedColumn"
        v-model:searchValue="item.searchValue"
        show-search
        label-in-value
        placeholder="请配置变量"
        allow-clear
        tree-default-expand-all
        tree-node-filter-prop="name"
        :tree-data="conditionOptions"
        :field-names="{ label: 'name', value: 'fullId' }"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        style="max-width: 200px; min-width: 200px"
        class="variable-select"
        @clear="handleConditionClear(index)"
        @select="
          (value, label) => handleConditionChange(value, label, item, index)
        "
      >
        <template #title="{ name }">
          <j-ellipsis line-clamp="1">
            <template
              v-for="(fragment, i) in name
                ?.toString()
                ?.split(
                  new RegExp(
                    `(?<=${item.searchValue})|(?=${item.searchValue})`,
                    'i',
                  ),
                )"
            >
              <span
                v-if="
                  fragment.toLowerCase() === item.searchValue?.toLowerCase()
                "
                :key="i"
                style="color: #08c"
              >
                {{ fragment }}
              </span>
              <template v-else>{{ fragment }}</template>
            </template>
          </j-ellipsis>
        </template>
      </j-tree-select>
      <j-select
        v-model:value="item.selectedTermType"
        :options="operatorMap[conditionType(item) || 'default']"
        label-in-value
        placeholder="请选择"
        style="max-width: 120px"
        class="operator-select"
        @change="handleTermTypeChange(item)"
      />
      <ConditionValueItem
        v-model:modelValue="item.value"
        :operator="item.selectedTermType"
        :formItemComponent="item.selectedNodeId"
        :full-id="findVariableById(conditionOptions, item?.column)?.fullId"
        :conditionType="conditionType(item)"
      />
      <AIcon
        type="CloseCircleFilled"
        style="color: red; position: absolute; right: 0px; top: -4px"
        @click="handleRemove(index)"
        v-if="index !== 0"
      />
    </div>
  </div>
  <j-button
    type="default"
    style="width: 84px; background-color: #ebedf3"
    @click="handleAdd"
  >
    <AIcon type="PlusOutlined" />
  </j-button>
</template>

<script setup lang="ts">
import { queryFormNoPage_api, queryVariables_api } from '@/api/process/model'
import { useFlowStore } from '@/store/flow'
import ConditionValueItem from './ConditionValueItem.vue'
import { operatorMap } from './const'
import { findVariableById, setDefaultFormBinds } from './utils'
import { onlyMessage } from '@jetlinks/utils'
import { cloneDeep } from 'lodash-es'

const flowStore = useFlowStore()

interface IConditionSelect {
  column: string | undefined
  termType: string | undefined
  value: string | string[] | number | undefined
  searchValue: string | undefined
  type?: string

  selectedColumn?: any // 下拉条件树选中的值, 设置了label-in-value, 选中的值为object
  columnName?: string | undefined
  selectedTermType?: any
  termTypeName?: string | undefined
  valueName?: string | undefined
  selectedNodeId?: string //选中的节点ID
}

const emit = defineEmits(['update:value'])
const props = defineProps({
  value: {
    type: Array as PropType<IConditionSelect[]>,
    default: () => [],
  },
})

const conditionSelect = ref<IConditionSelect[]>([])
const conditionOptions = ref([])

/**
 * 获取最新的表单字段, 并赋值给根节点的formBinds, 根节点赋值了才能查出变量
 */
const getLatestFormList = async () => {
  const existForms = flowStore.model.config.forms?.filter((f) => !f.isDelete)
  // 查询预览表单参数
  const params = {
    paging: false,
    terms: [
      {
        column: 'key',
        termType: 'in',
        value: existForms?.map((m) => m.formId),
      },
      {
        column: 'latest',
        termType: 'eq',
        value: 'true',
      },
    ],
  }
  const { result } = await queryFormNoPage_api(params)
  // 设置根节点模式表单字段"读"配置时, 保留原有的配置
  flowStore.model.nodes.props!.formBinds = setDefaultFormBinds(
    result,
    'conditionSelect',
    flowStore.model.nodes.props!.formBinds,
  )
  getFormFields()
}

/**
 * 获取条件下拉数据
 */
const getFormFields = async () => {
  const { id, name, key, model, provider } = flowStore.modelBaseInfo
  const params = {
    definition: {
      id,
      name,
      key,
      model: JSON.stringify(flowStore.model), // model不能取modelBaseInfo(接口保存才会有值), 直接取动态值flowStore.model
      provider,
    },
    nodeId: flowStore.selectedNode.props.branchBy, // 条件节点配置, id传当前条件节点的branchBy
    containThisNode: false, //变量来源是否包含本节点
  }
  const { result } = await queryVariables_api(params)
  function filter(list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].children?.length) {
        list[i].disabled = true
      }
      if (list[i].children) {
        filter(list[i].children)
      }
      if (['table', 'upload'].includes(list[i].others?.type)) {
        list.splice(i, 1)
        return
      }
    }
    return list
  }
  conditionOptions.value = filter(result)
  conditionSelect.value.forEach((item, index) => {
    const node = findVariableById(conditionOptions.value, item?.column)
    if (!node) {
      handleConditionClear(index)
    }
  })
}

/**
 * 条件选择改变 设置column和columnName
 * @param item
 */
const handleConditionChange = (value, node, item, index) => {
  item.value = item.selectedTermType = undefined
  item.column = node.fullId
  item.columnName = node.name
  item.selectedNodeId = node.id
}

const handleConditionClear = (index) => {
  conditionSelect.value[index] = {} as any
}

const handleTermTypeChange = (item) => {
  item.termType = item.selectedTermType.value
  item.termTypeName = item.selectedTermType.label
}

/**
 * 所选条件(变量/表单字段)类型
 * 变量列表的others.type = 组织org、用户user、角色role、产品product、设备device时,
 * 取下拉值为下拉单选/多选框, 否则为输入框
 */
const conditionType = (item) => {
  const _var = findVariableById(conditionOptions.value, item?.column)
  // console.log('_var: ', _var)
  if (_var?.id === 'processOwnerName') {
    return 'input'
  }
  return _var?.others?.type || _var?.others?.relation
}

const handleRemove = (index: number) => {
  conditionSelect.value.splice(index, 1)
}

const handleAdd = () => {
  const beforeDone = conditionSelect.value.some((item: any) => {
    return !item.selectedColumn || !item.selectedTermType || !item.value
  })
  if (!beforeDone) {
    onlyMessage('前置条件未配置完成', 'error')
    return
  }
  conditionSelect.value.push({
    column: undefined,
    termType: undefined,
    value: undefined,
    type: 'and',

    // 前端筛选需要
    searchValue: '',
    // 存起来, 节点回显需要
    columnName: undefined,
    termTypeName: undefined,
    valueName: undefined,
  })
}

watch(
  () => props.value,
  (val) => {
    conditionSelect.value =
      val && val.length
        ? val
        : [
            {
              column: undefined,
              termType: undefined,
              value: undefined,

              // 前端筛选需要
              searchValue: '',
              // 存起来, 节点回显需要
              columnName: undefined,
              termTypeName: undefined,
              valueName: undefined,
            },
          ]
  },

  { deep: true, immediate: true },
)

watch(
  () => conditionSelect.value,
  (val) => {
    // console.log('conditionSelect: ', val)
    emit('update:value', val)
  },
  { deep: true },
)

onMounted(() => {
  getLatestFormList()
})
</script>

<style lang="less" scoped>
.condition-select {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  position: relative;
  .variable-select {
    border: 1px solid #15c4ff;
    color: #15c4ff;
    :deep(.ant-select-selector) {
      background-color: #eefbff;
    }
    :deep(.ant-select-arrow) {
      color: #15c4ff;
    }
    :deep(.ant-select-clear) {
      color: #15c4ff;
    }
    :deep(.ant-select-selection-placeholder) {
      color: #15c4ff;
    }
  }
}
.operator-select {
  border: 1px solid #208cff;
  color: #208cff;
  :deep(.ant-select-selector) {
    background-color: #f0f7ff;
  }
  :deep(.ant-select-arrow) {
    color: #208cff;
  }
  :deep(.ant-select-clear) {
    color: #208cff;
  }
  :deep(.ant-select-selection-placeholder) {
    color: #208cff;
  }
}
input {
  color: #ce29dd !important;
  background-color: #fef5ff;
  &::placeholder {
    color: #ce29dd !important;
  }
}
</style>
