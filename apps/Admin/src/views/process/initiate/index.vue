<!-- 发起流程 -->
<template>
  <page-container>
      <j-row :gutter="[24,24]">
        <TitleComponent data="日常管理" />
        <j-col :span="2" v-for="item of data">
          <div class="process" @click="handleDetail">
          <div class="icon"><AIcon :type="item.icon" /></div>
          {{ item.text }}
        </div>
        </j-col>
        <TitleComponent data="流程分类" />
        <j-col :span="2" v-for="item of data">
          <div class="process" @click="handleDetail">
          <div class="icon"><AIcon :type="item.icon" /></div>
          {{ item.text }}
        </div>
        </j-col>
      </j-row>
  </page-container>
</template>
<script setup lang="ts">

const router = useRouter()

const data = ref([
  {text: '请假申请', icon: 'DribbbleOutlined'},
  {text: '请假申请', icon: 'DribbbleOutlined'},
  {text: '请假申请', icon: 'DribbbleOutlined'}
])

const handleDetail = (data) =>{
  router.push({
    path: '/flow-engine/initiate/initiate-detail',
    query: {
      id: data.id,
    },
  })
}
</script>
<style scoped lang="less">

.process{
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .icon{
    // border-radius: 10px;
    font-size: 40px;
  }
}
</style>
