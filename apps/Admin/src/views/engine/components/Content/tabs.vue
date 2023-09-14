<template>
  <div class="content-files">
    <j-tabs v-model:activeKey="activeFile" hide-add type="editable-card" class="content-tabs" @edit="onEdit"
      @tabClick="select">
      <template #moreIcon>
        <AIcon type="MoreOutlined" />
      </template>
      <j-tab-pane v-for="item in files" :key="item.id" :tab="item.title" :closable="true">
        <Content :data="item" />
      </j-tab-pane>
    </j-tabs>

    <div class="content-module" v-if="activeData?.type === 'project' || activeData?.type === 'module'"
      :key="activeData.id">
      <ProjectEmpty v-if="activeData?.type === 'project'" :data="activeData" />
      <Project v-else :data="activeData.children" />
    </div>

    <div class="footer">
      <div v-for="(item, index) in path" class="item">
        <div>
          <img :src="providerImages[item.type]">
          {{ item.title }}
        </div>
        <div v-if="path.length !== index + 1" class="path"> > </div>
      </div>
    </div>
  </div>
</template>

<script setup name="ContentTabs">
import { storeToRefs } from 'pinia'
import { useEngine, useProduct } from '@/store'
// import Tabs from '../Tabs/tabs.vue'
import Content from './content.vue'
import ProjectEmpty from '@/components/ProJect/Empty/index.vue'
import { providerImages } from '@/components/ProJect/index'


const engine = useEngine()
const product = useProduct()
const path = ref()

const { files, activeFile } = storeToRefs(engine)
const activeData = ref()

const onEdit = (targetKey) => {
  engine.removeFile(targetKey)
}

const select = (key) => {
  engine.selectFile(key)
}

watch(
  () => activeFile.value,
  (val) => {
    if (val) {
      activeData.value = product.getById(val)
      path.value = product.getParent(activeData.value).map((item) => ({
        title: item.title,
        type: item.type
      }))
      console.log('data-------', activeData.value)
    }
  },
  { deep: true, immediate: true }
)

</script>

<style scoped lang="less">
.content-files {
  //border-top: 1px solid #515665;
  //border-bottom: 1px solid #515665;
  height: calc(100% - 40px);
  user-select: none;

  .content-tabs {
    height: 100%;
    z-index: 1;

    &>:deep(.ant-tabs) {
      height: 100%;

      &>.ant-tabs-content-holder {
        height: calc(100% - 36px);

        &>.ant-tabs-content {
          height: 100%;
        }
      }

      &>.ant-tabs-nav {
        margin: 0;

        &>.ant-tabs-nav-operations {
          padding: 4px;

          .ant-tabs-nav-more {
            //background-color: #21252b !important;
            //color: #fdd835;
            padding: 2px 8px;
          }
        }

        &>.ant-tabs-nav-wrap {
          &>.ant-tabs-nav-list {
            &>.ant-tabs-tab {
              border-radius: 0 !important;
              margin-left: 0px !important;

              &:not(:first-child) {
                margin-left: 2px !important;
              }

              &.ant-tabs-tab-active {
                background-color: #d6e4ff !important;

                .ant-tabs-tab-btn {
                  color: #6a6a6a !important;
                }
              }
            }
          }
        }

      }
    }

  }

  .content-module {
    height: calc(100% - 100px);
    background-color: rgb(255, 255, 255);
    position: absolute;
    top: 60px;
    width: calc(100% - 320px);
    z-index: 2;
  }

  .footer {
    border: 1px solid #D9D9D9;
    z-index: 3;
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    display: flex;
    padding-left: 10px;

    .item {
      display: flex;
      .path{
        margin: 0 16px;
      }
    }
  }
}
</style>
