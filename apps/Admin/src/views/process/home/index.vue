<!-- 流程引擎 -->
<template>
  <page-container>
    <TitleComponent data="流程搭建" />
    <div class="process">
      <MyCard v-for="item of processBuild" :data="item"></MyCard>
    </div>

    <TitleComponent data="我的流程" />
    <div class="process">
      <MyCard v-for="item of myProcess" :data="item"></MyCard>
    </div>
  </page-container>
</template>
<script setup>
import MyCard from '../components/MyCard/index.vue'
import { getMeProcessList } from '@/api/process/me'

const processBuild = [
  { name: '流程模型', icon: '/process/model.png', path: '/flow-engine/model' },
  { name: '流程表单', icon: '/process/form.png', path: '/flow-engine/form' },
  {
    name: '流程监控',
    icon: '/process/monitor.png',
    path: '/flow-engine/monitor',
  },
  {
    name: '流程实例',
    icon: '/process/instance.png',
    path: '/flow-engine/instance',
  },
]

const myProcess = [
  {
    name: '发起流程',
    icon: '/process/initiate.png',
    path: '/flow-engine/initiate',
  },
  { name: '待办事项', icon: '/process/todo.png', path: '/flow-engine/me/todo' },
  {
    name: '已办事项',
    icon: '/process/finished.png',
    path: '/flow-engine/me/finished',
  },
  {
    name: '我发起的',
    icon: '/process/me-initiate.png',
    path: '/flow-engine/me/initiate',
  },
  { name: '抄送给我', icon: '/process/cc.png', path: '/flow-engine/me/cc' },
]
</script>
<style scoped lang="less">
.process {
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  gap: 40px;
  margin-bottom: 80px;
}
</style>
