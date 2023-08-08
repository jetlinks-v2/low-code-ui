<template>
  <div>
    <div style="height: 10px"></div>
    <div class="scroll-content-title">
      <slot name="title"></slot>
    </div>
    <div
      class="scroll-container"
      :style="{ height: containerHeight + 'px', 'overflow-y': 'auto' }"
      @scroll="handleScroll"
    >
      <div
        class="scroll-content"
        :style="{ height: totalHeight + 'px', paddingTop: paddingTop + 'px' }"
      >
        <div
          v-for="(item, index) in visibleItems"
          :key="item.id"
          class="list-item"
        >
          <slot :record="item" :id="index" name="content"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="VirtualList">
import { ref, watch, toRefs } from 'vue'
const props = defineProps({
  // 数据
  data: {
    type: Array,
    default: [],
  },
  // 容器高度
  containerHeight: {
    type: Number,
    default: 400,
  },
  // 列表项高度
  itemHeight: {
    type: Number,
    default: 20,
  },
  // 缓冲区大小
  bufferSize: {
    type: Number,
    default: 5,
  },
})

const { data } = toRefs(props)
const { containerHeight, itemHeight } = props

const visibleItems = ref([])
const bufferSize = 5 // 缓冲区大小

// 计算总高度
const totalHeight = ref(data.value.length * itemHeight)

// 计算可见区域的起始索引和结束索引
const startIndex = ref(0)
const endIndex = ref(Math.ceil(containerHeight / itemHeight))

// 计算滚动容器的顶部内边距
const paddingTop = ref(startIndex.value * itemHeight)

// 更新可见列表项
const updateVisibleItems = () => {
  visibleItems.value = data.value.slice(startIndex.value, endIndex.value)
}

// 处理滚动事件
const handleScroll = (event, v) => {
  let scrollTop = event?.target?.scrollTop
  // 计算可见区域的起始索引和结束索引
  const start = Math.floor(scrollTop / itemHeight)
  const end = start + Math.ceil(containerHeight / itemHeight)

  // 更新起始索引、结束索引和顶部内边距
  startIndex.value = start
  endIndex.value = end
  paddingTop.value = startIndex.value * itemHeight
}

// 监听可见区域的起始索引和结束索引的变化
watch([startIndex, endIndex], () => {
  updateVisibleItems()
})

// 初始化可见列表项
updateVisibleItems()
</script>

<style scoped lang="less">
.scroll-container {
  position: relative;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

.scroll-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.scroll-content-title {
  height: 20px;
  border: 1px solid #ccc;
}

.scroll-container::-webkit-scrollbar {
  width: 6px;
}
/*正常情况下滑块的样式*/
.scroll-container::-webkit-scrollbar-thumb {
  background-color: #b2b2b2;
  border-radius: 10px;
  -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.1);
}
/*鼠标悬浮在该类指向的控件上时滑块的样式*/
.scroll-container:hover::-webkit-scrollbar-thumb {
  //   background-color: rgba(0, 0, 0, 0.2);
  background-color: #b2b2b2;
  border-radius: 10px;
  -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.1);
}
/*鼠标悬浮在滑块上时滑块的样式*/
.scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.4);
  -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.1);
}
/*正常时候的主干部分*/
.scroll-container::-webkit-scrollbar-track {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  //   background-color: white;
}
// /*鼠标悬浮在滚动条上的主干部分*/
.scroll-container::-webkit-scrollbar-track:hover {
  -webkit-box-shadow: inset 0 0 6px rgba(178, 178, 178, 0.4);
  background-color: rgba(178, 178, 178, 0.01);
}
.list-item {
  //   height: 50px;
  //   line-height: 50px;
  //   padding: 0 16px;
  //   background-color: #f0f0f0;
  //   border-bottom: 1px solid #ccc;
}
</style>
