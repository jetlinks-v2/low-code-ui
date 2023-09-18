<template>
  <div class="list-skeleton">
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
                <j-skeleton-input style="width: 200px;" size="large" />
              </j-space>
            </j-col>
            <j-col :span="8">
              <j-space>
                <j-skeleton-button size="large" />
                <j-skeleton-button size="large" />
                <j-skeleton-button size="large" />
                <j-skeleton-input style="width: 136px;" size="large" />
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
                  @click="handleVisible('ListFormVisible')"
                >
                  <j-skeleton-input ref="ref6" class="width-32 config-item type" :class="{
                    'config-done': configDone?.ListForm,
                    animation: !configDone?.ListForm && !visibles.GuideVisible,
                  }"/>
                  <j-skeleton-input ref="ref7" class="width-32 config-item type" :class="{
                    'config-done': configDone?.ListForm,
                    animation: !configDone?.ListForm && !visibles.GuideVisible,
                  }"/>
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
                  class="config-item column-data skeleton-input"
                  :class="{
                    'config-done': configDone?.listData,
                    animation: !configDone?.listData && !visibles.GuideVisible,
                  }"
                  @click="handleVisible('ListDataVisible')"
                />
              </j-badge>
              <j-skeleton-input
                class="skeleton-input"
                size="large"
                v-for="item in 12"
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
                  class="config-item column-operation skeleton-input"
                  :class="{
                    'config-done': configDone?.actions,
                    animation: !configDone?.actions && !visibles.GuideVisible,
                  }"
                />
              </j-badge>
              <j-skeleton-input
                class="skeleton-input"
                size="large"
                v-for="item in 12"
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
                  style="width: 100%; height: 40px;"
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
    <div class="left-menu">
      <div class="menus" ref="previewRef" @click="emits('goPreview')">
        <AIcon type="CaretRightOutlined" style="font-size: 20px;" />
      </div>
      <j-badge :count="errorCount?.menuConfig" :offset="[-32, 0]">
        <div
          class="menus"
          ref="menuRef"
          @click="handleVisible('MenuConfigVisible')"
        >
          <AIcon type="MenuUnfoldOutlined" style="font-size: 20px;" />
        </div>
      </j-badge>
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
const ref7 = ref()
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
      placement: 'top',
      target: () => [
        {
          el: ref3.value && ref3.value.$el,
          backgroundColor: '#E7E8EA',
          overText: '数据列表头',
        },
        {
          el: ref1.value && ref1.value.$el,
          backgroundColor: '#E7E8EA',
          overText: '筛选项',
        },
        {
          el: ref2.value && ref2.value.$el,
          backgroundColor: '#E7E8EA',
          overText: '操作按钮',
        },
        {
          el: ref4.value && ref4.value.$el,
          backgroundColor: '#E7E8EA',
          overText: '操作列',
        },
        {
          el: ref5.value && ref5.value.$el,
          backgroundColor: '#E7E8EA',
          overText: '分页器',
        },
        {
          el: ref6.value && ref6.value.$el,
          backgroundColor: '#E7E8EA',
          overText: '展示格式',
        },
        {
          el: ref7.value && ref7.value.$el,
          backgroundColor: '#E7E8EA',
          overText: '展示格式',
        },
      ],
    },
    {
      title: '步骤3',
      description: '如果该页面需要作为系统菜单，请在这里配置基本信息',
      placement: 'left',
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
@filterBg: #C3D1FF;
@btnBg: #C3D1FF;
@typeBg: #C3D1FF;
@columnDataBg: #C3D1FF;
@columnOperationBg: #C3D1FF;
@paginationBg: #C3D1FF;

.list-skeleton {
  height: calc(100% - 70px);
  width: 100%;
  display: flex;
  .mb-50 {
    margin-bottom: 50;
  }
  .width-32 {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .left-menu {
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    width: 44px;
    padding: 10px 0 0 10px;
    .menus {
      width: 28px;
      height: 28px;
      width: 28px;
      height: 28px;
      background-color: #F6F7F9;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      cursor: pointer;
    }
  }
  .right-skeleton {
    flex: 1;
    padding: 24px;
    .skeleton-input {
      border-radius: 4px;
      width: 100%;
      margin-bottom: 2px;
    }
    .skeleton-content {
      height: 100%;
    }
    .search-skeleton {
      padding: 20px;
      margin-bottom: 16px;
      background-color: #ffffff;
      border-radius: 8px;
    }
    .table-skeleton {
      padding: 20px;
      margin-top: 20px;
      background-color: #ffffff;
      height: 85%;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      .table-skeleton-row {
        overflow: hidden; 
        padding: 20px 0;
        flex: 1;
      }
    }
    .pagination-skeleton {
      padding: 20px;
      background-color: #ffffff;
    }
  }

  .config-item {
    cursor: pointer;
    border-radius: 4px;
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
:deep(.ant-skeleton-input) {
  line-height: 40px;
}
:deep(.ant-skeleton-button, .ant-skeleton-input) {
  border-radius: 4px;
}
</style>
