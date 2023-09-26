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
                <j-popover
                  v-if="errorMap?.[`${b.dataIndex}__${a._quick_id}`]"
                  visible
                  overlayClassName="form-error-popover"
                  :content="errorMap?.[`${b.dataIndex}__${a._quick_id}`]"
                  :getPopupContainer="getPopupContainer"
                >
                  <div :class="{'form-error': errorMap?.[`${b.dataIndex}__${a._quick_id}`] }">
                  </div>
                </j-popover>
                <slot :name="b.dataIndex" :record="a" :index="a.index" :column="b" :valueChange="(v) => { valueChange(v, b.dataIndex, a) }">
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
import { dataAddID, useValidate } from "../util";
import { useSlots, defineExpose } from 'vue'
import { get } from 'lodash-es'

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

const { errorMap, validate, createValidate, validates: validatesFn } = useValidate(props.data)

const slots = useSlots()

const isValidate = computed(() => {
  return props.validate !== false
})

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
    maxHeight: props.scroll?.y !== undefined ? props.scroll.y + 'px' : undefined,
    height: 'calc(100% - 56px)'
  }
})

const maxLength = () => {
  if ( props.scroll?.y) {
    maxLen.value = Math.round( props.scroll.y / cellHeight)
    endIndex.value = maxLen.value + 2
    update()
  }
}

const valueChange = (e, dataIndex, record) => {

  if (isValidate.value) {
    validate(dataIndex, e, record)
  }
}

const getPopupContainer = (e) => {
  return bodyRef.value || e.parentNode
}

const validateItem = (path) => {
  const [ dataIndex, name ] = path
  const value = get(props.data, path)
  console.log(name, value, props.data[dataIndex])
  validate(name, value, props.data[dataIndex])
}

watch(() => JSON.stringify(props.columns),  () => {
  createValidate(props.columns)
}, { immediate: true })

maxLength()

watch(() => JSON.stringify(props.data), (newValue, oldValue) => {
  myData.value = dataAddID(props.data, cellHeight)
  update()
}, { immediate: true })

defineExpose({
  validates: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const v = await validatesFn()
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

  :deep(.form-error-popover) {
    .ant-popover-inner-content {
      white-space: nowrap;
    }
  }

  .form-error {
    width: 100%;
    position: absolute;
    height: 100%;
    left: 0;
    top: 0;
  }
}
</style>
