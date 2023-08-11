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
              />
            </div>
          </div>
        </div>

      </div>
    </div>
    <ResizeObserver>
      <div class="card-footer" v-if="showTool && actions?.length">
        <div class="card-button" v-for="item in actions">

        </div>
      </div>
    </ResizeObserver>
  </div>
</template>

<script setup name="Card">
import Active from './active.vue'
import { BadgeProps, BadgeColors } from '../BadgeStatus'
import ResizeObserver from 'ant-design-vue/lib/vc-resize-observer';


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
  const code = props.statusNames[props.status] || props.status

  return BadgeColors[code] || BadgeColors.default
})

const cardClick = () => {
  emit('click')
}

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
}
</style>
