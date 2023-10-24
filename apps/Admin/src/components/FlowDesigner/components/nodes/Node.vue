<!-- 节点 -->
<template>
  <div
    :class="{
      node: true,
      root: isRoot || !show,
      'node-error-state': showError,
      active,
    }"
    :style="style"
  >
    <div
      v-if="show"
      @click="emits('selected')"
      :class="{ 'node-body': true, error: showError }"
    >
      <div
        class="node-body-left"
        :style="{ display: readOnly ? 'none' : '' }"
        @click="emits('leftMove')"
        v-if="level > 1"
      >
        <AIcon type="LeftOutlined" />
      </div>
      <div>
        <div
          class="node-body-header"
          :style="{ 'background-color': headerBgc }"
        >
          <div class="header-left">
            <AIcon
              :type="headerIcon"
              style="font-size: 12px"
              v-if="(headerIcon || '') !== ''"
            />
            <j-ellipsis class="name">{{ title }}</j-ellipsis>
          </div>
          <AIcon
            type="CloseCircleFilled"
            v-if="!isRoot"
            @click="emits('delNode')"
            :style="{ display: readOnly ? 'none !important' : '' }"
          />
        </div>
        <div class="node-body-content">
          <span class="placeholder" v-if="(content || '').trim() === ''">
            {{ placeholder }}
          </span>
          <j-ellipsis v-else>{{ content }}</j-ellipsis>
        </div>
        <div class="node-error" v-if="showError">
          <j-tooltip>
            <template #title>{{ errorInfo }}</template>
            <AIcon type="WarningOutlined" />
          </j-tooltip>
        </div>
      </div>
      <div
        class="node-body-right"
        :style="{ display: readOnly ? 'none' : '' }"
        @click="emits('rightMove')"
        v-if="level < size"
      >
        <AIcon type="RightOutlined" />
      </div>
    </div>
    <div class="node-footer">
      <div class="btn" :class="{ readonly: readOnly }">
        <insert-button @insertNode="(type) => emits('insertNode', type)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Node">
import InsertButton from '../InsertButton.vue'

const emits = defineEmits([
  'selected',
  'delNode',
  'insertNode',
  'leftMove',
  'rightMove',
])
const props = defineProps({
  //是否为根节点
  isRoot: {
    type: Boolean,
    default: false,
  },
  //是否显示节点体
  show: {
    type: Boolean,
    default: true,
  },
  //节点内容区域文字
  content: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '标题',
  },
  placeholder: {
    type: String,
    default: '请设置',
  },
  //头部图标
  headerIcon: {
    type: String,
    default: '',
  },
  //头部背景色
  headerBgc: {
    type: String,
    default: '#576a95',
  },
  //是否显示错误状态
  showError: {
    type: Boolean,
    default: false,
  },
  errorInfo: {
    type: String,
    default: '无信息',
  },
  style: {
    type: Object,
    default: () => ({}),
  },
  // 是否是分支节点
  isBranchNode: {
    type: Boolean,
    default: false,
  },
  //索引位置
  level: {
    type: Number,
    default: 1,
  },
  //条件数
  size: {
    type: Number,
    default: 0,
  },
  // 只读模式
  readOnly: {
    type: Boolean,
    default: false,
  },
  // 节点激活状态
  active: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="less" scoped>
.root {
  &:before {
    display: none !important;
  }
}
.node-error-state {
  .node-body {
    box-shadow: 0px 0px 5px 1px #f56c6c !important;
  }
}
.node {
  width: 220px;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    top: -12px;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    width: 0;
    border-style: solid;
    border-width: 8px 6px 4px;
    border-color: #cacaca transparent transparent;
    background: #f5f5f7;
  }
  &.active {
    //  节点上方的三角形 激活高亮状态
    // &::before {
    //   border-color: #3056df transparent transparent;
    // }
    .node-body {
      border: 2px solid #3056df;
    }
    //  节点下方的连接线 激活高亮状态
    // .node-footer::before {
    //   background-color: #3056df;
    // }
  }
  .node-body {
    // overflow: hidden;
    cursor: pointer;
    min-height: 80px;
    max-height: 120px;
    position: relative;
    border-radius: 5px;
    background-color: white;
    box-shadow: 0px 0px 5px 0px #d8d8d8;

    &:hover {
      box-shadow: 0px 0px 3px 0px #1890ff;
      .node-body-left,
      .node-body-right {
        .anticon {
          display: block !important;
        }
      }
      .node-body-header {
        .anticon {
          display: inline;
          font-size: medium;
        }
      }
    }
    .node-body-left,
    .node-body-right {
      display: flex;
      align-items: center;
      position: absolute;
      height: 100%;
      top: 0;
      .anticon {
        display: none;
      }
      &:hover {
        background-color: #ececec;
      }
    }
    .node-body-left {
      left: 0;
    }
    .node-body-right {
      right: 0;
    }
    .node-body-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      padding: 5px 15px;
      color: white;
      font-size: xx-small;
      .header-left {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .anticon-close-circle {
        display: none;
      }
      .name {
        height: 14px;
        width: 150px;
        display: inline-block;
      }
    }
    .node-body-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px;
      color: #656363;
      font-size: 14px;
      .placeholder {
        color: #8c8c8c;
      }
    }
    .node-error {
      position: absolute;
      right: -30px;
      top: 30px;
      font-size: 20px;
      color: #f56c6c;
    }
  }

  .node-footer {
    position: relative;
    .btn {
      width: 100%;
      display: flex;
      padding: 20px 0 32px;
      justify-content: center;
      &:deep(.ant-btn) {
        border-radius: 50%;
        background: #1890ff;
        border-color: #1890ff;
      }
      &.readonly:deep(.ant-btn) {
        display: none;
      }
    }
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
      margin: auto;
      width: 2px;
      height: 100%;
      background-color: #cacaca;
    }
  }
}
</style>
