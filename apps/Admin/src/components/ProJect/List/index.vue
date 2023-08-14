
<template>
  <div class="content">
    <ContextMenu type="empty" @select="handleChange">
      <a-row :gutter="[8, 8]">
        <a-col :span="3" v-for="item in list" class="content-col">
          <div @click="onClick(item.id)" :class="{
            'content-item': true,
            'active': selectKey === item.id
          }">
            <ContextMenu type="list" :data="item" @select="handleChange">
              <div class="box"></div>
              <span>{{ item.name }}</span>
            </ContextMenu>
          </div>
        </a-col>
      </a-row>
    </ContextMenu>
  </div>
  <FileDrawer v-if="visibleFile" @close="visibleFile = false" :data="current" />
  <InputModal v-if="visible" @close="visible = false" @save="onSave" :provider="provider" :default-name="current.name"
    :type="type" />
  <ToastModal v-if="visibleToast" @close="visibleToast = false" @save="onSave" :data="current" />
  <DelModal v-if="visibleDel" @close="visibleDel = false" @save="onSave" :data="current" />
</template>

<script setup lang='ts' name="List">
import ContextMenu from '../components/ContextMenu/index.vue'
import InputModal from '../components/Action/InputModal.vue'
import FileDrawer from '../components/Action/FileDrawer.vue'
import ToastModal from '../components/Action/ToastModal.vue'
import DelModal from '../components/Action/DelModal.vue'
import { onlyMessage } from '@jetlinks/utils';
import { providerEnum } from '../index'
import { onKeyStroke,useMagicKeys } from '@vueuse/core'
import { useEngine } from '@/store'

const engine = useEngine()

const props = defineProps({
  data: {
    type: [Object],
    default: []
  }
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


const indexMap = new Map()
const {ControlLeft,MetaLeft,KeyC,KeyV } = useMagicKeys()



const onSave = (data?: any) => {
  console.log('data------', data)
}


const handleChange = (key: any, data?: any) => {
  console.log('---------', key, data)
  provider.value = providerEnum[key]
  if (!data) {
    visible.value = true
    current.value = {}
    type.value = 'Add'
  } else {
    current.value = data

    if (key === 'Profile') {
      //简介
      visibleFile.value = true
    } else if (key === 'Cut') {
      //剪切
      // visibleToast.value = true
    } else if (key === 'Copy') {
      //复制
      onlyMessage('复制成功')
    } else if (key === 'Paste') {
      //粘贴
    } else if (key === 'Rename') {
      //重命名
      visible.value = true
      type.value = 'Rename'
      provider.value = data.type
    } else if (key === 'Delete') {
      //删除
      visibleDel.value = true
    }
  }

}

const onClick = (id: string) => {
  selectKey.value = id
  selectSort.value = indexMap.get(id)
}

const handleSort = (sort) => {
  const listLength = indexMap.size
  // const colNumber = listLength / 8
  const currentIndex = selectSort.value + sort
  if (currentIndex > 0 && currentIndex < listLength) {
    selectSort.value = selectSort.value + sort
    selectKey.value =list.value[currentIndex]?.id 
  }
  console.log('selectSort', currentIndex)
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

watchEffect(()=>{
  if(ControlLeft.value && KeyC.value || MetaLeft.value && KeyC.value){
    const item = list.value.find(it=>it.id === selectKey.value)
    engine.setCopyFile(item)
    console.log('ctrl+c',item)
  }
  if(ControlLeft.value && KeyV.value || MetaLeft.value && KeyV.value){
    console.log('ctrl+V',engine.copyFile)
  }
})

onMounted(() => {
  // console.log('props.data', props.data)
  if (props.data.length !== 0) {
    console.log(props.data[0].id)
    selectKey.value = props.data[0].id
    selectSort.value = 0
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