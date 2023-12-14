<!-- 流程引擎 -->
<template>
  <page-container>
    <template v-if="build.length">
      <TitleComponent data="流程搭建" style="font-size: 24px;font-weight: 500;" />
      <div class="process">
        <MyCard v-for="item of build" :data="item"></MyCard>
      </div>
    </template>

    <template v-if="myProcessOptions.length">
      <TitleComponent data="我的流程" style="font-size: 24px;font-weight: 500;" />
      <div class="process">
        <MyCard v-for="item of myProcessOptions" :data="item"></MyCard>
      </div>
    </template>
  </page-container>
</template>
<script setup>
import MyCard from '../components/MyCard/index.vue'
import { getMeProcessList } from '@LowCode/api/process/me'
import { useUserStore } from '@LowCode/store/user'
import { useMenuStore } from '@LowCode/store'
import { TitleComponent } from '@LowCode/components/index'

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
  { name: '流程模型', code: 'process/model', icon: '/process/model.png' },
  { name: '流程表单', code: 'process/form', icon: '/process/form.png' },
  {
    name: '流程监控',
    code: 'process/monitor',
    icon: '/process/monitor.png',
  },
  {
    name: '流程实例',
    code: 'process/instance',
    icon: '/process/instance.png',
  },
]

const myProcess = [
  {
    name: '发起流程',
    code: 'process/initiate',
    icon: '/process/initiate.png',
  },
  {
    key: 'todo',
    name: '待办事项',
    code: 'process/me/todo',
    icon: '/process/todo.png',
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
    code: 'process/me/finished',
    icon: '/process/finished.png',
  },
  {
    name: '我发起的',
    code: 'process/me/initiate',
    icon: '/process/me-initiate.png',
  },
  {
    name: '抄送给我',
    code: 'process/me/cc',
    icon: '/process/cc.png',
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
