<template>
  <div class="list-choose">
    <j-row>
      <j-col :span="15">
        <j-input-search v-model:value="searchValue" placeholder="" allowClear style="margin-bottom: 10px;"/>
        <j-scrollbar height="400">
          <j-tree :tree-data="filterValue" :field-names="fieldNames" block-node multiple v-model:selectedKeys="selectedKeys" @select="selectNode">
            <template #title="{ name }">
              <span>{{ name }}</span>
            </template>
          </j-tree>
      </j-scrollbar>
      </j-col>
      <j-divider type="vertical" style="height: auto"></j-divider>
      <j-col :span="8">
        <j-row align="middle" justify="space-between" style="width: 100%;">
          <j-col :span="14">
            <a-alert :message="`已选择：${chosenArr.length}`" type="info">
            </a-alert>
          </j-col>
          <j-col :span="6">
            <j-button @click="chosenArr = []; selectedKeys = []">清空</j-button>
          </j-col>
        </j-row>
        <j-table ref="tableRef" :columns="columns" :dataSource="chosenArr" :pagination="false" :scroll="{ y: 345 }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <j-button type="text" danger @click="deleteItem(record)">删除</j-button>
            </template>
          </template>
        </j-table>
      </j-col>
    </j-row>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep, omit, pick } from 'lodash-es';
import { PropType } from 'vue';

const props = defineProps({
  columns: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => []
  },
  list: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => []
  },
  fieldNames: {
    type: Object as PropType<Record<string, any>>,
    default: () => {}
  },
  dataSource: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => []
  }
})

const tableRef = ref()
const searchValue = ref()
const chosenArr = ref<any[]>([])

const filterValue = computed(() => {
  if(!searchValue.value) {
    return props.list
  }
  return props.list.filter((item) => {
    return item.name.includes(searchValue.value)
  })
})

const selectedKeys = ref<any[]>([])
const selectNode = (selectedKey, {selected, selectedNodes, node}) => {
  if(!selected) {
    selectedKeys.value = [...selectedKeys.value, node.key]
  } else {
    chosenArr.value = [...chosenArr.value, pick(node, ['id', 'name'])]
  }
  nextTick(() => {
    tableRef.value.$el.getElementsByTagName('tbody')?.[0].scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
  })
}

const deleteItem = (data) => {
  chosenArr.value = chosenArr.value.filter(item => item.id !== data.id)
  selectedKeys.value = selectedKeys.value.filter(item => item !== data.id)
}

watchEffect(() => {
  chosenArr.value = cloneDeep(props.dataSource)
  selectedKeys.value = cloneDeep(props.dataSource.map(item => item.id))
})

defineExpose({
  chosenArr: chosenArr
})
</script>

<style scoped lang="less">
.list-choose {
  border: 1px solid #d9d9d9;
  padding: 16px 32px;
  .checked {
    background-color: #d9d9d9;
  }
}
</style>
