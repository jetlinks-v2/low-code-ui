<template>
  <div class="list-page">
    <DataBind ref="dataBindRef" v-model:open="open" @valid="handleValid" @modify="dataBind.data.function = ''"/>
    <div style="display: flex; height: 100%; width: 100%">
      <div class="left-menu">
        <div class="menus" ref="menuRef" @click="MenuConfigVisible = true">菜单配置</div>
        <div class="menus" ref="previewRef" @click="goPreview">预览</div>
      </div>
      <div class="right-skeleton">
        <div class="search-skeleton">
          <j-row justify="space-between">
            <j-col :span="8">
              <j-space>
                <j-skeleton-button
                  size="large"
                  ref="ref1"
                  class="config-item filter"
                  @click="FilterModuleVisible = true"
                />
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
              <j-badge :count="btnTreeRef?.errorList.length">
                <j-skeleton-button
                  class="config-item btn"
                  size="large"
                  ref="ref2"
                  :class="{ 'config-done': btnTreeRef?.columnsTree.length, 'animation': !btnTreeRef?.columnsTree.length }"
                  @click="OperationBtnsVisible = true"
                />
              </j-badge>
            </j-col>
            <j-col :span="2">
              <j-space
                ref="ref6"
                class="config-item type"
                @click="ListFormVisible = true"
              >
                <j-skeleton-input style="width: 32px" />
                <j-skeleton-input style="width: 32px" />
              </j-space>
            </j-col>
          </j-row>
          <j-row :gutter="20">
            <j-col :span="20">
              <j-skeleton-input
                style="width: 100%; margin: 8px 0"
                size="large"
                ref="ref3"
                class="config-item column-data"
                @click="ListDataVisible = true"
              />
              <j-skeleton-input
                style="width: 100%; margin: 8px 0"
                size="large"
                v-for="item in 8"
              />
            </j-col>
            <j-col :span="4">
              <j-badge
                :count="columnsRef?.errorList.length"
                style="width: 100%"
                :numberStyle="{
                  width: 'auto',
                }"
              >
                <j-skeleton-input
                  style="width: 100%; margin: 8px 0"
                  size="large"
                  ref="ref4"
                  @click="OperationColumnsVisible = true"
                  class="config-item column-operation"
                  :class="{ 'config-done': columnsRef?.columnsTree.length }"
                />
              </j-badge>
              <j-skeleton-input
                style="width: 100%; margin: 8px 0"
                size="large"
                v-for="item in 8"
              />
            </j-col>
          </j-row>
          <j-row justify="end" style="margin-top: 20px">
            <j-col :span="10">
              <j-skeleton-input
                style="width: 100%"
                size="large"
                ref="ref5"
                class="config-item pagination"
                @click="PagingConfigVisible = true"
              />
            </j-col>
          </j-row>
        </div>
      </div>
    </div>
    <Guide :stepList="steps" v-model:open="open" />
    <OperationColumns
      v-model:open="OperationBtnsVisible"
      type="btns"
      ref="btnTreeRef"
    />
    <OperationColumns
      v-model:open="OperationColumnsVisible"
      type="columns"
      ref="columnsRef"
    />
    <FilterModule v-model:open="FilterModuleVisible" />
    <ListData v-model:open="ListDataVisible" />
    <ListForm v-model:open="ListFormVisible" />
    <PagingConfig v-model:open="PagingConfigVisible" />
    <MenuConfig v-model:open="MenuConfigVisible" />
    <j-button> </j-button>
  </div>
</template>

<script setup lang="ts" name="ListPage">
import Guide from './Guide/index.vue'
import DataBind from './DataBind/index.vue'
import FilterModule from './FilterModule/index.vue'
import ListData from './ListData/index.vue'
import ListForm from './ListForm/index.vue'
import PagingConfig from './PagingConfig/index.vue'
import MenuConfig from './MenuConfig/index.vue'
import type { GuideProps } from './Guide/type'
import OperationColumns from './Operation/index.vue'

const ref1 = ref()
const ref2 = ref()
const ref3 = ref()
const ref4 = ref()
const ref5 = ref()
const ref6 = ref()
const dataBindRef = ref()
const menuRef = ref()
const previewRef = ref()

const open = ref(false)
const OperationBtnsVisible = ref(false)
const OperationColumnsVisible = ref(false)
const FilterModuleVisible = ref(false)
const ListDataVisible = ref(false)
const ListFormVisible = ref(false)
const PagingConfigVisible = ref(false)
const MenuConfigVisible = ref(false)

const goPreview = () => {
  router.push('/preview')
}
const steps: GuideProps['stepsList'] = [
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
    ],
  },
]


const btnTreeRef = ref()

const columnsRef = ref()
/**
 * 校验
 */
const handleValid = async () => {
  const res = await btnTreeRef.value?.valid()
  columnsRef.value?.valid()
}


const dataBind = ref({
  data: {
    function: '',
    command: '',
  }
})
provide('dataBind', dataBind)

</script>

<style scoped lang="less">
@filterBg: #fbd9ab;
@btnBg: #bbffff;
@typeBg: #e1c1ff;
@columnDataBg: #e5fcc1;
@columnOperationBg: #ffffaf;
@paginationBg: #f8cfd4;

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
      cursor: pointer;
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

  .config-item {
    cursor: pointer;
    &.animation {
      animation: blink 1s infinite;
      &.filter {
        background-color: @filterBg;
      }
      &.btn {
        background-color: @btnBg;
      }
      &.type {
        background-color: @typeBg;
      }
      &.column-data {
        background-color: @columnDataBg;
      }
      &.column-operation {
        background-color: @columnOperationBg;
      }
      &.pagination {
        background-color: @paginationBg;
      }
    }
    &.filter:hover {
      background-color: @filterBg !important;
    }
    &.btn:hover {
      background-color: @btnBg !important;
    }
    &.type:hover {
      background-color: @typeBg !important;
    }
    &.column-data:hover {
      background-color: @columnDataBg !important;
    }
    &.column-operation:hover {
      background-color: @columnOperationBg !important;
    }
    &.pagination:hover {
      background-color: @paginationBg !important;
    }
  }
}
.config-done {
  &.filter {
    background-color: @filterBg;
  }
  &.btn {
    background-color: @btnBg;
  }
  &.type {
    background-color: @typeBg;
  }
  &.column-data {
    background-color: @columnDataBg;
  }
  &.column-operation {
    background-color: @columnOperationBg;
  }
  &.pagination {
    background-color: @paginationBg;
  }
}

@keyframes blink {
  50% {
    background-color: transparent;
  }
}
</style>
