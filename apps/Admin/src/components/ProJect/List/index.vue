
<template>
  <div class="title">
    <a-radio-group v-model:value="viewType" @change="handleSorts">
      <a-radio-button value="table">
        <AIcon type="UnorderedListOutlined" />
      </a-radio-button>
      <a-radio-button value="card">
        <AIcon type="AppstoreOutlined" />
      </a-radio-button>
    </a-radio-group>
    <j-select v-model:value="sorts" class="title-sorts" placeholder="排序方式" @change="handleSorts">
      <j-select-option value="default">默认排序</j-select-option>
      <j-select-option value="type">种类</j-select-option>
      <j-select-option value="name">名称</j-select-option>
      <j-select-option value="createTime">添加日期</j-select-option>
      <j-select-option value="modifyTime">修改日期</j-select-option>
    </j-select>
  </div>
  <div class="content" v-if="viewType === 'card'">
    <ContextMenu type="empty" @select="handleChange" @show="onShow">
      <j-scrollbar>
        <a-row>
          <a-col :span="3" v-for="item in list" class="content-col">
            <div @click="onClick(item.id)" @dblclick="onDbClick(item)" class="content-item">
              <ContextMenu type="list" :data="item" @select="handleChange">
                <div :class="{
                  'box': true,
                  'active': selectKey === item.id
                }">
                  <div class="box-img">
                    <img :src="typeImages[item.type]">
                  </div>
                  <j-ellipsis style="max-width: 100px" placement="leftTop">{{ item.name }}</j-ellipsis>
                </div>
              </ContextMenu>
            </div>
          </a-col>
        </a-row>
      </j-scrollbar>
    </ContextMenu>
    <!-- <a-drawer title="添加项目说明" :closable="false" :visible="showMenu" :style="{ position: 'absolute' }" :getContainer="false"
      @close="showMenu = false" :mask="false">
      <div class="drawer" v-for="items in projectList">
        <div class="drawer-title">{{ items.title }}</div>
        <div class="drawer-items" v-for="item in items.children">
          <div class="items-img">
            <img :src="item.img">
          </div>
          <div class="items-text">
            <div class="text">{{ providerMap[item.type] }}</div>
            <span>{{ item.text }}</span>
          </div>
        </div>
      </div>
    </a-drawer> -->
    <FileDrawer v-if="visibleFile" @close="visibleFile = false" :data="current" />
  </div>

  <div v-else>
    <j-pro-table :columns="columns" :dataSource="list" model="TABLE" :noPagination="true" :childrenColumnName="'list'"
      :scroll="{ y: 'calc(100vh - 300px)' }" :customRow="(record) => ({
        onContextmenu: (e) => onContextmenu(e, record),
        onDblclick: () => onDbClick(record)
      })">
      <template #type="{ type }">
        {{ providerMap[type] }}
      </template>
      <template #modifyTime="record">{{ record?.others?.modifyTime }}</template>
    </j-pro-table>
    <div v-if="visibleMenu" style="width: 150px;">
      <j-menu @click="(e) => handleChange(e.key, menuData.data)" :style="menuData.style" class="tableMenu">
        <j-menu-item :key="actionMap['Profile'].key">{{ actionMap['Profile'].value }}</j-menu-item>
        <j-menu-item :key="actionMap['Copy'].key">{{ actionMap['Copy'].value }}</j-menu-item>
        <j-menu-item :key="actionMap['Paste'].key" :disabled="engine.copyFile === ''">{{ actionMap['Paste'].value
        }}</j-menu-item>
        <j-menu-item :key="actionMap['Rename'].key">{{ actionMap['Rename'].value }}</j-menu-item>
        <j-menu-item :key="actionMap['Delete'].key">{{ actionMap['Delete'].value }}</j-menu-item>
      </j-menu>
    </div>
  </div>

  <InputModal v-if="visible" @close="visible = false" @save="onSave" :provider="provider" :data="current" :type="type"
    :name-list="nameList" />
  <ToastModal v-if="visibleToast" @close="visibleToast = false" @save="onSave" :data="current" />
  <DelModal v-if="visibleDel" @close="visibleDel = false" @save="onDel" :data="current" />
