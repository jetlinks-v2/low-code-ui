<template>
  <div>
    <div class="scroll-container" :style="{
      height: containerHeight + 'px',
      'overflow-y': 'auto',
      // 'overflow-x': 'auto', //横向滚动存在问题暂时没做，表头没有动
    }" @scroll="handleScroll">
      <div class="scroll-header" v-if="columns.length">
        <div ref="headerRef" class="scroll-header-title" v-for="i in columns" :key="i.key">
          <div class="scroll-header-title-item">
            <span>{{ i.title }}</span>
            <j-tooltip v-if="i.description">
              <template #title>{{ i.description }}</template>
              <AIcon :type="i.iconType || 'QuestionCircleOutlined'" style="margin-left: 5px" />
            </j-tooltip>
          </div>
        </div>
        <div v-if="headerRight" style="width: 10px; height: 30px; opacity: 0">
          表头滚动条位置(占位使用)
        </div>
      </div>

      <div class="scroll-content" :style="{ height: totalHeight + 'px', paddingTop: paddingTop + 'px' }">
        <div v-for="(item, index) in dataSource" :key="item.id" class="list-container">
          <div class="list-item" ref="listItemRef" v-for="(i, idx) in item" :key="idx" :style="{
            'background-color': i.editable ? '#f0f2f5' : '#e8e8e8',
            // cursor: !i.editable ? 'not-allowed' : '',
            'justify-content': 'center',
          }">
            <!-- todo需要判断editableType展示不同组件  -->

            <div v-if="i.editableType === 'input'" style="width: 100%; text-align: center;" class="ipt_div"
              @click.stop="onClickListItem($event, i, index, item)">
              <!-- todo文本框超出显示... -->
              {{ i.value }}
            </div>

            <a-select v-else-if="i.editableType === 'select_jdbc'" v-model:value="i.jdbcType_value"
              style="width: 100%;height: 100%;" @change="jdbcChange(i, index)">
              <a-select-option value="jack">Jack</a-select-option>
              <a-select-option value="lucy">Lucy</a-select-option>
            </a-select>

            <a-select style="width: 100%;height: 100%;" v-model:value="i.javaType_value" @change="javaChange(i, index)"
              v-else-if="i.editableType === 'select_java'">
              <a-select-option value="jack1">Jack1</a-select-option>
              <a-select-option value="lucy1">Lucy1</a-select-option>
            </a-select>

            <span @click.stop="onClickConfig($event, i, index)" v-else-if="i.editableType === 'button'" class="configBtn">
              配置
            </span>
            <a-checkbox v-else-if="i.editableType === 'radio'" v-model:checked="i.isReadonly"
              @change="readonlyChange($event, index)">
            </a-checkbox>
            <div v-else-if="i.editableType === 'buttons'" class="btns">
              <span size="small" @click.stop="acd('add', i, index)">新增</span>
              <span size="small" style="margin: 0 5px;" @click.stop="acd('copy', i, index)">复制</span>
              <span size="small" @click.stop="acd('dlt', i, index)">删除</span>
            </div>

            <div v-else @click.stop="onClickListItem($event, i, index, item)" class="ipt_div">
              {{ i.value }}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="QuickEditTable">
import { ref, watch, toRefs, onMounted, createApp, reactive } from 'vue'
import EditInput from './components/EditInput/index.vue'


const emit = defineEmits(['submit', 'submitDlt', 'submitSlt', 'submitCheckbox'])
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
  // 标题数据
  columns: {
    type: Array,
    default: [],
  },
})

const { data } = toRefs(props)
const { containerHeight, itemHeight, columns } = props

const headerRef = ref()
const headerRight = ref(false)
const listItemRef = ref()
const headerOffsetWidths = ref()

let editInputApp = null
const state = reactive({
  index: -1,
  key: '',
  value: '',
})

/**
 * 根据给定的列和数据生成排序后的数据。
 *
 * @param {Array} columns - 表示列的对象数组。
 * @param {Array} data - 表示数据的对象数组。
 * @return {Array} 表示排序后的数据的对象数组。
 */
const generateSortedData = (columns, data) => {
  return data.map((item) => {
    const sortedRowData = {}
    columns.forEach((column) => {
      sortedRowData[column.key] = item[column.key]
    })
    return sortedRowData
  })
}
// 其他配置
const onClickConfig = (e, item, index) => {
  console.log('配置', e, item, index);
}
// 只读
const readonlyChange = (e, index) => {
  emit('submitCheckbox', {
    value: e?.target?.checked,
    key: 'readOnly',
    index
  })
}
//操作：新增编辑删除
const acd = (mark: string, i: any, idx: number) => {
  if (mark === 'dlt') {
    emit('submitDlt', idx)
  }
}
// 下拉change
const jdbcChange = (i, line) => {
  console.log('列--->', i.index, '行--->', line, '值--->', i.jdbcType_value,);
  emit('submitSlt', {
    key: 'jdbcType',
    line: line,
    column: i.index,
    value: i.jdbcType_value
  })
}
const javaChange = (i, line) => {
  emit('submitSlt', {
    key: 'javaType',
    line: line,
    column: i.index,
    value: i.javaType_value
  })
}
const onClickListItem = (e, item, index, data) => {
  console.log('列表项点击', e, item, index, data, item.key);
  // todo需要判断 editableType不同类型 卸载组件、加载不同组件
  editInputApp && removeApp()
  if (!item.editable) return
  const target = e.target
  const oFrag = document.createDocumentFragment()
  editInputApp = createApp(EditInput, {
    value: item.value,
    setValue,
  })
  if (editInputApp) {
    editInputApp.mount(oFrag)
    target.appendChild(oFrag)
    target.querySelector('.edit-input').focus()
    // target.querySelector('.edit-input').select()
  }
  setData({ index, key: item.key, value: item.value })
}

