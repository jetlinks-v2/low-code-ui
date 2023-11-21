<template>
  <div class="drag-box" ref="dragBox" :style="style" >
    <slot></slot>
    <div :class="lineClass" ref="dragBoxLine"></div>
  </div>
</template>

<script setup name="DragBox">
import { useDragBox } from '@/hooks'

const props = defineProps({
  position: {
    type: String,
    default: 'left'
  },
  max: {
    type: Number,
    default: 50
  },
  min: {
    type: Number,
    default: 50
  },
  style: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['move'])

const dragBox = ref()
const dragBoxLine = ref()

const lineClass = computed(() => {
  return {
    'drag-box-line': true,
    'left': props.position === 'left',
    'right': props.position === 'right',
    'top': props.position === 'top',
    'bottom': props.position === 'bottom',
  }
})

useDragBox(dragBoxLine, dragBox, {
  max: props.max,
  min: props.min,
  position: ['left', 'right'].includes(props.position) ? 'x' : 'y',
  move: (v) => {
    emit('move', v)
  }
})


</script>

<style scoped lang="less">

.drag-box {
  position: relative;
  width: 100%;
  height: 100%;

  .drag-box-line {
    position: absolute;
    z-index: 9;

    &:hover {
      background-color: #dfdfdf;
    }

    &.left, &.right {
      height: 100%;
      width: 3px;
      cursor: col-resize;
    }

    &.top, &.bottom {
      width: 100%;
      height: 3px;
      cursor: row-resize;
    }

    &.left {
      left: -1px;
      top: 0;
    }

    &.right {
      right: -1px;
      top: 0;
    }

    &.bottom {
      left: 0;
      bottom: -1px;
    }

    &.top {
      left: 0;
      top: -1px;
    }
  }

}
</style>
