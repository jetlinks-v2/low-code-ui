<!-- 发起流程 -->
<template>
  <page-container>
    <j-row :gutter="[24, 24]">
      <span v-for="key of Object.keys(data)">
        <TitleComponent data="日常管理" />
        <j-col :span="2" v-for="item of data[key]">
          <div class="process" @click="handleDetail(item)">
            <div class="icon">
              <j-image
                v-if="item.icon?.includes('http')"
                :width="50"
                :height="50"
                :src="item.icon"
                :preview="false"
              />
              <AIcon v-else :type="item.icon" :style="{ fontSize: '40px' }" />
            </div>
            {{ item.name }}
          </div>
        </j-col>
      </span>
    </j-row>
  </page-container>
</template>
<script setup>
import { getList_api } from '@/api/process/initiate'

const router = useRouter()
const data = reactive({})

const demo = [
  {
    id: '1710961447945199616',
    key: 'c30w2s',
    name: '模型1',
    icon: 'http://192.168.32.66:9000/api/file/44d16619f7cc42a998e540c0ec448b46.jpg?accessKey=5c601fa473f5bc71041a4b6bd2d24317',
    provider: 'wflow',
    classifiedId: '日常管理',
    model: '',
    creatorId: '1199596756811550720',
    creatorName: '超级管理员',
    createTime: 1694596802888,
  },
]
const groupedData = (arr, field) => {
  return arr.reduce((acc, curr) => {
    let key = curr[field]
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push({ ...curr })
    return acc
  }, {})
}

getList_api({
  paging: false,
}).then((res) => {
  // Object.assign(data, res.result.data)
  Object.assign(data, groupedData(demo, 'classifiedId'))
})

const handleDetail = (data) => {
  router.push({
    path: '/flow-engine/initiate/initiate-detail',
    query: {
      id: data.id,
      // draft: true,
    },
  })
}
</script>
<style scoped lang="less">
.process {
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .icon {
    // border-radius: 10px;
    font-size: 40px;
  }
}
</style>