</template>

<script setup lang='ts' name="List">
import ContextMenu from '../components/ContextMenu/index.vue'
import InputModal from '../components/Action/InputModal.vue'
import FileDrawer from '../components/Action/FileDrawer.vue'
import ToastModal from '../components/Action/ToastModal.vue'
import DelModal from '../components/Action/DelModal.vue'
import { onlyMessage } from '@jetlinks/utils';
import { providerMap, restId, actionMap, typeImages, projectList } from '../index'
import { onKeyStroke, useMagicKeys } from '@vueuse/core'
import { useProduct, useEngine } from '@/store'
import { delMenu } from '@/api/menu'

const product = useProduct()
const engine = useEngine()

const props = defineProps({
  data: {
    type: [Object],
    default: []
  },
})

const visible = ref<boolean>(false)
const visibleFile = ref<boolean>(false)
const visibleToast = ref<boolean>(false)
const visibleDel = ref<boolean>(false)
const visibleMenu = ref<boolean>(false)

const provider = ref<string>('')
const current = ref<any>({})
const type = ref<string>('Add')
const selectKey = ref<string>(props.data[0]?.id)
const selectSort = ref<number>(0)
const list = ref<any>([])
const nameList = ref<any>([])
const sorts = ref<any>('default')
const showMenu = ref(false)

const viewType = ref<string>('card')
const menuData = reactive({
  style: {},
  data: {}
})

const indexMap = new Map()
const { ControlLeft, MetaLeft, KeyC, KeyV } = useMagicKeys()

const columns = [
  {
    title: '名称',
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
  },
  {
    title: '种类',
    dataIndex: 'type',
    key: 'type',
    scopedSlots: true,
    ellipsis: true,

  },
  {
    title: '修改日期',
    dataIndex: 'modifyTime',
    key: 'modifyTime',
    scopedSlots: true,
    ellipsis: true,
  },
]

const onShow = (val) => {
  showMenu.value = val
}

const onSave = (data?: any) => {
  if (data) {
    visible.value = false
    type.value === 'Add' ? product.add(data, data.parentId, data.type === 'module') : product.update(data)
    setTimeout(() => {
      selectKey.value = data.id
    }, 300)
  }
}

const onDel = async (data: any) => {
  product.remove(data)
  visibleDel.value = false
  await delMenu({
    "paging": false,
    "terms": [{
      "terms": [{
        "type": "or",
        "value": `%pageId":"${data.id}%`,

        "termType": "like",
        "column": "options"
      }]
    }]

  })
}

const onPaste = (parentId?: string) => {
  const copyItem = product.getById(engine.copyFile)
  provider.value = copyItem.type
  current.value = {
    title: `copy_${copyItem.name}`,
    children: copyItem.children ? restId(copyItem.children) : undefined,
    parentId: parentId ? parentId : undefined,
    configuration: copyItem.configuration ? copyItem.configuration : undefined,
    others: copyItem.others ? copyItem.others : undefined
  }
  visible.value = true
}
//table 右键菜单
const onContextmenu = (e, record) => {
  e.preventDefault()
  // console.log('e',e.clientX, e.clientY)
  visibleMenu.value = true
  menuData.style = {
    position: 'absolute',
    left: e.clientX - 300 + "px",
    top: e.clientY - 210 + "px",
  }
  menuData.data = record
  //点击取消菜单
  const cancel = () => {
    visibleMenu.value = false
    document.body.removeEventListener('click', cancel)
  }
  document.body.addEventListener('click', cancel)
}

const handleChange = (key: any, data?: any) => {
  // console.log('key',key)
  provider.value = key
  if (!data) {
    if (key === 'Paste') {
      onPaste()
    } else {
      visible.value = true
      current.value = {}
      type.value = 'Add'
    }
  } else {
    current.value = data
    switch (key) {
      case 'Profile':
        visibleFile.value = true;
        break;
      case 'Copy':
        engine.setCopyFile(data)
        onlyMessage('复制成功')
        break;
      case 'Paste':
        onPaste(data.id)
        break;
      case 'Rename':
        // visibleFile.value = false;
        visible.value = true
        type.value = 'Rename'
        provider.value = data.type
        break;
      case 'Delete':
        visibleDel.value = true
        break;
    }
  }

}