const setData = ({ index = -1, key = '', value = '' }) => {
  state.index = index
  state.key = key
  state.value = value
}
const setValue = (value) => {
  state.value = value
  emit('submit', { ...state })
}

const removeApp = () => {
  editInputApp && editInputApp.unmount()
  setData({})
}

// 监听点击 移除app
window.addEventListener('click', removeApp, false)

const initDataSource = (columns, data) => {
  const _data = generateSortedData(columns, data)
  return _data.map((item) => {
    const columnsEditable = columns?.map((i: any) => i.editable)
    const editableTypeArr = columns?.map((i: any) => i.editableType)
    return Object.keys(item).reduce((acc, key, index) => {
      // console.log('ABC', item, key);
      acc[key] = {
        key, //列 columns的key
        index, //行 序号
        value: item[key],
        isReadonly: item.readOnly,
        jdbcType_value: item.jdbcType,
        javaType_value: item.javaType,
        editable: columnsEditable[index], //todo需要处理单条数据的
        // editableType: 'input', //编辑的类型
        editableType: editableTypeArr[index],
        options: {
          // todo选择框的数据
          // todo依赖项(某一项变化 自己也变化)
        }, // 其他配置项
      }
      return acc
    }, {})
  })
}
// 处理为可编辑数据
const dataSource = ref(initDataSource(columns, data.value))

const visibleItems = ref([])
const bufferSize = 5 // 缓冲区大小

// 计算总高度
const totalHeight = ref(dataSource.value.length * itemHeight)

// 计算可见区域的起始索引和结束索引
const startIndex = ref(0)
const endIndex = ref(Math.ceil(containerHeight / itemHeight))

// 计算滚动容器的顶部内边距
const paddingTop = ref(startIndex.value * itemHeight)

// 更新可见列表项
const updateVisibleItems = () => {
  // visibleItems.value = dataSource.value.slice(startIndex.value, endIndex.value)
  // console.log('a', dataSource.value);
  visibleItems.value = dataSource.value
}

// 处理滚动事件
const handleScroll = (event, v) => {
  // let scrollTop = event?.target?.scrollTop
  // // 计算可见区域的起始索引和结束索引
  // const start = Math.floor(scrollTop / itemHeight)
  // const end = start + Math.ceil(containerHeight / itemHeight)

  // // 更新起始索引、结束索引和顶部内边距
  // startIndex.value = start
  // endIndex.value = end
  // paddingTop.value = startIndex.value * itemHeight
}

// 监听可见区域的起始索引和结束索引的变化
// watch(
//   [startIndex, endIndex],
//   (value) => {
//     if (dataSource.value.length > value[1]) {
//       headerRight.value = true
//     }
//     // 初始化可见列表项
//     updateVisibleItems()
//   },
//   {
//     immediate: true,
//   },
// )
visibleItems.value = dataSource.value
watch(data.value, (value) => {
  console.log('监听data.vaue', value);
  // 更新dataSource、可见列表项
  dataSource.value = initDataSource(columns, value)
  updateVisibleItems()
})
onMounted(() => {
  setListItemMaxWidth()
})

// 设置列表项的最大宽度
const setListItemMaxWidth = () => {
  headerOffsetWidths.value = headerRef.value.map((item) => item.offsetWidth)
  listItemRef.value.forEach((item) => {
    item.style.maxWidth = headerOffsetWidths.value[item.index] - 10 + 'px'
  })
}
</script>

<style scoped lang="less">
.list-container {
  display: flex;
}

.list-item {
  width: 100%;
  min-width: 100px;
  display: flex;
  justify-items: center;
  align-items: center;
  border: 1px solid #ccc;
  position: relative;
}

.scroll-container {
  position: relative;
  border: 1px solid #ccc;
  overflow: hidden;
  margin-top: 30px;
}

.scroll-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.scroll-header {
  position: fixed;
  margin-top: -30px;
  height: 30px;
  // border: 1px solid #ccc;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ccc;
}

.scroll-header-title {
  width: 100%;
  min-width: 100px;
  height: 100%;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}

.scroll-container::-webkit-scrollbar {
  width: 10px;
  height: 10px;
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

.configBtn,
.btns span {
  cursor: pointer;
}

.ipt_div {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
