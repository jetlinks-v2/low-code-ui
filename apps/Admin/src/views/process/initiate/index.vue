<!-- 发起流程 -->
<template>
  <page-container>
    <FullPage class="page">
      <div class="type-item" v-for="key of Object.keys(data)">
        <!-- <TitleComponent
          :data="getText(key) ?? '流程分类已被删除，请重新添加'"
        /> -->
        <div class="type-title" :class="{ 'is-del': !getText(key) }">
          {{ getText(key) ?? '流程分类已被删除，请重新添加' }}
        </div>
        <div class="process">
          <div
            class="process-item"
            @click="handleDetail(item)"
            v-for="item of data[key]"
          >
            <div class="icon">
              <ProImage
                v-if="isImg(item.icon)"
                :width="24"
                :height="24"
                :src="item.icon"
                :preview="false"
              />
              <AIcon v-else :type="item.icon" :style="{ fontSize: '40px' }" />
            </div>
            <j-ellipsis line-clamp="2">
              <span class="title">{{ item.name }}</span>
            </j-ellipsis>
          </div>
        </div>
      </div>
      <div class="empty">
        <j-spin :spinning="loading" />
        <j-empty v-show="!Object.keys(data).length && !loading" />
      </div>
    </FullPage>
  </page-container>
</template>
<script setup>
import { groupBy } from 'lodash-es'
import { getList_api } from '@/api/process/initiate'
import { useClassified } from '@/hooks/useClassified'
import { isImg } from '@/utils/comm'

const { getText } = useClassified()

const router = useRouter()
const data = reactive({})
const loading = ref(true)
getList_api({
  paging: false,
  terms: [
    {
      value: 'enabled',
      termType: 'eq',
      column: 'state',
    },
  ],
}).then((res) => {
  Object.assign(data, groupBy(res.result, 'classifiedId'))
  loading.value = false
})

const handleDetail = (data) => {
  router.push({
    path: '/flow-engine/initiate/initiate-detail',
    query: {
      id: data.id,
      isDraft: false,
    },
  })
}
</script>
<style scoped lang="less">
.page {
  padding: 24px;

  .type-item {
    margin-bottom: 20px;

    .is-del {
      color: #e50012 !important;
    }
    .type-title {
      margin-bottom: 16px;
      font-size: 14px;
      font-weight: 600;
      line-height: 22px;
      color: #1d2129;
    }
    .process {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
      .process-item {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        width: 159px;
        height: 56px;
        border-radius: 4px;
        padding: 6px 12px;
        border: 1px solid #e5e8ef;
        line-height: 22px;
        .title {
          font-size: 16px;
          color: #1d2129;
        }
      }
    }
  }

  .empty {
    margin-top: 40px;
    text-align: center;
  }
}
</style>
