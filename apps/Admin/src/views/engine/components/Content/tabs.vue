<template>
  <div class="content-files">
<!--    <j-tabs v-model:activeKey="activeFile" hide-add type="editable-card" @edit="onEdit">-->
<!--      <j-tab-pane v-for="item in files" :key="item.id" :tab="item.title" :closable="true">-->
<!--        <Content-->
<!--          v-bind="item"-->
<!--        />-->
<!--      </j-tab-pane>-->
<!--    </j-tabs>-->
    <Tabs
      v-model:activeKey="activeFile"
      :options="files"
      @edit="onEdit"
      @select="select"
    />
    <Content/>
  </div>
</template>

<script setup name="ContentTabs">
import { storeToRefs } from 'pinia'
import { useEngine } from '@/store'
import Tabs from '../Tabs/tabs.vue'
import Content from './content.vue'

const engine = useEngine()

const { files, activeFile } = storeToRefs(engine)

const onEdit = (targetKey) => {
  engine.removeFile(targetKey)
}

const select = (key) => {
  engine.selectFile(key)
}

</script>

<style scoped lang="less">
.content-files {
  //border-top: 1px solid #515665;
  //border-bottom: 1px solid #515665;

  user-select: none;

  :deep(.ant-tabs-nav) {
    margin: 0;

    .ant-tabs-tab {
      border-radius: 0 !important;
      background-color: #21252b !important;
      color: #f8f8f8 !important;
      margin: 0 !important;

      &:hover {
        background-color: #323844 !important;
      }

      &.ant-tabs-tab-active {
        background-color: #3d424b !important;
      }

      .anticon-close {
        color: #f8f8f8 !important;
      }
    }

    .ant-tabs-nav-wrap {
      background-color: #21252b;
    }

    .ant-tabs-nav-more {
      background-color: #21252b !important;
      color: #fdd835;
    }
  }
}
</style>
