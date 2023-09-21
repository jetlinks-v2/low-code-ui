<template>
  <div class="content-files">
    <j-tabs v-model:activeKey="activeFile" hide-add type="editable-card" class="content-tabs" @edit="onEdit"
      @tabClick="select">
      <template #moreIcon>
        <AIcon type="MoreOutlined" />
      </template>
      <j-tab-pane v-for="item in files" :key="item.id" :closable="true">
        <template #tab>
          <span>
            <img :src="typeImages[item.type]" style="width: 20px;height: 20px;margin-right: 5px;">
            {{ item.title }}
          </span>
        </template>
        <Content :data="item" />
      </j-tab-pane>
    </j-tabs>

    <div class="content-module" v-if="activeData?.type === 'project' || activeData?.type === 'module'"
      :key="activeData.id">
      <ProjectEmpty v-if="activeData?.type === 'project' && activeData.children.length === 0" :data="activeData" />
      <Project v-else :data="activeData.children" />
    </div>

    <div class="footer">
      <j-scrollbar>
        <div class="items">
          <div v-for="(item, index) in path" class="item">
              <div class="icon"><img :src="typeImages[item.type]"></div>
              <div class="title" @click="onClick(item)">{{ item.title }}</div>
              <div v-if="path.length !== index + 1" class="path"> > </div>
          </div>
        </div>
      </j-scrollbar>
    </div>
  </div>
</template>

<script setup name="ContentTabs">
import { storeToRefs } from 'pinia'
import { useEngine, useProduct } from '@/store'
// import Tabs from '../Tabs/tabs.vue'
import Content from './content.vue'
import ProjectEmpty from '@/components/ProJect/Empty/index.vue'
import { providerImages, typeImages } from '@/components/ProJect/index'


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

const onClick = (data) => {
  engine.selectFile(data.id)
  engine.addFile(data)
}

watch(
  () => [activeFile.value, product.data],
  (val) => {
    // console.log('val',val)
    if (val) {
      activeData.value = product.getById(val[0])
      path.value = product.getParent(activeData.value)
      console.log('path',path.value)
    }
  },
  { deep: true, immediate: true }
)

</script>

<style scoped lang="less">
.content-files {
  //border-top: 1px solid #515665;
  //border-bottom: 1px solid #515665;
  height: calc(100% - 45px);
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
    height: calc(100% - 46px);
    background-color: rgb(255, 255, 255);
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 2;
    overflow: hidden;
  }

  .footer {
    border-top: 1px solid #D9D9D9;
    z-index: 3;
    height: 44px;
    line-height: 43px;
    font-size: 16px;
    width: 100%;
    display: flex;
    padding: 0 10px;
    user-select: none;

    .items {
      width: 100%;
      display: flex;

      .item {
        display: flex;
        white-space: nowrap;
        .icon{
          margin: 0 5px;
          width: 22px;
          height: 22px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .title{
          cursor: pointer;
          // &:hover{
          //   color: #7595f3;
          // }
        }

        .path {
          margin: 0 16px;
        }
      }
    }


  }
}
</style>
