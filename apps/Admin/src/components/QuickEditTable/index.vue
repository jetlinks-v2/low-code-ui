<template>
  <div>
    <virtual-list :data="data" :container-height="containerHeight">
      <template #title>
        <span>123</span>
      </template>

      <template #content="{ record, id }">
        <h1>{{ record }}-{{ id }}</h1>
      </template>
    </virtual-list>
  </div>
</template>

<script setup lang="ts" name="QuickEditTable">
import { ref } from 'vue'

const data = ref([])
const containerHeight = 400
// 模拟生成大量数据
for (let i = 1; i <= 10000; i++) {
  data.value.push({ id: i, text: `Item ${i}` })
}
</script>

<style></style>
