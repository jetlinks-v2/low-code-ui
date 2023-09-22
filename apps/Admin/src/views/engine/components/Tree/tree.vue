<template>
  <div class="tree-content-warp">
    <div class="tree-content-body">
      <j-scrollbar>
        <j-tree
          v-model:expandedKeys="expandedKeys"
          :selectedKeys="[activeFile]"
          :treeData="treeData"
          block-node
          :fieldNames="{
            key: 'id'
          }"
          draggable
          @select="select"
        >
          <template #title="node">
            <j-dropdown :trigger="['contextmenu']">
              <span class="title">
                <div class="icon"><img :src="typeImages[node.type]"></div>
                {{ node.title }}
              </span>
              <template #overlay>
                <RightMenu :node="node" @click="menuClick" />
              </template>
            </j-dropdown>
          </template>
        </j-tree>
      </j-scrollbar>
    </div>
    <InputModal
      v-if="menuState.visible"
      v-bind="menuState"
      @save="save"
      @close="close"
    />
    <FileDrawer :data="menuState.data" v-if="menuState.fileVisible"  @close="close" :getContainer="true"/>
    <DelModal v-if="menuState.visibleDel" @close="close" @save="onDel" :data="menuState.data" />
  </div>
</template>

<script setup name="EngineTreeContent">
import { useEngine, useProduct } from '@/store'
import { storeToRefs } from 'pinia'
import RightMenu from './rightMenu.vue'
import InputModal from '@/components/ProJect/components/Action/InputModal.vue'
import FileDrawer from '@/components/ProJect/components/Action/FileDrawer.vue'
import DelModal from '@/components/ProJect/components/Action/DelModal.vue'
import { providerEnum } from "@/components/ProJect/index";
import { randomString } from '@jetlinks/utils'
import { defaultSetting as CrudBaseData } from '@/components/Database/setting'
import { onlyMessage } from '@jetlinks/utils';
import { typeImages } from '@/components/ProJect/index'

const engine = useEngine()
const product = useProduct()

const { activeFile, expandedKeys } = storeToRefs(engine)

const props = defineProps({
  treeData: {
    type: Array,
    default: () => []
  }
})

const menuState = reactive({
  visible: false,
  fileVisible:false,
  visibleDel:false,
  provider: '',
  cacheData: undefined,
  data: undefined,
  type: undefined,
  nameList: []
})

const select = (key, e) => {
  engine.addFile({
    ...e.node.dataRef
  })
}

const close = () => {
  menuState.visible = false
  menuState.fileVisible = false
  menuState.visibleDel = false
  menuState.provider = ''
  menuState.data = undefined
  menuState.cacheData = undefined
  menuState.type = undefined
  menuState.nameList = []
}

const save = (data) => {
  console.log(data)
  const node = menuState.cacheData
  // console.log('---data',data,menuState.type)
  const parentId = node.type === providerEnum.Module ? node.id : node.parentId
  if(menuState.type !== 'Add'){
    product.update(data)
  }else{
    product.add({
      name:data.name,
      others:data.others,
      id: randomString(16),
      title: data.name,
      type: data.others.type,
      configuration: data.configuration,
      parentId: parentId,
      children:data.children
    }, parentId)
  }
  close()
}

const onDel = (data) => {
  product.remove(data)
  menuState.visibleDel = false
}

const menuClick = (record) => {
  console.log('record',record)
  if(record.menuKey  === 'Copy'){
    engine.setCopyFile(record.data)
    onlyMessage('复制成功')
  }else if(record.menuKey === 'Profile'){
    Object.assign(menuState, record)
    menuState.fileVisible = true
  }else if(record.menuKey === 'Delete'){
    Object.assign(menuState, record)
    menuState.visibleDel = true
  }else{
    Object.assign(menuState, record)
    menuState.visible = true
  }
}

</script>

<style scoped lang="less">
.tree-content-warp {
  height: calc(100% - 54px);

  .tree-content-body {
    height: 100%;

    :deep(.ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected){
      background-color: #F6F7F9;
      color: #315EFB;
      // img{
      //   transform: translateX(100px);
      //   filter: drop-shadow(-100px 0px 0px #315EFB);
      // }
    }
    :deep(.ant-tree-switcher){
      line-height: 40px;
    }
    .title{
      display: flex;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      white-space: nowrap;
    
      .icon{
        margin-right: 10px;
        width: 20px;
        height: 20px;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  //:deep(.ant-tree) {
  //  background-color: transparent;
  //  color: #f8f8f8;
  //
  //  .ant-tree-switcher {
  //    background-color: transparent;
  //    color: #f8f8f8;
  //  }
  //}
}
</style>
