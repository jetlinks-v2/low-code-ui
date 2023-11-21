<template>
  <div class="guide-steps" @click="handleClick" v-if="open" ref="maskRef">
    <div class="info" style="position: absolute;" ref="info">
      <img :src="getImage('/list-page/line.png')" :style="style1">
      <div :style="style" class="message">
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
      </div>
    </div>
    <div class="step-button" :style="{ bottom: steps == 2 ? '20%' : '40%' }">
      <j-space size="large">
        <p @click.stop="steps--" v-if="steps != 1">查看上一步</p>
        <p v-if="steps !== stepList.length">点击任意位置查看下一步</p>
        <p v-else>点击任意位置结束向导</p>
      </j-space>
    </div>
    <div class="stop" v-if="steps !== stepList.length">
      <j-button type="primary" @click.stop="handleJump">跳过向导</j-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="Guide">
import type { PropType } from 'vue'
import type { GuideProps } from './type'
import { getImage } from '@jetlinks-web/utils'
interface Emit {
  (e: 'update:open', value: boolean): void
}

const emits = defineEmits<Emit>()
const props = defineProps({
  stepList: {
    type: Array as PropType<GuideProps['stepsList']>,
    default: () => [],
    required: true,
  },
  open: {
    type: Boolean,
    default: false,
  },
})

const style1 = computed(() => {
  let result = {}
  switch(steps.value) {
    case 2:
      result = {
        transform: 'rotateX(180deg)',
      }
    break;
    case 3:
      result = {
        transform: 'rotateY(180deg)',
      }
    break;
  }
  return result
})

const style = computed(() => {
  let result = {}
  switch(steps.value) {
    case 1:
      result = {
        left: '92px',
        bottom: '-60px',
        position: 'absolute'
      }
    break;
    case 2:
      result = {
        left: '92px',
        top: '-7px',
        position: 'absolute'
      }
    break;
    case 3:
      result = {
        left: '-350px',
        bottom: '-62px',
        position: 'absolute',
        textAlign: 'right'
      }
    break;
  }
  return result
})
const info = ref()
const maskRef = ref()

const title = computed(() => {
  return props.stepList[steps.value - 1]?.title || ''
})

const description = computed(() => {
  return props.stepList[steps.value - 1]?.description || ''
})

const steps = ref(0)

const handleClick = () => {
  steps.value++
  if (steps.value > props.stepList.length) {
    emits('update:open', false)
  }
}

watch(
  () => steps.value,
  (val) => {
    const elements = document.getElementsByClassName(`temp-element`) as any
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0])
    }
    for (let i = 0; i < props.stepList.length; i++) {
      props.stepList[i].target?.().forEach((item) => {
        item.el.style.backgroundColor = ''
        item.el.style.pointerEvents = ''
        item.el.style.position = ''
        item.el.style.zIndex = ''
      })
    }
    if (val > props.stepList.length || val == 0) {
      return
    }
    if(props.stepList[val - 1]?.placement == 'left') {
      info.value.style.left = null;
      info.value.style.right = position(
      props.stepList[val - 1].target?.()[0]?.el,
      props.stepList[val - 1]?.placement,
    )[1]
    } else {
      info.value.style.left = position(
        props.stepList[val - 1].target?.()[0]?.el,
        props.stepList[val - 1]?.placement,
      )[1]
    }
    info.value.style.top = position(
      props.stepList[val - 1].target?.()[0]?.el,
      props.stepList[val - 1]?.placement,
    )[0]
    props.stepList[val - 1].target?.().forEach((item) => {

      item.el.style.backgroundColor = <string>item.backgroundColor
      item.el.style.pointerEvents = 'none'
      item.el.style.position = 'relative'
      item.el.style.zIndex = '3'
      item.el.style.top = steps.value === 1 ? '10px' : '0px';
      const node = document.createElement('div')
      node.setAttribute('class', `temp-element`)
      node.setAttribute(
        'style',
        'position: absolute; left: 0; top: 0; display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;',
      )
      node.innerHTML = item.overText || ''
      item.el.appendChild(node)
    })
  },
)

/**跳过向导 */
const handleJump = () => {
  emits('update:open', false)
  steps.value = 0;
}
function position(el: HTMLElement, position?: string) {
  let result: string[] = ['0px', '0px']
  switch (position) {
    case 'top':
      result = [
        180 +
          'px',
        234 + 'px',
      ]
      break
    case 'right':
      result = [
        el.getBoundingClientRect().top -
          maskRef.value?.getBoundingClientRect().top +
          'px',
        el.getBoundingClientRect().left + el.offsetWidth + 'px',
      ]
      break
    case 'bottom':
      result = [
        el.getBoundingClientRect().top +
          el.offsetHeight -
          maskRef.value?.getBoundingClientRect().top + 10 +
          'px',
          282 + 'px',
      ]
      break
    case 'left':
      result = [
        el.getBoundingClientRect().top -
          maskRef.value?.getBoundingClientRect().top +
          'px',
        40 + 'px',
      ]
      break
    // (<HTMLElement>info.value).style.left = props.steps[val - 1].target()[0]?.el.getBoundingClientRect()?.left + 'px';
    // (<HTMLElement>info.value).style.top = props.steps[val - 1].target()[0]?.el.getBoundingClientRect()?.top + props.steps[val - 1].target()[0].el.offsetHeight + 'px';
  }
  return result
}
watch(
  () => [props.stepList, props.open],
  (val) => {
    nextTick(() => {
      if (val[0] && val[1]) {
        steps.value = 1
      }
    })
  },
  { immediate: true, deep: true },
)
</script>

<style scoped lang="less">
.guide-steps {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  color: #ffffff;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .step-button {
    position: absolute;
    bottom: 40%;
  }
  .stop {
    position: absolute;
    right: 20px;
    top: 92px;
    z-index: 3;
  }
  .message {
    white-space: nowrap;
    h3 {
      color: #ffffff;
      font-weight: 500;
      font-size: 24px;
    }
  }
}
</style>
