<!-- 流程引擎 -->
<template>
  <page-container>
    <template v-if="build.length">
      <TitleComponent data="流程搭建" />
      <div class="process">
        <MyCard v-for="item of build" :data="item"></MyCard>
      </div>
    </template>

    <template v-if="myProcessOptions.length">
      <TitleComponent data="我的流程" />
      <div class="process">
        <MyCard v-for="item of myProcessOptions" :data="item"></MyCard>
      </div>
    </template>
  </page-container>
</template>
<script setup>
import MyCard from '../components/MyCard/index.vue'
import { getMeProcessList } from '@/api/process/me'
import { useUserStore } from '@/store/user'
import { useMenuStore } from '@/store'

const userStore = useUserStore()
const menu = useMenuStore()

const build = computed(()=>{
  return processBuild.filter(item => {
    if (item.code === 'process/monitor') {
      return userStore.userInfo.username === 'admin'
    }
    return menu.hasMenu(item.code)
  })
})

const myProcessOptions = computed(() => {
  return myProcess.filter(item => menu.hasMenu(item.code))
})

const processBuild = [
  { name: '流程模型', code: 'process/model', icon: '/process/model.png', path: '/flow-engine/model' },
  { name: '流程表单', code: 'process/form', icon: '/process/form.png', path: '/flow-engine/form' },
  {
    name: '流程监控',
    code: 'process/monitor',
    icon: '/process/monitor.png',
    path: '/flow-engine/monitor',
  },
  {
    name: '流程实例',
    code: 'process/instance',
    icon: '/process/instance.png',
    path: '/flow-engine/instance',
  },
]

const myProcess = [
  {
    name: '发起流程',
    code: 'process/initiate',
    icon: '/process/initiate.png',
    path: '/flow-engine/initiate',
  },
  {
    key: 'todo',
    name: '待办事项',
    code: 'process/me/todo',
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
    code: 'process/me',
    icon: '/process/finished.png',
    path: '/flow-engine/me/finished',
  },
  {
    name: '我发起的',
    code: 'process/me/cc',
    icon: '/process/me-initiate.png',
    path: '/flow-engine/me/initiate',
  },
  {
    name: '抄送给我',
    code: 'process/me/initiate',
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
