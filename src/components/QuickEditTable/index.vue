<template>
  <div class="quick-table-warp">
    <ResizeObserver :onResize="onResize">
      <div class="quick-table-container">
        <Header
          :columns="myColumns"
          :serial="serial"
        />
        <Body
          ref="bodyRef"
          v-if="data.length > 0"
          :columns="myColumns"
          :serial="serial"
          :data="data"
          :scroll="scroll"
          :validate="validate"
          :cell-height="cellHeight"
        >
          <template v-for="(_, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData || {}" />
          </template>
        </Body>
        <template v-else>
          <slot name="empty">
            <j-empty />
          </slot>
        </template>
      </div>
    </ResizeObserver>

  </div>
</template>

<script setup name="QuickEditTable">
import { ref, provide, defineExpose } from 'vue'
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
const bodyRef = ref()

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

onMounted(() => {
  onResize({ width: 0 })
})

const validateItem = (path) => {
  bodyRef.value?.validateItem(path)
}

defineExpose({
  validates: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const v = await bodyRef.value?.validates()
        resolve(v)
      } catch (e) {
        reject(e)
      }
    })
  },
  validateItem: validateItem
})

</script>

<style scoped lang="less">
.quick-table-container {
  height: 100%;
}
</style>
