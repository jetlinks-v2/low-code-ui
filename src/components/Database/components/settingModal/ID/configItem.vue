<template>
  <j-form-item-rest>
    <div class="rule-item-warp">
      <j-select
          v-if="!first"
          class="item-type"
          :options="[
                  { label: '并且', value: 'and' },
                  { label: '或者', value: 'or' },
              ]"
          v-model:value="condition.terms[0].type"
          @change="changeValue"
      />
      <div class="item-body">
        <j-popconfirm
            title='确认删除？'
            placement="topRight"
            :overlayStyle='{minWidth: "180px"}'
            @confirm='() => { onDelete(index) }'
        >
          <div class='terms-params-delete'>
            <AIcon type='DeleteOutlined' />
          </div>
        </j-popconfirm>
        <div class="item-title" >规则 {{ index + 1 }}</div>
        <div class="item-content">
          <div class="terms-warp">
            <div class="terms-if">
              当
            </div>
            <div class="terms">
              <j-select
                  v-model:value="condition.terms[0].column"
                  placeholder="请选择条件变量"
                  :options="columnOptions"
                  @change="columnChange"
              />
              <j-select
                  v-model:value="condition.terms[0].termType"
                  placeholder="请选择运算符"
                  :options="termTypeOptions"
                  @change="columnChange"
              />
              <j-input
                  v-model:value="condition.terms[0].value"
                  placeholder="请输入条件值"
                  :disabled="['notnull', 'isnull'].includes(condition.terms[0].termType)"
                  @change="changeValue"
              />
            </div>
            <div class="terms-if">
              时
            </div>
          </div>
          <div>
            编码生成规则为
          </div>
          <div class="rule-item">
            <div class="rule-type-tags">
              <div v-for="matchedItem in typeOptions" class="rule-type-item" @click="() => { matchedTypeChange(matchedItem.value)}">
                {{ matchedItem.label }}
              </div>
            </div>
    <!--        <j-card-select-->
    <!--            :options="typeOptions"-->
    <!--            :column="4"-->
    <!--            :showImage="false"-->
    <!--            :multiple="true"-->
    <!--            @change="changeValue"-->
    <!--        />-->
            <div class="matched-items">
              <div class="matched-item" v-for="(matchedType, matchedIndex) in matched">
                <div class="matched-item-label">
                  {{ getMarchedLabel(matchedType) }}
                </div>
                <div class="matched-item-value">
                  <template v-if="matchedType === 'string'">
                    <j-input
                        placeholder="请输入常量"
                        v-model:value="condition.matched[matchedIndex].string"
                        @change="changeValue"
                    />
                  </template>
                  <template v-else-if="matchedType === 'var'">
                    <j-select
                        placeholder="请选择数据变量"
                        v-model:value="condition.matched[matchedIndex].var.key"
                        :options="columnOptions"
                        @change="changeValue"
                    />
                  </template>
                  <template v-else-if="matchedType ===  'now'">
                    <j-select
                        placeholder="请选择日期"
                        v-model:value="condition.matched[matchedIndex].now.format"
                        :options="[
                            { label: 'yyyy-mm-dd', value: 'yyyy-mm-dd'},
                            { label: 'yyyy-mm', value: 'yyyy-mm'},
                            { label: 'mm-dd', value: 'mm-dd'},
                        ]"
                        @change="changeValue"
                    />
                  </template>
                  <template v-else-if="matchedType === 'sn'">
                    <j-select
                        placeholder="请选择序列号"
                        v-model:value="condition.matched[matchedIndex].sn.length"
                        :options="snOptions"
                        @change="changeValue"
                    />
                  </template>
                </div>
                <j-popconfirm
                    title='确认删除？'
                    placement="topRight"
                    :overlayStyle='{minWidth: "180px"}'
                    @confirm='() => { matchedDelete(matchedIndex) }'
                >
                  <div class="matched-item-delete">
                    <AIcon type='DeleteOutlined' />
                  </div>
                </j-popconfirm>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div v-if="last" class="add-rule" @click="addRule">
        + 规则
      </div>
    </div>
  </j-form-item-rest>
</template>

<script setup>
import {CRUD_COLUMNS} from "../../../util";
import { onlyMessage } from '@jetlinks-web/utils'

const termTypeOptions = [
  {label: '为空', value: 'isnull'},
  {label: '不为空', value: 'notnull'},
  {label: '包含', value: 'like'},
  {label: '不包含', value: 'nlike'},
  {label: '=', value: 'eq'},
  {label: '!=', value: 'not'},
  {label: '>', value: 'gt'},
  {label: '>=', value: 'gte'},
  {label: '<', value: 'lt'},
  {label: '<=', value: 'lte'},
]

