<template>
  <div class="tree-content-warp">
    <div class="tree-content-body">
      <j-scrollbar>
        <j-tree v-model:expandedKeys="expandedKeys" :selectedKeys="[activeFile]" :treeData="list" block-node :fieldNames="{
          key: 'id'
        }" draggable @drop="onDrop" @select="select">
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
    <InputModal v-if="menuState.visible" v-bind="menuState" @save="save" @close="close" />
    <FileDrawer :data="menuState.data" v-if="menuState.fileVisible" @close="close" :getContainer="true" />
    <DelModal v-if="menuState.visibleDel" @close="close" @save="onDel" :data="menuState.data" />
  </div>
</template>

<script setup name="EngineTreeContent">
import { useEngine, useProduct } from '@LowCode/store'
import { storeToRefs } from 'pinia'
import RightMenu from './rightMenu.vue'
import InputModal from '@LowCode/components/ProJect/components/Action/InputModal.vue'
import FileDrawer from '@LowCode/components/ProJect/components/Action/FileDrawer.vue'
import DelModal from '@LowCode/components/ProJect/components/Action/DelModal.vue'
import { providerEnum } from "@LowCode/components/ProJect/index";
import { randomString } from '@jetlinks-web/utils'
import { defaultSetting as CrudBaseData } from '@LowCode/components/Database/setting'
import { onlyMessage } from '@jetlinks-web/utils';
import { typeImages } from '@LowCode/components/ProJect/index'
import { restParentId,findById } from './tree'
import { cloneDeep } from 'lodash-es';
import { delMenu } from '@LowCode/api/menu'
import { Modal } from 'jetlinks-ui-components'
import { h } from 'vue'

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
  fileVisible: false,
  visibleDel: false,
  provider: '',
  cacheData: undefined,
  data: undefined,
  type: undefined,
  nameList: []
})

const list = ref(props.treeData)

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
  const node = menuState.cacheData
  // console.log('---data',data,menuState.type)
  const parentId = node.type === providerEnum.Module ? node.id : node.parentId
  if (menuState.type !== 'Add') {
    product.update(data)
  } else {
    product.add({
      name: data.name,
      others: data.others,
      id: randomString(16),
      title: data.name,
      type: data.others.type,
      configuration: data.configuration,
      parentId: parentId,
      children: data.children
    }, parentId)
  }
  close()
}

const onDel =async (data) => {
  product.remove(data)
  menuState.visibleDel = false
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

const menuClick = (record) => {
  if (record.menuKey === 'Copy') {
    engine.setCopyFile(record.data)
    onlyMessage('复制成功')
  } else if (record.menuKey === 'Profile') {
    Object.assign(menuState, record)
    menuState.fileVisible = true
  } else if (record.menuKey === 'Delete') {
    Object.assign(menuState, record)
    menuState.visibleDel = true
  } else {
    Object.assign(menuState, record)
    menuState.visible = true
  }
}

const loop = (data, key, callback) => {
  data.forEach((item, index) => {
    if (item.id === key) {
      return callback(item, index, data);
    }
    if (item.children) {
      return loop(item.children, key, callback);
    }
  });
};

const someName = (drop, drag, parentId) => {
  // 获取同级下的元素，过滤掉自身
  const children = [...product.getDataMap().values()].filter(item => item.parentId === parentId && item.id !== drag.id)
  return children.some(item => item.name === drag.name)
}

const onDrop = (info) => {
  const dropKey = info.node.key; //目标元素
  const dragKey = info.dragNode.key; //拖拽元素
  const dropPos = info.node.pos?.split('-');
  const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

  const mayType = ['module', 'project']

  const data = cloneDeep([...list.value])

  let dragObj;
  const parentId = mayType.includes(info.node.type) ? info.node.id : info.node.parentId
  if (someName(info.node, info.dragNode, parentId)) { // 有同名禁止拖拽
    Modal.warning ({
      title: h( 'div', { style:{ wordBreak: 'break-all' }}, `名称"${info.dragNode.title}"已被占用，请重新命名`),
      okText: '确定'
    })
    return
  }
    //平级

  if (!info.dropToGap && mayType.includes(info.node.type)) {

    loop(data, dragKey, (item, index, arr) => {
      dragObj = item;
      arr?.splice(index, 1);
    })
    loop(data, dropKey, (item) => {
      console.log('item', item)
      item.children = item.children || [];
      item.children.unshift(dragObj);
    })
  }

  if (info.dropToGap && info.node.type !== 'project') {

    loop(data, dragKey, (item, index, arr) => {
      dragObj = item;
      arr?.splice(index, 1);
    })
    let ar = [];
    let i = 0;
    loop(data, dropKey, (_item, index, arr) => {
      ar = arr;
      i = index;
    });
    if (dropPosition === -1) {
      ar.splice(i, 0, dragObj);
    } else {
      ar.splice(i + 1, 0, dragObj);
    }
  }

  const record = findById(restParentId(data),dragKey)
  const parentRecord = findById(restParentId(data),record.parentId)
  // product.move(record,record.parentId)
  parentRecord.children?.forEach((item,index)=>{
    if(item.id === record.id){
      product.move(record,record.parentId,index)
      return;
    }
  })
  // console.log('data---', restParentId(data),record,)
  list.value = data
}

watch(
  () => props.treeData,
  (val) => {
    list.value = val
  }
)

</script>

<style scoped lang="less">
.tree-content-warp {
  height: calc(100% - 54px);

  .tree-content-body {
    height: 100%;

    :deep(.ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected) {
      background-color: #F6F7F9;
      color: #315EFB;
      // img{
      //   transform: translateX(100px);
      //   filter: drop-shadow(-100px 0px 0px #315EFB);
      // }
    }

    :deep(.ant-tree-switcher) {
      line-height: 40px;
    }

    .title {
      display: flex;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      white-space: nowrap;

      .icon {
        margin-right: 10px;
        width: 20px;
        height: 20px;

        img {
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
