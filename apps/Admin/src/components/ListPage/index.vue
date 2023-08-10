<template>
  <div class="list-page">
    <DataBind ref="dataBindRef" v-model:open="open" />
    <div style="display: flex; height: 100%; width: 100%">
      <div class="left-menu">
        <div class="menus" ref="menuRef">菜单配置</div>
        <div class="menus" ref="previewRef">预览</div>
      </div>
      <div class="right-skeleton">
        <div class="search-skeleton">
          <j-row justify="space-between">
            <j-col :span="8">
              <j-space>
                <j-skeleton-button size="large" ref="ref1" style="background-color: aqua;"/>
                <j-skeleton-button size="large" />
                <j-skeleton-input style="width: 200px" size="large" />
              </j-space>
            </j-col>
            <j-col :span="8">
              <j-space size="large">
                <j-space>
                  <j-skeleton-button size="large" />
                  <j-skeleton-button size="large" />
                  <j-skeleton-button size="large" />
                </j-space>
                <j-skeleton-button size="large" />
              </j-space>
            </j-col>
          </j-row>
        </div>
        <div class="table-skeleton">
          <j-row justify="space-between" align="middle">
            <j-col :span="4">
              <j-skeleton-button size="large" ref="ref2"/>
            </j-col>
            <j-col :span="2">
              <j-space ref="ref6">
                <j-skeleton-input style="width: 32px" />
                <j-skeleton-input style="width: 32px" ref="test"/>
              </j-space>
            </j-col>
          </j-row>
          <j-row :gutter="20">
            <j-col :span="18">
              <j-skeleton-input
                style="width: 100%; margin: 8px 0"
                size="large"
                ref="ref3"
              />
              <j-skeleton-input
                style="width: 100%; margin: 8px 0"
                size="large"
                v-for="item in 8"
              />
            </j-col>
            <j-col :span="6">
              <j-skeleton-input
                style="width: 100%; margin: 8px 0"
                size="large"
                ref="ref4"
              />
              <j-skeleton-input
                style="width: 100%; margin: 8px 0"
                size="large"
                v-for="item in 8"
              />
            </j-col>
          </j-row>
          <j-row justify="end" style="margin-top: 20px">
            <j-col :span="10">
              <j-skeleton-input style="width: 100%" size="large" ref="ref5" />
            </j-col>
          </j-row>
        </div>
      </div>
    </div>
    <Guide :stepList="steps" v-model:open="open"/>
  </div>
</template>

<script setup lang="ts" name="ListPage">
import Guide from './Guide/index.vue'
import DataBind from './DataBind/index.vue';
import type { GuideProps } from './Guide/type';

const ref1 = ref()
const ref2 = ref()
const ref3 = ref()
const ref4 = ref()
const ref5 = ref()
const ref6 = ref()
const dataBindRef = ref()
const menuRef = ref()
const previewRef = ref()
const test = ref()

const open = ref(false)

const steps:GuideProps['stepsList'] = [
  {
    title: '步骤1',
    description: '选择后端功能作为列表页的数据来源',
    placement: 'bottom',
    target: () => [
      {
        el: dataBindRef.value && dataBindRef.value.$el,
      },
    ],
  },
  {
    title: '步骤2',
    description: '不同色块代表列表页的不同功能，你可以根据业务需要自由选配',
    placement: 'right',
    target: () => [
      {
        el: ref1.value && ref1.value.$el,
        backgroundColor: '#fbd9ab',
        overText: '筛选项',
      },
      {
        el: ref2.value && ref2.value.$el,
        backgroundColor: '#bbffff',
        overText: '操作按钮',
      },
      {
        el: ref3.value && ref3.value.$el,
        backgroundColor: '#e5fcc1',
        overText: '数据列表头',
      },
      {
        el: ref4.value && ref4.value.$el,
        backgroundColor: '#ffffaf',
        overText: '操作列',
      },
      {
        el: ref5.value && ref5.value.$el,
        backgroundColor: '#f8cfd4',
        overText: '分页器',
      },
      {
        el: ref6.value && ref6.value.$el,
        backgroundColor: '#e2c2fe',
        overText: '展示格式',
      },
    ],
  },
  {
    title: '步骤3',
    description: '如果该页面需要作为系统菜单，请在这里配置基本信息',
    placement: 'right',
    target: () => [
      {
        el: menuRef.value,
      },
    ]
  },
  {
    title: '步骤4',
    description: '如果该页面需要作为系统菜单，请在这里配置基本信息',
    placement: 'right',
    target: () => [
      {
        el: previewRef.value,
      },
    ]
  },
]
</script>

<style scoped lang="less">
.list-page {
  height: 100%;
  .left-menu {
    background-color: #ffffff;
    writing-mode: vertical-lr;
    display: flex;
    .menus {
      height: 120px;
      width: 50px;
      background-color: #f2f2f2;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 10px;
    }
  }
  .right-skeleton {
    flex: 1;
    padding: 10px;
    .search-skeleton {
      padding: 20px;
      margin: 20px 0;
      background-color: #ffffff;
    }
    .table-skeleton {
      padding: 20px;
      margin: 20px 0;
      background-color: #ffffff;
    }
    .pagination-skeleton {
      padding: 20px;
      background-color: #ffffff;
    }
  }
}
.animation {
  animation: blink 2s infinite;
  @keyframes blink {
    0% {
      background-color: rgba(188, 242, 242, 1);
    }
    50% {
      background-color: rgba(188, 242, 242, 0);
    }
    100% {
      background-color: rgba(188, 242, 242, 1);
    }
  }
}
</style>