const onClick = (id: string) => {
  selectKey.value = id
  selectSort.value = indexMap.get(id)
}

const onDbClick = (data: any) => {
  engine.selectFile(data.id)
  engine.addFile(data)
}

//排序方式-table切换
const handleSorts = () => {
  const data = product.getById(engine.activeFile)
  product.update({
    ...data,
    others: {
      ...data.others,
      sorts: sorts.value,
      viewType: viewType.value
    }
  })
}

//键盘移动
const handleMove = (sort) => {
  const listLength = indexMap.size
  // const colNumber = listLength / 8
  const currentIndex = selectSort.value + sort
  if (currentIndex >= 0 && currentIndex < listLength) {
    selectSort.value = selectSort.value + sort
    selectKey.value = list.value[currentIndex]?.id
  }
}

onKeyStroke(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'], (e) => {
  if (e.key === 'ArrowUp') {
    handleMove(-8)
  } else if (e.key === 'ArrowDown') {
    handleMove(8)
  } else if (e.key === 'ArrowLeft') {
    handleMove(-1)
  } else {
    handleMove(1)
  }
})

watchEffect(() => {
  if (!props.data?.length) return;

  if (props.data?.[0].parentId === engine.activeFile && viewType.value === 'card' && !visible.value) {
    if (ControlLeft.value && KeyC.value || MetaLeft.value && KeyC.value) {
      const item = list.value.find(it => it.id === selectKey.value)
      engine.setCopyFile(item)
      onlyMessage('复制成功')
      console.log('ctrl+c', item)
    }
    if (ControlLeft.value && KeyV.value || MetaLeft.value && KeyV.value) {
      console.log('ctrl+V', engine.copyFile)
      onPaste()
    }
  }
})


watchEffect(() => {
  if (props.data.length !== 0) {
    // console.log(props.data)
    selectSort.value = 0
    nameList.value = props.data.map(item => item.name)
    list.value = props.data.map((item, index) => {
      indexMap.set(item.id, index)
      return item
    })
  }
})

watch(
  () => props.data,
  () => {
    const item = product.getById(engine.activeFile)
    sorts.value = item.others?.sorts || 'default'
    viewType.value = item.others?.viewType || 'card'
  },
  { deep: true, immediate: true }
)



</script>

<style scoped lang='less'>
.title {
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid #EEE;

  .title-sorts {
    margin-left: 10px;
    margin-right: 10px;
    width: 130px;
  }
}

.content {
  // background-color: #f5f5f5;
  height: calc(100vh - 140px);
  padding: 12px;

  :deep(.ant-drawer-wrapper-body) {
    background-color: #FAFAFA;

    .ant-drawer-header {
      background-color: #FAFAFA;
    }
  }

  .drawer {

    .drawer-title {
      font-size: 14px;
      font-weight: 500;
      line-height: 24px;
      margin: 10px 0;
    }

    .drawer-items {
      height: 64px;
      display: flex;
      background-color: #FFF;
      align-items: center;
      padding: 0 12px;

      .items-img {
        height: 24px;
        width: 24px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .items-text {
        margin-left: 10px;

        .text {
          font-size: 14px;
          line-height: 14px;
        }

        span {
          color: #666666;
        }
      }
    }
  }

  .content-col {
    display: flex;
    justify-content: center;

    .content-item {
      margin-top: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;


      .box {
        width: 132px;
        height: 100px;

        display: flex;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &.active {
          background-color: #CCE8FF;
          outline: 1px solid #89C4F4;
          border-radius: 8px;
        }


        .box-img {
          width: 40px;
          height: 40px;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

}

.tableMenu {
  // background-color: #ececec;
  border: 1px solid #d4d4d4;
}
</style>
