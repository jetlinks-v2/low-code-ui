<!-- 流程引擎 -->
<template>
  <page-container>
    <TitleComponent data="流程搭建" />
    <div class="process">
      <MyCard v-for="item of build" :data="item"></MyCard>
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
import { useUserStore } from '@/store/user'

const userStore = useUserStore()


const build = computed(()=>{
  return userStore.userInfo.username === 'admin' ? processBuild : processBuild.filter(item => item.name !== '流程监控')
})
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
  {
    key: 'todo',
    name: '待办事项',
    icon: '/process/todo.png',
    path: '/flow-engine/me/todo',
    fun: () =>
      new Promise((resolve, reject) => {
        getMeProcessList(
          {
            paging: false,
            terms: [
              {
                value: 'ready',
                termType: 'not',
                column: 'state',
              },
            ],
          },
          'todo',
          false,
        ).then((res) => {
          resolve({ data: res.result.total })
        })
      }),
  },
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
  {
    name: '抄送给我',
    icon: '/process/cc.png',
    path: '/flow-engine/me/cc',
  },
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
