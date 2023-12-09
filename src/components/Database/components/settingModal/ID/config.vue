<template>
  <div class="id-warp">
    <div class="item" v-for="(item, index) in myValue">
      <j-select
          v-if="index !== 0"
          :options="[
              { label: '并且', value: 'and' },
              { label: '或者', value: 'or' },
          ]"
          v-model:value="item.condition[0].terms[0].type"
        style="margin: 8px 0; width: 100px"
      />
      <div class="item-body">
        <j-popconfirm
            title='确认删除？'
            @confirm='() => { onDelete(index) }'
            :overlayStyle='{minWidth: "180px"}'
        >
          <div class='terms-params-delete'>
            <AIcon type='DeleteOutlined' />
          </div>
        </j-popconfirm>
        <div>规则{{ index + 1 }}</div>
        <div class="item-content">
          <div class="terms-warp">
            <div class="terms-if">
              当
            </div>
            <div class="terms">
              <j-select
                  v-model:value="item.condition[0].terms[0].column"
                  :options="columnOptions"
              />
              <j-select
                  v-model:value="item.condition[0].terms[0].termType"
                  :options="termTypeOptions"
              />
              <j-input
                  v-model:value="item.condition[0].terms[0].value"
                  :disabled="item.condition[0].terms[0].termType === 'notnull'"
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
            <j-card-select
                v-model:value="item.type"
                :options="typeOptions"
                :column="4"
                :showImage="false"
                :multiple="true"
            />
  <!--          <template v-if="">-->
  <!--            <input placeholder="请输入常量"/>-->
  <!--          </template>-->
          </div>
        </div>

      </div>

      <div v-if="index === (myValue.length - 1)" class="add-rule" @click="addRule">
        + 规则
      </div>

    </div>
  </div>
</template>

<script setup name="IDConfig">

import {CRUD_COLUMNS} from "../../../util";
import { addItem } from './util'

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  }
})

const CrudColumns = inject(CRUD_COLUMNS)

const myValue = ref([])

const termTypeOptions = [
  {label: '为空', value: 'isnull'},
  {label: '不为空', value: 'notnull'},
  {label: '包含', value: 'like'},
  {label: '不包含', value: 'nlike'},
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

const columnOptions = computed(() => {
  return CrudColumns.value.map(item => ({label: item.dataIndex, value: item.dataIndex}))
})

const onDelete = (index) => {
  myValue.value = myValue.value.splice(index, 1)
}


const addRule = () => {
  const item = addItem()
  myValue.value.push(item)
}

watch(() => JSON.stringify(props.value), () => {
  myValue.value = props.value || []
}, { immediate: true })

</script>

<style scoped lang="less">
.id-warp {
  .item {

    .item-body {
      position: relative;
      border-radius: 4px;
      border: 1px dashed #999;
      padding: 4px;

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
  }



  .item-content {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .rule-item {
      :deep(.j-card-item) {
        padding: 4px 12px;
        text-align: center;
      }
    }
  }

  .terms-warp {
    display: flex;
    gap: 8px;
    align-items: center;

    .terms-if {
      color: #6968be;
      font-weight: 500;
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
