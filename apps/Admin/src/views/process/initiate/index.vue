<!-- 发起流程 -->
<template>
  <page-container>
    <FullPage class="page">
      <div class="type-item" v-for="key of Object.keys(data)">
        <j-row :gutter="[16, 16]">
          <j-col :span="24">
            <TitleComponent
              :data="getText(key) ?? '流程分类已被删除，请重新添加'"
            />
          </j-col>
          <j-col :xs="20" :sm="10" :md="6" :lg="6" :xl="2" v-for="item of data[key]">
            <div class="process" @click="handleDetail(item)">
              <div class="icon">
                <ProImage
                  v-if="item.icon?.includes('http')"
                  :width="100"
                  :height="100"
                  :src="item.icon"
                  :preview="false"
                />
                <AIcon v-else :type="item.icon" :style="{ fontSize: '40px' }" />
              </div>
              <j-ellipsis style="max-width: 200px">
                {{ item.name }}
              </j-ellipsis>
            </div>
          </j-col>
        </j-row>
      </div>
      <div class="empty" v-show="Object.keys(data).length < 1">
        <j-empty />
      </div>
    </FullPage>
  </page-container>
</template>
<script setup>
import { groupBy } from 'lodash-es'
import { getList_api } from '@/api/process/initiate'
import { useClassified } from '@/hooks/useClassified'

const { getText } = useClassified()

const router = useRouter()
const data = reactive({})

getList_api({
  paging: false,
}).then((res) => {
  Object.assign(data, groupBy(res.result.data, 'classifiedId'))
})

const handleDetail = (data) => {
  router.push({
    path: '/flow-engine/initiate/initiate-detail',
    query: {
      id: data.id,
      // isDraft: true,
    },
  })
}
</script>
<style scoped lang="less">
.page {
  padding: 20px;

  .type-item {
    margin-bottom: 20px;
    .process {
      width: 100px;
      height: 100px;
      // border: 1px solid #ccc;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .icon {
        width: 100px;
        height: 100px;
        overflow: hidden;
        // background: #036a8a;
        border-radius: 4px;
        border: 1px solid #000;
        font-size: 40px;
      }
    }
  }

  .empty {
    margin-top: 40px;
  }
}
</style>
