<template>
  <div class="simple-tabs">
    <ResizeObserver :onResize="onResize">
      <div class="tabs-list" ref="listDom">
        <ResizeObserver :onResize="onContentResize">
          <div class="tabs-list-content" ref="listContentDom" @wheel="wheel" :style="{transform : `translate(${transformLeft}px, 0)`}">
            <Node
              v-for="(item, index) in options"
              v-bind="item"
              :active="item.id === myActiveKey"
              :key="item.id"
              @click="() => instanceClick(item.id, index)"
              @remove="remove"
            />
          </div>
        </ResizeObserver>
      </div>
    </ResizeObserver>
    <j-dropdown placement="bottomRight">
      <template #overlay>
        <j-menu @click="menuClick">
          <j-menu-item v-for="item in options" :key="item.id">{{ item.title }}</j-menu-item>
        </j-menu>
      </template>
      <div class="operations" v-if="showOperations">
        <AIcon type="MoreOutlined" />
      </div>
    </j-dropdown>
  </div>
</template>

<script setup name="SimpleTabs">
import Node from './tabNode.vue'
import ResizeObserver from 'ant-design-vue/lib/vc-resize-observer';
import { debounce } from 'lodash-es'

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  activeKey: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:activeKey', 'remove'])

const listDom = ref()
const listContentDom = ref()
const transformLeft = ref(0)
const transformMax = ref(0)

const myActiveKey = ref()

const showOperations = computed(() => {
  return transformMax.value > 0
})

const handleTransformLeft = (key, index) => {

  if (transformMax.value < 0) return

  const domList = listDom.value.querySelectorAll('.tab-node')
  const activeDom = domList[index].getBoundingClientRect()
  const listStyle = listDom.value.getBoundingClientRect()
  console.log(activeDom, listStyle)
  if (activeDom.left < listStyle.left) {
    let count = 0
    domList.forEach((item, i) => {
      if (i < index) {
        count -= item.getBoundingClientRect().width
      }
    })
    transformLeft.value = count
  } else if (activeDom.right > listStyle.right) {
    transformLeft.value = (listStyle.right - activeDom.right) + transformLeft.value
  } else if (activeDom.right < listStyle.right && index === domList.length - 1) {
    transformLeft.value = -transformMax.value
  }
}

const instanceClick = (key, index) => {
  handleTransformLeft(key, index)
  emit('update:activeKey', key)
}

const getTansformMax = () => {
  const listStyle = listDom.value.getBoundingClientRect()
  const listContentStyle = listContentDom.value.getBoundingClientRect()
  transformMax.value = listContentStyle.width - listStyle.width
}

const onContentResize = debounce(() => {
  getTansformMax()
}, 30)

const onResize = debounce(() => {
  const index = props.options.findIndex(item => item.id === props.activeKey)
  if (index !== -1) {
    getTansformMax()
    handleTransformLeft(props.activeKey, index)
  }
}, 30)

const menuClick = ({ key }) => {
  const index = props.options.findIndex(item => item.id === key)
  if (index !== -1) {
    instanceClick(key, index)
  }
}

const wheel = (e) => {
  let oldValue = transformLeft.value

  oldValue -= e.deltaY
  if (oldValue > 0) {
    transformLeft.value = 0
  } else if (oldValue < -transformMax.value) {
    transformLeft.value = -transformMax.value
  } else {
    transformLeft.value = oldValue
  }
}

const remove = (key) => {
  emit('remove', key)
}

watch(() => JSON.stringify(props.options), () => {
  nextTick(() => {
    getTansformMax()
  })
}, { immediate: true })

watch(() => props.activeKey, () => {
  myActiveKey.value = props.activeKey
}, { immediate: true })

</script>

<style scoped lang="less">
.simple-tabs {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-variant: tabular-nums;
  font-feature-settings: 'tnum';
  display: flex;
  overflow: hidden;
  background-color: #21252b;

  .tabs-list {
    position: relative;
    display: flex;
    flex: auto;
    align-self: stretch;
    overflow: hidden;
    white-space: nowrap;
    transform: translate(0);
    flex-grow: 1;
    flex-shrink: 1;

    .tabs-list-content {
      position: relative;
      display: flex;
      transition: transform .25s;
    }
  }

  .operations {
    padding: 8px;
    text-align: center;
    color: #fdd835;
    width: 52px;
  }
}
</style>