const typeOptions = [
  {
    label: '常量',
    value: 'string'
  },
  {
    label: '数据变量',
    value: 'var'
  },
  {
    label: '日期',
    value: 'now'
  },
  {
    label: '序列号',
    value: 'sn'
  }
]

const props = defineProps({
  last: {
    type: Boolean,
    default: false
  },
  first: {
    type: Boolean,
    default: false
  },
  index: {
    type: Number,
    default: 0
  },
  dataId: {
    type: String,
    default: undefined
  },
  value: {
    type: Array,
    default: () => ([])
  },
})

const emit = defineEmits(['update:value', 'addRule', 'onDelete', 'change'])

const matchedMax = 8
const CrudColumns = inject(CRUD_COLUMNS)

const condition = reactive({
  ...(props.value)
})

const snOptions = new Array(7).fill(0).map((_, index) => ({
  label: index,
  value: index,
}))

const getMarchedLabel = (type) => {
  return typeOptions.find(item => item.value === type)?.label
}

const getMatchedValue = (type) => {

  switch (type) {
    case 'sn':
      return {
        length: undefined
      };
    case 'now':
      return {
        format: undefined
      };
    case 'var':
      return {
        key: undefined
      };
    default:
      return undefined
  }
}

const matched = computed(
    () => {
      return condition.matched.map(item => item.type)
    }
)

const columnOptions = computed(() => {
  return CrudColumns.value.filter(item => item.dataIndex !== props.dataId)
          .map(item => ({label: item.dataIndex, value: item.dataIndex}))
})

const changeValue = () => {
  emit('update:value', condition)
  emit('change', condition)
}

const columnChange = () => {
  condition.terms[0].value = undefined
  changeValue()
}

const addRule = () => {
  emit('addRule')
}

const onDelete = (index) => {
  emit('deleteRule', index)
}

const matchedDelete = (index) => {
  condition.matched.splice(index, 1)
  changeValue()
}

const matchedTypeChange = (type) => {
  const len = condition.matched.length
  if (len > matchedMax) {
    onlyMessage(`编码生成规则条数不能超过 ${matchedMax}`, 'warning')
    return
  }
  condition.matched.push({
    type: type,
    [type]: getMatchedValue(type)
  })
  changeValue()
}

</script>

<style scoped lang="less">
.rule-item-warp {
  width: calc(100% - 12px);
  .item-type {
    margin-top: 8px;
    margin-bottom: 10px;
    width: 100px;
  }

  .item-body {
    position: relative;
    border-radius: 4px;
    border: 1px dashed #999;
    padding: 4px 4px 4px 8px;

    .terms-params-delete {
      position: absolute;
      width: 22px;
      height: 22px;
      right: -10px;
      top: -10px;
      line-height: 22px;
      text-align: center;
      border-radius: 50%;
      color: #e50012;
      background-color: rgba(229, 0, 18, 0.1);
    }

    .item-title {
      font-weight: bold;
      position: absolute;
      top: -10px;
      left: 10px;
      padding: 0 2px;
      background-color: #fff;
    }

    .item-content {
      padding: 12px 8px 12px 6px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .rule-item {
        :deep(.j-card-item) {
          padding: 4px 12px;
          text-align: center;
        }

        .rule-type-tags {
          display: flex;
          gap: 12px;

          .rule-type-item {
            border-radius: 6px;
            padding: 6px 24px;
            border: 1px solid #e3e3e3;
            cursor: pointer;
            transition: all .2s;

            &:hover {
              border-color: var(--ant-primary-color);
            }
          }
        }

        .matched-items {
          display: flex;
          gap: 4px;
          flex-direction: column;
          margin-top: 6px;

          .matched-item {
            display: flex;
            align-items: center;

            .matched-item-label {
              width: 60px;
            }

            .matched-item-value {
              flex: auto 1;
            }

            .matched-item-delete {
              width: 20px;
              padding: 0 6px 0 8px;
              color: #e50012;
            }
          }
        }
      }
    }
  }

  .add-rule {
    border-radius: 8px;
    border: 1px dashed #999;
    text-align: center;
    padding: 6px 12px;
    width: 100px;
    margin-top: 8px;
    cursor: pointer;
  }

  .terms-warp {
    display: flex;
    gap: 8px;
    align-items: center;

    .terms-if {
      color: #6968be;
      font-weight: bold;
    }

    .terms {
      display: flex;
      min-width: 0;
      flex-grow: 1;
      gap: 4px;
    }
  }
}

</style>
