
<template>
  <div class="content">
    <ContextMenu type="empty" @select="handleChange">
      <a-row :gutter="[8, 8]">
        <a-col :span="3" v-for="item in list" class="content-col">
          <div @click="onClick(item.id)" @dblclick="onDbClick(item)" :class="{
            'content-item': true,
            'active': selectKey === item.id
          }">
            <ContextMenu type="list" :data="item" @select="handleChange">
              <div class="box">{{ providerMap[item.type] }}</div>
              <span>{{ item.name }}</span>
            </ContextMenu>
          </div>
        </a-col>
      </a-row>
    </ContextMenu>
  </div>
  <FileDrawer v-if="visibleFile" @close="visibleFile = false" :data="current" />
  <InputModal v-if="visible" @close="visible = false" @save="onSave" :provider="provider" :data="current" :type="type" :name-list="nameList"/>
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
import { providerEnum, providerMap, restId } from '../index'
import { onKeyStroke, useMagicKeys } from '@vueuse/core'
import { useProduct, useEngine } from '@/store'

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

const provider = ref<string>('')
const current = ref<any>({})
const type = ref<string>('Add')
const selectKey = ref<string>('')
const selectSort = ref<number>(0)
const list = ref<any>([])
const nameList = ref<any>([])

const indexMap = new Map()
const { ControlLeft, MetaLeft, KeyC, KeyV } = useMagicKeys()



const onSave = (data?: any) => {
  // console.log('save', data)
  if (data) {
    visible.value = false
    type.value === 'Add' ? product.add(data, data.parentId) : product.update(data)
  }
}

const onDel = (data: any) => {
  product.remove(data)
  visibleDel.value = false
}



const onPaste = (parentId?: string) => {
  const copyItem = product.getById(engine.copyFile)
  provider.value = copyItem.type
  current.value = {
    title: `copy_${copyItem.name}`,
    children: copyItem.children ? restId(copyItem.children) : undefined,
    parentId: parentId ? parentId : undefined
  }
  visible.value = true
}


const handleChange = (key: any, data?: any) => {
  // console.log(key)
  provider.value = providerEnum[key]
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

const onDbClick = (data:any)=>{
  engine.selectFile(data.id)
  engine.addFile(data)
}

const handleSort = (sort) => {
  const listLength = indexMap.size
  // const colNumber = listLength / 8
  const currentIndex = selectSort.value + sort
  if (currentIndex > 0 && currentIndex < listLength) {
    selectSort.value = selectSort.value + sort
    selectKey.value = list.value[currentIndex]?.id
  }
}

onKeyStroke(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'], (e) => {
  if (e.key === 'ArrowUp') {
    handleSort(-8)
  } else if (e.key === 'ArrowDown') {
    handleSort(8)
  } else if (e.key === 'ArrowLeft') {
    handleSort(-1)
  } else {
    handleSort(1)
  }
})

watchEffect(() => {
  if (props.data?.[0].parentId === engine.activeFile) {
    if (ControlLeft.value && KeyC.value || MetaLeft.value && KeyC.value) {
      const item = list.value.find(it => it.id === selectKey.value)
      engine.setCopyFile(item)
      onlyMessage('复制成功')
      // console.log('ctrl+c', item)
    }
    if (ControlLeft.value && KeyV.value || MetaLeft.value && KeyV.value) {
      console.log('ctrl+V', engine.copyFile)
      onPaste()
    }
  }
})


watchEffect(() => {
  if (props.data.length !== 0) {
    // console.log(props.data[0].id)
    selectKey.value = props.data[0].id
    selectSort.value = 0
    nameList.value = props.data.map(item=>item.name)
    list.value = props.data.map((item, index) => {
      indexMap.set(item.id, index)
      return item
    })
  }
})


</script>

<style scoped lang='less'>
.content {
  background-color: #dddddd;
  height: 600px;

  .content-col {
    display: flex;
    justify-content: center;

    .content-item {
      margin-top: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 5px 15px 0 15px;

      &.active {
        background-color: #377de22b;
        outline: 1px solid #1422df47;
      }

      .box {
        width: 100px;
        height: 100px;
        margin-top: 10px;
        background-color: rgb(253, 253, 253);
      }
    }
  }

}
</style>