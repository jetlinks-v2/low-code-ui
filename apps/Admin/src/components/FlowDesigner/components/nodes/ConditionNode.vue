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
              {{ config.name ? config.name : '条件' + level }}
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
  const terms = props.config.props?.condition?.configuration?.terms
  //   console.log('terms: ', terms)
  // 条件描述
  const _conditionDesc = terms.map(
    (item) =>
      `${item.columnName || ''}${item.termTypeName || ''}${item.value || ''}`,
  )
  return _conditionDesc.length
    ? String(_conditionDesc).replaceAll(',', '、')
    : '请配置条件'
})

/**
 * 校验节点
 */
const validate = (err) => {
  const { name } = props.config
  const { terms } = props.config.props?.condition?.configuration
  const { children } = props.config

  showError.value = true
  errorInfo.value = '配置项错误'
  if (!name) {
    err.push({
      errors: ['条件节点名称不能为空'],
      name: ['name'],
    })
  } else if (!children || !Object.keys(children).length) {
    err.push({
      errors: ['条件节点下未配置审批/办理节点'],
      name: ['children'],
    })
    errorInfo.value = '条件节点下未配置审批/办理节点'
  } else if (
    !terms ||
    !terms.length ||
    !terms.some((item) => Boolean(Object.keys(item).length)) ||
    terms.some((item) => !item.column || !item.termType || !item.value)
  ) {
    err.push({
      errors: ['请配置进入下方节点的条件'],
      name: ['condition', 'configuration', 'terms'],
    })
  } else if (name.length > 64) {
    err.push({
      errors: ['条件节点名称最多输入64个字符'],
      name: ['name'],
    })
    errorInfo.value = '配置项错误'
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

    .node-body-left {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    .node-body-right {
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
      transition: all 0.3s;

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
