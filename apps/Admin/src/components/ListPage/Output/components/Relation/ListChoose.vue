<template>
  <div class="list-choose">
    <j-row>
      <j-col :span="15">
        <j-input-search v-model:value="searchValue" placeholder="" />
        <j-scrollbar height="400">
          <j-tree :tree-data="filterValue" :field-names="fieldNames" @select="selectNode">
            <template #title="{ name, id }">
              <j-ellipsis style="width: 100%;">
                <span :class="{ checked: chosenArr.find(item => item.id === id) }">{{ name }}</span>
              </j-ellipsis>
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
            <j-button @click="chosenArr = []">清空</j-button>
          </j-col>
        </j-row>
        <j-table :columns="columns" :dataSource="chosenArr" :pagination="false" :scroll="{ y: 345 }">
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
import { pick } from 'lodash-es';
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

const selectNode = (selectedKeys, {selectedNodes, node}) => {
  if(chosenArr.value.find(item => item.id === selectedKeys?.[0])) {
    return
  }
  chosenArr.value.push(...selectedNodes.map(item => pick(item, ['id', 'name'])))
}

const deleteItem = (data) => {
  chosenArr.value = chosenArr.value.filter(item => item.id !== data.id)
}

watchEffect(() => {
  chosenArr.value = props.dataSource
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
