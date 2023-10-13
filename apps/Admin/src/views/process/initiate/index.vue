<!-- 发起流程 -->
<template>
  <page-container>
    <FullPage>
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
      <div class="empty" v-show="Object.keys(data).length < 1">
        <j-empty />
      </div>
    </FullPage>
  </page-container>
</template>
<script setup>
import { getList_api } from '@/api/process/initiate'

const router = useRouter()
const data = reactive({})

const groupedData = (arr, field) => {
  return arr?.reduce((acc, curr) => {
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
  Object.assign(data, groupedData(res.result.data, 'classifiedId'))
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
    font-size: 40px;
  }
}

.empty {
  margin-top: 40px;
}
</style>
