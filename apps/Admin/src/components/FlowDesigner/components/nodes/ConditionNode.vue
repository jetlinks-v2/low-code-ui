<!-- 条件节点 -->
<template>
  <div :class="{ node: true, 'node-error-state': showError, active }">
    <div :class="{ 'node-body': true, error: showError }">
      <div
        class="node-body-left"
        :style="{ display: readOnly ? 'none' : '' }"
        @click="emits('leftMove')"
        v-if="level > 1"
      >
        <AIcon type="LeftOutlined" />
      </div>
      <div class="node-body-main" @click="emits('selected')">
        <div class="node-body-main-header">
          <span class="title">
            <AIcon type="FunnelPlotOutlined" style="font-size: 12px" />
            <j-ellipsis>
              {{ config.name }}
            </j-ellipsis>
          </span>
          <span
            class="option"
            :style="{ display: readOnly ? 'none !important' : '' }"
          >
            <j-space>
              <AIcon type="CloseCircleFilled" @click="emits('delNode')" />
            </j-space>
          </span>
        </div>
        <div class="node-body-main-content">
          <span class="placeholder" v-if="(content || '').trim() === ''">
            {{ placeholder }}
          </span>
          <j-ellipsis v-else>{{ content }}</j-ellipsis>
        </div>
      </div>
      <div
        class="node-body-right"
        :style="{ display: readOnly ? 'none' : '' }"
        @click="emits('rightMove')"
        v-if="level < size"
      >
        <AIcon type="RightOutlined" />
      </div>
      <div class="node-error" v-if="showError">
        <j-tooltip>
          <template #title>{{ errorInfo }}</template>
          <AIcon type="WarningOutlined" />
        </j-tooltip>
      </div>
    </div>
    <div class="node-footer">
      <div class="btn" :class="{ readonly: readOnly }">
        <InsertButton @insertNode="(type) => emits('insertNode', type)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="ConditionNode">
import InsertButton from '../InsertButton.vue'
import { useFlowStore } from '@/store/flow'
import {queryVariables_api} from "@/api/process/model";
import  { isArray } from 'lodash-es'

