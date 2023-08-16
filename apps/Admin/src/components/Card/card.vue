<template>
  <div class="card-warp" :style="warpStyle">
    <div :class="bodyClass" @click.stop="cardClick">
      <!--   左上状态值     -->
      <div class="card-type" v-if="slots.type" >
        <div class="card-type-text"><slot name="type"></slot></div>
      </div>
      <div class="card-content" :style="{paddingTop: slots.type ? '40px' : '30px'}">
        <div class="content-top-line" v-if="!slots.type"></div>
        <!--   右侧背景色     -->
        <div
          class="bg-gradient"
          :style="{
            background: `linear-gradient(to top, rgba(255,255,255, 1), rgba(255,255,255,0) 80%),
            linear-gradient(to right, rgba(${stateColor}, 0.03), rgba(${stateColor}, 0.03)),
            linear-gradient(to right, transparent, transparent 22%, rgba(${stateColor}, 0.03) 22%, rgba(${stateColor}, 0.03) 80%)
            `
          }"
        ></div>

        <div class="content-item">
          <!-- 图片 -->
          <div class="item-avatar">
            <slot name="img"> </slot>
          </div>
          <!-- 内容 -->
          <div class="item-body">
            <slot name="content"></slot>
          </div>
          <!-- 勾选 -->
          <Active v-show="active"/>
          <!-- 状态 -->
          <div v-if="showStatus" class="item-state" :style="{ backgroundColor: `rgba(${stateColor}, .1)`}">
            <div class="item-state-content">
              <BadgeStatus
                :status="status"
                :text="statusText"
                :statusNames="statusNames"
                :statusColor="statusColor"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
    <ResizeObserver :onResize="onResize">
      <div class="card-footer" v-if="showTool && actions?.length">
        <div :class="['card-button', item.key === 'delete' ? 'delete' : 'default']" v-for="item in myActions">
          <OtherActions
            v-if="item.key === 'others'"
            :actions="item.actions"
            :record="record"
          />

          <PermissionButton
            v-else-if="item.permissionProps"
            v-bind:="handleFunction(item.permissionProps)"
            :danger="item.key === 'delete'"
            style="width: 100%"
          >
            <template #icon v-if="item.icon || item.key === 'delete'">
              <AIcon :type="item.icon ? item.icon : 'DeleteOutlined'" />
            </template>
            <span v-if="item.key !== 'delete'">
              {{ item.text }}
            </span>
          </PermissionButton>
          <j-button v-else :icon="item.icon" @click="item.click" >
            {{ item.text }}
          </j-button>
        </div>
      </div>
    </ResizeObserver>
  </div>
</template>

<script setup name="Card">
import { BadgeProps, BadgeColors } from '../BadgeStatus'
import ResizeObserver from 'ant-design-vue/lib/vc-resize-observer';
import {isFunction, isObject, debounce, cloneDeep} from "lodash-es";
import Active from './active.vue'
import OtherActions from './otherActions.vue'
import { hexToRgb } from '@jetlinks/utils'

const props = defineProps({
  ...BadgeProps(),
  record: {
    type: Object,
    default: () => ({})
  },
  warpStyle: {
    type: Object,
    default: () => ({})
  },
  actions: {
    type: Array,
    default: () => []
  },
  showImg: {
    type: Boolean,
    default: true
  },
  showTool: {
    type: Boolean,
    default: true
  },
  showStatus: {
    type: Boolean,
    default: true
  },
  active: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false,
  },

})

const slots = useSlots();

const emit = defineEmits(['click'])

const bodyClass = computed(() => {
  return {
    'card-body': true,
    'active': props.active,
    'disabled': props.disabled
  }
})

const stateColor = computed(() => {
  const badgeColor = props.statusColor || BadgeColors
  const code = props.statusNames[props.status] || props.status
  const c = hexToRgb(badgeColor[code]) || badgeColor[code]

  return c || BadgeColors.default
})

