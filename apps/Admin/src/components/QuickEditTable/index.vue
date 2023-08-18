<template>
  <div class="quick-table-warp">
    <ResizeObserver :onResize="onResize">
      <div class="quick-table-container">
        <Header
          :columns="myColumns"
          :serial="serial"
        />
        <Body
          :columns="myColumns"
          :serial="serial"
          :data="data"
          :height="height"
        >
          <template v-for="(_, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData || {}" />
          </template>
        </Body>
      </div>
    </ResizeObserver>

  </div>
</template>

<script setup name="QuickEditTable">
import { ref, provide } from 'vue'
import ResizeObserver from 'ant-design-vue/lib/vc-resize-observer';
import { Header, Body } from './components'
import {HeaderProps, BodyProps, SCROLL_LEFT} from './data'
import {debounce} from "lodash-es";

const emit = defineEmits(['submit', 'submitDlt', 'submitSlt', 'submitCheckbox'])

const props = defineProps({
  ...BodyProps(),
  // 标题数据
  ...HeaderProps()
})

const myColumns = ref([])
const left = ref(0)

provide(SCROLL_LEFT, left)

const onResize = debounce((e) => {
  const { width } = e

  const hasSerial = 'serial' in props && props.serial !== false
  const serialWidth = hasSerial ? 80 : 0

  const hasWidth = props.columns.filter(item => item.width)

  const hasWidthCount = hasWidth.reduce((prev,curr) => {
    return prev + curr.width
  }, 0)

  const average = ((width - serialWidth - hasWidthCount) / (props.columns.length - hasWidth.length))
  let array = []

  array = props.columns.map(item => {
    const min = average < 100 ? 100 : average
    const _w = item.width || min
    return {
      ...item,
      width: _w
    }
  })

  if (hasSerial) {
    array.unshift({
      dataIndex: 'serial_number',
      title: '序号',
      width: serialWidth
    })
  }

  myColumns.value = array
}, 100)
</script>

<style scoped lang="less">

</style>
