<template>
  <div :class="{ node: true, 'node-error-state': showError }">
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
            <j-ellipsis>
              {{ config.name ? config.name : '条件' + level }}
            </j-ellipsis>
          </span>
          <span
            class="level"
            :style="{ display: readOnly ? 'inline-block !important' : '' }"
          >
            优先级{{ level }}
          </span>
          <span
            class="option"
            :style="{ display: readOnly ? 'none !important' : '' }"
          >
            <j-space>
              <!-- <j-tooltip title="复制条件" placement="top">
                <AIcon type="CopyOutlined" @click="emits('copy')" />
              </j-tooltip> -->
              <AIcon type="CloseOutlined" @click="emits('delNode')" />
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
const placeholder = ref('请设置条件')
const errorInfo = ref('')
const showError = ref(false)

const content = computed(() => {
  const groups = props.config.props.groups
  let confitions: any[] = []
  groups.forEach((group) => {
    let subConditions: any[] = []
    group.conditions.forEach((subCondition) => {
      let subConditionStr = ''
      switch (subCondition.valueType) {
        case ValueType.dept:
        case ValueType.user:
          subConditionStr = `${subCondition.title}属于[${String(
            subCondition.value?.map((u) => u.name),
          ).replaceAll(',', '. ')}]之一`
          break
        case ValueType.number:
        case ValueType.string:
          subConditionStr = getOrdinaryConditionContent(subCondition)
          break
      }
      subConditions.push(subConditionStr)
    })
    //根据子条件关系构建描述
    let subConditionsStr = String(subConditions).replaceAll(
      ',',
      subConditions.length > 1
        ? group.groupType === 'AND'
          ? ') 且 ('
          : ') 或 ('
        : group.groupType === 'AND'
        ? ' 且 '
        : ' 或 ',
    )
    confitions.push(
      subConditions.length > 1 ? `(${subConditionsStr})` : subConditionsStr,
    )
  })
  //构建最终描述
  return String(confitions).replaceAll(
    ',',
    props.config.props.groupsType === 'AND' ? ' 且 ' : ' 或 ',
  )
})

const getDefault = (val, df) => {
  return val && val !== '' ? val : df
}
const getOrdinaryConditionContent = (subCondition) => {
  switch (subCondition.compare) {
    case 'IN':
      return `${subCondition.title}为[${String(subCondition.value).replaceAll(
        ',',
        '、',
      )}]中之一`
    case 'B':
      return `${subCondition.value[0]} < ${subCondition.title} < ${subCondition.value[1]}`
    case 'AB':
      return `${subCondition.value[0]} ≤ ${subCondition.title} < ${subCondition.value[1]}`
    case 'BA':
      return `${subCondition.value[0]} < ${subCondition.title} ≤ ${subCondition.value[1]}`
    case 'ABA':
      return `${subCondition.value[0]} ≤ ${subCondition.title} ≤ ${subCondition.value[1]}`
    case '<=':
      return `${subCondition.title} ≤ ${getDefault(
        subCondition.value[0],
        ' ?',
      )}`
    case '>=':
      return `${subCondition.title} ≥ ${getDefault(
        subCondition.value[0],
        ' ?',
      )}`
    default:
      return `${subCondition.title}${subCondition.compare}${getDefault(
        subCondition.value[0],
        ' ?',
      )}`
  }
}
//校验数据配置的合法性
const validate = (err) => {
  const _props = props.config.props
  if (_props.groups.length <= 0) {
    showError.value = true
    errorInfo.value = '请设置分支条件'
    err.push(`${_props.config.name} 未设置条件`)
  } else {
    for (let i = 0; i < _props.groups.length; i++) {
      if (_props.groups[i].cids.length === 0) {
        showError.value = true
        errorInfo.value = `请设置条件组${groupNames.value[i]}内的条件`
        err.push(
          `条件 ${_props.config.name} 条件组${groupNames.value[i]}内未设置条件`,
        )
        break
      } else {
        let conditions = _props.groups[i].conditions
        for (let ci = 0; ci < conditions.length; ci++) {
          let subc = conditions[ci]
          if (subc.value.length === 0) {
            showError.value = true
          } else {
            showError.value = false
          }
          if (showError.value) {
            errorInfo.value = `请完善条件组${groupNames.value[i]}内的${subc.title}条件`
            err.push(
              `条件 ${props.config.name} 条件组${groupNames.value[i]}内${subc.title}条件未完善`,
            )
            return false
          }
        }
      }
    }
  }
  return !showError.value
}
</script>

<style lang="less" scoped>
.node-error-state {
  .node-body {
    box-shadow: 0px 0px 5px 0px #f56c6c !important;
  }
}

.node {
  margin: 30px;
  width: 220px;

  .node-body {
    cursor: pointer;
    min-height: 80px;
    max-height: 120px;
    position: relative;
    border-radius: 5px;
    background-color: white;
    box-shadow: 0px 0px 5px 0px #d8d8d8;

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

      box-shadow: 0px 0px 3px 0px #1890ff;
    }

    .node-body-left,
    .node-body-right {
      display: flex;
      align-items: center;
      position: absolute;
      height: 100%;

      .anticon {
        display: none;
      }

      &:hover {
        background-color: #ececec;
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
      //position: absolute;
      width: 188px;
      margin-left: 17px;
      display: inline-block;

      .node-body-main-header {
        padding: 10px 0px 5px;
        font-size: xx-small;
        position: relative;

        .title {
          color: #15bca3;
          display: inline-block;
          height: 14px;
          width: 125px;
        }

        .level {
          position: absolute;
          right: 15px;
          top: 10px;
          color: #888888;
        }

        .option {
          position: absolute;
          right: 0;
          top: 5px;
          display: none;
          font-size: 14px;
          color: #888888;

          .anticon {
            color: #888888;
            padding: 0 3px;
          }
        }
      }

      .node-body-main-content {
        padding: 6px;
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
      right: -40px;
      top: 20px;
      font-size: 25px;
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
