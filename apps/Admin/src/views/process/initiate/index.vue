<!-- 发起流程 -->
<template>
  <page-container>
    <FullPage class="page">
      <div class="type-item" v-for="j of list">
        <div v-if="getText(j.key)" class="type-title">
          {{ getText(j.key) }}
        </div>
        <div v-else class="type-title-del">
          <div>
            流程分类已被删除, 请 <span @click="handleAdd(j.key)">重新添加</span>
          </div>
        </div>
        <div class="process">
          <j-card
            hoverable
            class="process-item"
            @click="handleDetail(item)"
            v-for="item of j[j.key]"
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
          </j-card>
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
import { useMenuStore } from '@/store'

const menu = useMenuStore()
const { getText, classified } = useClassified()
const data = reactive({})
const loading = ref(true)
getList_api({
  paging: false,
  sorts: [{ name: 'createTime', order: 'desc' }],
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

const list = computed(() => {
  return Object.keys(data)
    ?.map((j) => {
      const item = classified.value.find((k) => k.value === j)
      return { [j]: data[j], ordinal: item?.extra?.ordinal, key: j }
    })
    ?.sort((a, b) => a.ordinal - b.ordinal)
})

const handleDetail = (data) => {
  menu.jumpPage('process/initiate/Detail', {
    query: {
      id: data.id,
      isDraft: false,
    },
  })
}

const handleAdd = (id) => {
  // 字典新增
  // menu.jumpPage('process/initiate/Detail',{
  //   query: {
  //     id: id,
  //   },
  // })
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
    .type-title-del {
      margin-bottom: 16px;
      font-size: 14px;
      line-height: 18px;
      color: #333333;
      > div > span {
        cursor: pointer;
        color: #315efb;
      }
    }
    .process {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
      .process-item {
        border: 1px solid #e5e8ef;
        :deep(.ant-card-body) {
          cursor: pointer;
          display: flex;
          justify-content: start;
          align-items: center;
          gap: 8px;
          width: 159px;
          height: 56px;
          border-radius: 4px;
          padding: 6px 12px;
          // border: 1px solid #e5e8ef;
          line-height: 22px;
        }
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
