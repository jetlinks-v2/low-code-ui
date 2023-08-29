<template>
  <div class="quick-table--body" :style="bodyStyle">
    <j-scrollbar @scroll="scroll">
      <div class="body-container" ref="bodyRef" :style="{ height: bodyHeight + 'px'}">
        <div
          v-for="(a, index) in updateList"
          class="body-row"
          :style="{ transform: `translateY(${a.offsetTop}px)`, height: cellHeight+'px'}"
          :key="a._quick_id"
        >
          <div
            class="body-cell"
            v-for="b in columns"
            :key="`${a._quick_id}_${b.dataIndex}`"
            :style="{width: b.width + 'px'}"
          >
            <div class="body-cell-box" v-if="b.dataIndex === 'serial_number'">
              <template v-if="slots.serial">
                <slot name="serial" :record="a" :index="a.index" :column="b">
                  {{ a.index }}
                </slot>
              </template>
              <template v-else>
                {{ a.index }}
              </template>
            </div>

            <div v-else class="body-cell-box">
              <template v-if="slots[b.dataIndex]">
                <slot :name="b.dataIndex" :record="a" :index="a.index" :column="b">
                  {{ a[b.dataIndex] }}
                </slot>
              </template>
              <template v-else>
                <j-ellipsis v-if="b.ellipsis">
                  {{ a[b.dataIndex] }}
                </j-ellipsis>
                <span v-else>
                  {{ a[b.dataIndex] }}
                </span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </j-scrollbar>
  </div>
</template>

<script setup name="QuickTableBody">
import { BodyProps, SCROLL_LEFT } from "../data";
import { dataAddID } from "../util";
import { useSlots } from 'vue'

const props = defineProps({
  ...BodyProps()
})

const cellHeight = 57
const myData = ref([])
const bodyRef = ref()
const startIndex = ref(0)
const endIndex = ref(10)
const maxLen = ref(10)
const updateList = ref([])
const left = inject(SCROLL_LEFT)

const slots = useSlots()

const bodyHeight = computed(() => {
  const len = myData.value.length
  return len ? len * cellHeight : 200
})

const update = () => {
  updateList.value = myData.value.slice(startIndex.value, endIndex.value)
}

const handlePosition = (height) => {
  const start = Math.round(height / cellHeight) - 2
  const end = start + maxLen.value + 4
  startIndex.value = start >= 0 ? start : 0
  endIndex.value = end
  update()
}

const scroll = ({scrollTop, scrollLeft}) => {
  left.value = scrollLeft
  handlePosition(scrollTop)
}

const bodyStyle = computed(() => {
  return {
    height: props.scroll?.y !== undefined ? props.scroll.y + 'px' : undefined
  }
})

const maxLength = () => {
  if ( props.scroll?.y) {
    maxLen.value = Math.round( props.scroll.y / cellHeight)
    endIndex.value = maxLen.value + 2
    update()
  }
}

maxLength()

watch(() => JSON.stringify(props.data), () => {
  myData.value = dataAddID(props.data, cellHeight)
  update()
}, { immediate: true })

</script>

<style scoped lang="less">
.quick-table--body {
  position: relative;
  overflow: auto;

  .body-container {
    position: relative;
    .body-row {
      display: flex;
      position: absolute;
      transition: transform .2s,top .2s,height .2s,background-color .1s;

      &:hover {
        background-color: rgb(248, 248, 248);
      }

      .body-cell {
        display: flex;
        padding: 0;
        align-items: center;
        text-align: left;
        overflow: visible;

        border-bottom: 1px solid rgb(240,240,240);

        .body-cell-box {
          box-sizing: border-box;
          position: relative;
          outline: none;
          padding: 12px 16px;
          width: 1px;
          z-index: 1;
          flex: 1;
        }
      }
    }
  }
}
</style>