const emits = defineEmits([
  'insertNode',
  'selected',
  'copy',
  'delNode',
  'leftMove',
  'rightMove',
])
const props = defineProps({
  config: {
    type: Object,
    default: () => {
      return {}
    },
  },
  //索引位置
  level: {
    type: Number,
    default: 1,
  },
  //条件数
  size: {
    type: Number,
    default: 0,
  },
  // 只读模式
  readOnly: {
    type: Boolean,
    default: false,
  },
})
const flow = useFlowStore()
const ValueType = ref({
  string: 'String',
  object: 'Object',
  array: 'Array',
  number: 'Number',
  date: 'Date',
  user: 'User',
  dept: 'Dept',
  dateRange: 'DateRange',
})
const groupNames = ref(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'])
const placeholder = ref('请配置条件')
const errorInfo = ref('')
const showError = ref(false)

const active = computed(() => props?.config?.active)
const content = computed(() => {
  console.log(props.config.props?.condition?.configuration);
  const terms = props.config.props?.condition?.configuration?.terms
  //   console.log('terms: ', terms)
  // 条件描述
  const _conditionDesc = terms.map(
    (item) =>
    formatValue(item),
  )
  return _conditionDesc.length
    ? _conditionDesc.join('')
    : '请配置条件'
})

const formatValue = (item) => {
  const condition = `${item.type === 'and' ? '并且' : item.type === 'or' ? '或者' : ''}`
  const _viewValue = item.viewValue ?? item.value
  switch (item.termType) {
    case 'in':
      return ` ${condition} ${item.columnName || ''} 在 ${item.selectedItem ? item.selectedItem?.join('、') : _viewValue || ''} 之中`
    case 'nin':
      return ` ${condition} ${item.columnName || ''} 不在 ${item.selectedItem ? item.selectedItem?.join('、') : _viewValue || ''} 之中`
    default:
      return ` ${condition} ${item.columnName || ''} ${item.termTypeName || ''} ${item.selectedItem ? item.selectedItem?.join('、') : _viewValue || ''}`
  }
}

const validateVariables = (data, keys) => {
  return data.some(item => {
    if (item.children) {
      return validateVariables(item.children, keys)
    }
    return keys.some(a => a === item.id)
  })
}

const validateFormItem = async () => {

  const { id, name, key, model, provider } = flow.modelBaseInfo
  const params = {
    definition: {
      id,
      name,
      key,
      model: JSON.stringify(flow.model), // model不能取modelBaseInfo(接口保存才会有值), 直接取动态值flowStore.model
      provider,
    },
    nodeId: props.config.parentId, // 条件节点配置, id传当前条件节点的branchBy
    containThisNode: false, //变量来源是否包含本节点
  }
  const { result } = await queryVariables_api(params)

  const { terms } = props.config.props?.condition?.configuration || []
  const termsKeys:string[] = terms.filter(item => item.column).map(item => {
    const _keys = item.column.split('.')
    return _keys.pop()
  })
  console.log(result, termsKeys)
  return validateVariables(result, termsKeys)
}

const isEmpty = (v) => {
  return (
    v === undefined ||
    v === null ||
    v === '' ||
    (isArray(v) && v.length === 0)
  );
};

/**
 * 校验节点
 */
const validate = (err) => {
  const { terms } = props.config.props?.condition?.configuration

  showError.value = true
  errorInfo.value = '未填写必填配置项'
  // const hasVar = await validateFormItem()
  // console.log('hasVar', hasVar)
  // if (!hasVar){
  //   errorInfo.value = '配置项错误'
  //   err.push({
  //     errors: ['配置项错误'],
  //     name: ['condition', 'configuration', 'terms'],
  //   })
  // } else if (
  //   !terms ||
  //   !terms.length ||
  //   !terms.some((item) => Boolean(Object.keys(item).length)) ||
  //   terms.some(item => !item.column || !item.termType || !item.value)
  // ) {
  //   err.push({
  //     errors: ['请配置进入下方节点的条件'],
  //     name: ['condition', 'configuration', 'terms'],
  //   })
  // } else {
  //   showError.value = false
  //   errorInfo.value = ''
  // }
  if (!props.config?.name) {
    err.push({
      errors: ['条件节点名称不能为空'],
      name: ['name'],
    })
  } else if (
    !terms?.length ||
    !terms.some((item) => Boolean(Object.keys(item).length)) ||
    terms.some(item => !isEmpty(item.value) || !item.termType)
  ) {
    err.push({
      errors: ['请配置进入下方节点的条件'],
      name: ['condition', 'configuration', 'terms'],
    })
  } else {
    showError.value = false
    errorInfo.value = ''
  }
}

defineExpose({ validate })
</script>

<style lang="less" scoped>
.node-error-state {
  .node-body {
    box-shadow: 0px 0px 5px 1px #f56c6c !important;
  }
}

.node {
  margin: 30px;
  width: 220px;
  &:before {
    content: '';
    position: absolute;
    top: 20px;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    width: 0;
    border-style: solid;
    border-width: 8px 6px 4px;
    border-color: #cacaca transparent transparent;
    background: #fff;
  }
  &.active {
    &::before {
      border-color: #3056df transparent transparent;
    }
    .node-body {
      border: 2px solid #3056df;
    }
    .node-footer::before {
      background-color: #3056df;
    }
  }
  .node-body {
    cursor: pointer;
    min-height: 80px;
    max-height: 120px;
    position: relative;
    border-radius: 4px;
    background-color: white;
    box-shadow: 0px 0px 6px 0px #d8d8d8;

    &:hover {
      .node-body-left,
      .node-body-right {
        .anticon {
          display: block !important;
        }
      }

      .node-body-main {
        .level {
          display: none !important;
        }

        .option {
          display: inline-block !important;
        }
      }

      box-shadow: 0px 0px 6px 0px #1890ff;
    }

    .node-body-left{
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    .node-body-right{
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    .node-body-left,
    .node-body-right {
      display: flex;
      align-items: center;
      position: absolute;
      height: 100%;
      z-index: 1;
      transition: all .3s;

      .anticon {
        display: none;
      }

      &:hover {
        background-color: #f7f7f7;
      }
    }

    .node-body-left {
      left: 0;
    }

    .node-body-right {
      right: 0;
      top: 0;
    }

    .node-body-main {
      width: 100%;
      display: inline-block;

      .node-body-main-header {
        padding: 5px 15px;
        font-size: xx-small;
        position: relative;
        background: #ab62ee;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .title {
          color: #fff;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .level {
          position: absolute;
          right: 15px;
          top: 10px;
          color: #888888;
        }

        .option {
          position: absolute;
          right: 20px;
          top: 0px;
          display: none;
          font-size: 18px;

          .anticon {
            color: #fff;
            font-size: medium;
          }
        }
      }

      .node-body-main-content {
        padding: 18px;
        color: #656363;
        font-size: 14px;

        .anticon {
          position: absolute;
          top: 55%;
          right: 10px;
          font-size: medium;
        }

        .placeholder {
          color: #8c8c8c;
        }
      }
    }

    .node-error {
      position: absolute;
      right: -30px;
      top: 30px;
      font-size: 20px;
      color: #f56c6c;
    }
  }

  .node-footer {
    position: relative;

    .btn {
      width: 100%;
      display: flex;
      height: 70px;
      padding: 20px 0 32px;
      justify-content: center;
      &:deep(.ant-btn) {
        border-radius: 50%;
        background: #1890ff;
        border-color: #1890ff;
      }
      &.readonly:deep(.ant-btn) {
        display: none;
      }
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      margin: auto;
      width: 2px;
      height: 100%;
      background-color: #cacaca;
    }
  }
}
</style>
