<template>
  <div class="paging-config">
    <j-drawer
      title="分页器配置"
      placement="top"
      :closable="false"
      :visible="open"
      @close="onClose"
    >
      <p>请配置分页器支持的单页数据量</p>
      <div style="display: flex; flex-flow: wrap">
        <div v-for="(item, index) in pagingData" :key="index">
          <j-input-number
            style="margin: 10px"
            v-model:value="item.pageSize"
            :min="1"
            :precision="0"
            :max="9999"
            :step="1"
            @blur="blur()"
            @pressEnter="blur()"
          />
          <span v-if="index < pagingData.length - 1">,</span>
          <span
            v-if="index === pagingData.length - 1 && pagingData.length < 99"
          >
            <j-button type="text" @click="onAdd">+</j-button>
          </span>
        </div>
      </div>
    </j-drawer>
  </div>
</template>
<script setup lang="ts">
const pagingData = ref([
  { pageSize: 12 },
  { pageSize: 24 },
  { pageSize: 48 },
  { pageSize: 96 },
])
const open = ref<boolean>(true)
const onAdd = () => {
  const value = pagingData.value[pagingData.value.length - 1].pageSize
  console.log(value)

  pagingData.value.push({
    pageSize: value + 1,
  })
  blur()
}
//去重
const deWeightThree = () => {
  let map = new Map()
  for (let item of pagingData.value) {
    if (!map.has(item.pageSize) && item.pageSize !== null) {
      map.set(item.pageSize, item)
    }
  }
  return [...map.values()]
}

const blur = () => {
  pagingData.value = deWeightThree()
  pagingData.value?.sort((a, b) => {
    return a.pageSize - b.pageSize
  })
}
defineExpose({
  open: open.value,
})
</script>
<style lang="less" scoped></style>