const cardClick = () => {
  emit('click')
}

const myActions = ref([])

const handleFunction = (item) => {
  if (isFunction(item)) {
    return item(props.record)
  } else if (isObject(item)) {
    return item
  }
  return undefined
}

const onResize = debounce((e) => {
  const len = props.actions?.length || 0
  const hasDelete = props.actions.some(item => item.key === 'delete')
  const deleteWidth = hasDelete ? 60 : 0
  const max = e.width
  const maxLength = parseInt(String(max / 100))
  const widthCount = 100 * len + deleteWidth

  if (widthCount > max ) {
    const cloneActions = cloneDeep(props.actions)
    const newActions = cloneActions.splice(0, maxLength - 1)
    newActions.push({
      key: 'others',
      actions: cloneActions
    })
    myActions.value = newActions
  } else {
    myActions.value = props.actions
  }
}, 100)

</script>

<style scoped lang="less">
.card-warp {
  width: 100%;
  background-color: #fff;

  .card-body {
    position: relative;
    border: 1px solid #e6e6e6;
    overflow: hidden;
    cursor: pointer;

    &:hover {
      box-shadow: 0 0 24px rgba(#000, 0.1);
    }

    &.disabled {
      filter: grayscale(100%);
      cursor: not-allowed;
    }

    &.active {
      position: relative;
      border: 1px solid #2f54eb;
    }

    .card-type {
      position: absolute;
      top: 0;
      left: -15px;
      height: 32px;
      padding: 0 30px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 32px;
      background-color: rgba(0, 0, 0, 0.06);
      transform: skewX(-45deg);

      .card-type-text {
        display: flex;
        align-items: center;
        justify-content: center;
        transform: skewX(45deg);
      }
    }

    .card-content {
      position: relative;
      padding: 30px 12px 30px 30px;
      overflow: hidden;

      .content-item {
        display: flex;
      }

      .item-avatar {
        display: flex;
        margin-right: 16px;
        align-items: center;
      }

      .item-body {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        min-width: 0;
      }

      .item-state {
        position: absolute;
        top: 30px;
        right: -12px;
        display: flex;
        justify-content: center;
        width: 100px;
        padding: 2px 0;
        background-color: rgba(#5995f5, 0.15);
        transform: skewX(45deg);

        &.success {
          background-color: @success-color-deprecated-bg;
        }

        &.warning {
          background-color: rgba(#ff9000, 0.1);
        }

        &.error {
          background-color: rgba(#e50012, 0.1);
        }

        .item-state-content {
          transform: skewX(-45deg);
        }
      }

      .content-top-line {
        position: absolute;
        top: -2px;
        left: 40px;
        display: block;
        width: 15%;
        min-width: 64px;
        height: 4px;
        background-color: #8da1f4;
        border-radius: 0 0 16px 16px;
      }

      .bg-gradient {
        position: absolute;
        top: 0;
        right: -5%;
        height: 100%;
        width: calc(44.65% + 34px);
        transform: skewX(-15deg);
      }
    }
  }

  .card-footer {
    display: flex;
    margin-top: 8px;
    gap: 8px;

    .card-button {

      &.default {
        display: flex;
        min-width: 0;
        flex-grow: 1;
      }

      :deep(.ant-btn) {
        width: 100%;
        border-radius: 0;
        background: #f6f6f6;
        border: 1px solid #e6e6e6;
        color: #2f54eb;
      }

      &.delete {
        width: 60px;

        :deep(.ant-btn) {
          background: @error-color-deprecated-bg;
          border: 1px solid @error-color-outline;
        }


        span {
          color: @error-color !important;
        }

        &:hover {
          :deep(.ant-btn) {
            background: @error-color-hover;
          }
          span {
            color: #fff !important;
          }
        }

        &:active {
          background-color: @error-color-active;

          span {
            color: #fff !important;
          }
        }
      }
    }
  }
}
</style>
