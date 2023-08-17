<template>
  <j-tree
    :tree-data="btnTree"
    :show-icon="false"
    draggable
    block-node
    :selectable="false"
    :defaultExpandAll="true"
    @drop="onDrop"
    @dragover="onDragEnter"
  >
    <template #switcherIcon="{ switcherCls }">
      <AIcon type="DownOutlined" :class="switcherCls"></AIcon>
    </template>
    <template #title="{ dataRef, title }">
      <span class="title">{{ title }}</span>
      <slot name="config" :data="dataRef"></slot>
      <!-- <j-button type="link" v-if="dataRef.type == 'customer' && dataRef.level === 0" @click="handleAddBtn(dataRef.key)">+下级</j-button>
      <j-button type="link" @click="handleEditBtn(dataRef)">配置</j-button>
      <j-button type="link" @click="handleDel(dataRef.key)">删除</j-button> -->
    </template>
  </j-tree>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import { useOperationButton } from '@/store/operationButton';
import type {
  AntTreeNodeDropEvent,
  TreeProps,
} from 'ant-design-vue/es/tree';
import { onlyMessage } from '@jetlinks/utils';


interface Emit {
  (e: 'update:btnList', value: any): void;
}
const props = defineProps({
  btnList: {
    type: Array as PropType<any[]>,
    default: () => [],
  }
})

const btnTree = computed({
  get() {
    return props.btnList
  },
  set(val) {
    emits('update:btnList', val)
  }
})
const operationButtonStore = useOperationButton();
/**点击配置按钮 */
const emits = defineEmits<Emit>();


const onDragEnter = () => {
  // console.log('111111');
}

const onDrop = (info: AntTreeNodeDropEvent) => {
  const dropKey = info.node.key;
  const dragKey = info.dragNode.key;
  const dropPos = info.node.pos?.split('-');
  const dropPosition = info.dropPosition - Number(dropPos?.[dropPos?.length - 1]);
  if(info.node.type !== 'customer' && dropPosition === 0) {
    onlyMessage('常用按钮下方不可以添加2级按钮', 'error');
    return ;
  }
  const loop = (data: TreeProps['treeData'], key: string | number, callback: any) => {
    data?.forEach((item, index) => {
      if (item.key === key) {
        return callback(item, index, data);
      }
      if (item.children) {
        return loop(item.children, key, callback);
      }
    });
  };
  const data = [...btnTree.value] as any;
  if(info.node.level === 1 && dropPosition === 0) {
    onlyMessage('仅支持2级按钮', 'error');
    return ;
  }
  if(info.dragNode.children?.length && (dropPosition === 0 || info.node.level === 1)) {
    onlyMessage('该按钮下存在2级按钮', 'error');
    return
  }
  // Find dragObject
  let dragObj: any;
  loop(data, dragKey, (item: any, index: number, arr: TreeProps['treeData']) => {
    arr?.splice(index, 1);
    dragObj = item;
  });
  if(dropPosition === 0) {
    dragObj.level = 1;
  } else {
    dragObj.level = info.node.level;
  }
  if (!info.dropToGap) {
    // Drop on the content
    loop(data, dropKey, (item: any) => {
      item.children = item.children || [];
      /// where to insert 示例添加到头部，可以是随意位置
      item.children.unshift(dragObj);
    });
  } else if (
    (info.node.children || []).length > 0 && // Has children
    info.node.expanded && // Is expanded
    dropPosition === 1 // On the bottom gap
  ) {
    loop(data, dropKey, (item: any, index: number, arr: TreeProps['treeData']) => {
      arr?.splice(index + 1, 0, dragObj);
      // item.children = item.children || [];
      // // where to insert 示例添加到头部，可以是随意位置
      // item.children.unshift(dragObj);
    });
  } else {
    let ar: TreeProps['treeData'] = [];
    let i = 0;
    loop(data, dropKey, (_item: any, index: number, arr: TreeProps['treeData']) => {
      ar = arr;
      i = index;
    });
    if (dropPosition === -1) {
      ar.splice(i, 0, dragObj);
    } else {
      ar.splice(i + 1, 0, dragObj);
    }
  }
  btnTree.value = data;
};
</script>
<style scoped>
.title {
  border-left: 1px solid;
  padding: 2px 50px 2px 10px;
  border-bottom: 1px solid;
}
</style>