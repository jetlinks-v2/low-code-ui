<template>
  <div class="list-skeleton">
    <div class="left-menu">
      <j-badge :count="errorCount?.menuConfig">
        <div
          class="menus"
          ref="menuRef"
          @click="handleVisible('MenuConfigVisible')"
        >
          菜单配置
        </div>
      </j-badge>
      <div class="menus" ref="previewRef" @click="emits('goPreview')">预览</div>
    </div>
    <div class="right-skeleton">
      <div class="skeleton-content">
        <div class="search-skeleton">
          <j-row justify="space-between">
            <j-col :span="8">
              <j-space>
                <j-badge :count="errorCount?.filterModule">
                  <j-skeleton-button
                    size="large"
                    ref="ref1"
                    class="config-item filter"
                    :class="{
                      'config-done': configDone?.filterModule,
                      animation:
                        !configDone?.filterModule && !visibles.GuideVisible,
                    }"
                    @click="handleVisible('FilterModuleVisible')"
                  />
                </j-badge>
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
              <j-badge :count="errorCount?.btn">
                <j-skeleton-button
                  class="config-item btn"
                  size="large"
                  ref="ref2"
                  :class="{
                    'config-done': configDone?.btn,
                    animation: !configDone?.btn && !visibles.GuideVisible,
                  }"
                  @click="handleVisible('OperationBtnsVisible')"
                />
              </j-badge>
            </j-col>
            <j-col :span="2">
              <j-badge :count="errorCount?.listForm">
                <j-space
                  ref="ref6"
                  class="config-item type"
                  :class="{
                    'config-done': configDone?.ListForm,
                    animation: !configDone?.ListForm && !visibles.GuideVisible,
                  }"
                  @click="handleVisible('ListFormVisible')"
                >
                  <j-skeleton-input class="width-32" />
                  <j-skeleton-input class="width-32" />
                </j-space>
              </j-badge>
            </j-col>
          </j-row>
          <j-row
            :gutter="20"
            class="table-skeleton-row"
          >
            <j-col :span="20">
              <j-badge :count="errorCount?.listData" style="width: 100%" :numberStyle="{
                  width: 'auto',
                }">
                <j-skeleton-input
                  size="large"
                  ref="ref3"
                  class="config-item column-data skeletion-input"
                  :class="{
                    'config-done': configDone?.listData,
                    animation: !configDone?.listData && !visibles.GuideVisible,
                  }"
                  @click="handleVisible('ListDataVisible')"
                />
              </j-badge>
              <j-skeleton-input
                class="skeletion-input"
                size="large"
                v-for="item in 8"
              />
            </j-col>
            <j-col :span="4">
              <j-badge
                :count="errorCount?.actions"
                style="width: 100%"
                :numberStyle="{
                  width: 'auto',
                }"
              >
                <j-skeleton-input
                  size="large"
                  ref="ref4"
                  @click="handleVisible('OperationColumnsVisible')"
                  class="config-item column-operation skeletion-input"
                  :class="{
                    'config-done': configDone?.actions,
                    animation: !configDone?.actions && !visibles.GuideVisible,
                  }"
                />
              </j-badge>
              <j-skeleton-input
                class="skeletion-input"
                size="large"
                v-for="item in 8"
              />
            </j-col>
          </j-row>
          <j-row justify="end" style="margin-top: 20px">
            <j-col :span="10">
              <j-badge
                :count="errorCount?.pagination"
                style="width: 100%"
                :numberStyle="{
                  width: 'auto',
                }"
              >
                <j-skeleton-input
                  style="width: 100%"
                  size="large"
                  ref="ref5"
                  class="config-item pagination"
                  :class="{
                    'config-done': configDone?.pagination,
                    animation: !configDone?.pagination && !visibles.GuideVisible,
                  }"
                  @click="handleVisible('PagingConfigVisible')"
                />
              </j-badge>
            </j-col>
          </j-row>
        </div>
      </div>
    </div>
    <Guide :stepList="steps" v-model:open="visibles.GuideVisible" />
  </div>
</template>

<script setup lang="ts" name="listSkeleton">
import Guide from '../Guide/index.vue'
import type { GuideProps } from '../Guide/type'

interface Emit {
  (e: 'visibles', key: string, value: boolean): void
  (e: 'goPreview'): void
}

const emits = defineEmits<Emit>()
const props = defineProps({
  visibles: {
    type: Object as PropType<Record<string, boolean>>,
    default: false,
  },
  dataBindRef: {
    type: Object,
  },
  errorCount: {
    type: Object,
  },
  configDone: {
    type: Object,
  },
})

const handleVisible = (key: string) => {
  emits('visibles', key, true)
}

const ref1 = ref()
const ref2 = ref()
const ref3 = ref()
const ref4 = ref()
const ref5 = ref()
const ref6 = ref()
const menuRef = ref()
const steps = ref<GuideProps['stepsList']>([])

watchEffect(() => {
  steps.value = [
    {
      title: '步骤1',
      description: '选择后端功能作为列表页的数据来源',
      placement: 'bottom',
      target: () => [
        {
          el: props.dataBindRef && props.dataBindRef.$el,
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
  console.log(props.dataBindRef)
})

// watch(() => props.visibles, () => {
//   console.log(props.visibles);
// }, {immediate: true, deep: true})
</script>

<style scoped lang="less">
@filterBg: #fbd9ab;
@btnBg: #bbffff;
@typeBg: #e1c1ff;
@columnDataBg: #e5fcc1;
@columnOperationBg: #ffffaf;
@paginationBg: #f8cfd4;

.list-skeleton {
  height: calc(100% - 8vh);
  width: 100%;
  display: flex;
  .mb-50 {
    margin-bottom: 50;
  }
  .width-32 {
    width: 32px;
  }
  .table-skeleton-row {
    height: 60%; 
    overflow: hidden; 
    padding: 20px
  }
  .left-menu {
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    padding: 10px 0 0 10px;
    .menus {
      height: 120px;
      writing-mode: vertical-lr;
      width: 50px;
      background-color: #f2f2f2;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      cursor: pointer;
    }
  }
  .right-skeleton {
    flex: 1;
    padding: 10px;
    .skeletion-input {
      width: 100%;
      margin: 8px 0
    }
    .skeleton-content {
      background-color: #f2f2f2;
      padding: 10px;
      height: 100%;
    }
    .search-skeleton {
      padding: 20px;
      margin: 20px 0;
      background-color: #ffffff;
    }
    .table-skeleton {
      padding: 20px;
      margin: 20px 0;
      background-color: #ffffff;
      height: 100%;
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
