<template>
  <div class="btn-tree">
    <j-tree
      :tree-data="btnTree"
      :show-icon="false"
      :draggable="true"
      show-line
      block-node
      :selectable="false"
      :defaultExpandAll="true"
      @drop="onDrop"
    >
      <template #switcherIcon="{ switcherCls }">
        <AIcon type="CaretDownOutlined" :class="switcherCls"></AIcon>
      </template>
      <template #title="{ dataRef, title }">
        <div class="title-config" >
          <slot name="title" :data="dataRef"></slot>
          <span class="title" v-if="!slotsName.includes('title')">{{ slotsName }}</span>
          <slot name="config" :data="dataRef"></slot>
        </div>
      </template>
    </j-tree>
  </div>
</template>
<script setup lang="ts" name="BtnTree">
import type { PropType } from 'vue';
import type {
  AntTreeNodeDropEvent,
  TreeProps,
} from 'ant-design-vue/es/tree';
import { onlyMessage } from '@jetlinks-web/utils';
import { useSlots } from 'vue';

const slots = useSlots();
const slotsName = Object.keys(slots)
interface Emit {
  (e: 'update:btnList', value: any): void;
}
const props = defineProps({
  btnList: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  draggable: {
    type: Boolean,
    default: true,
  },
})

const btnTree = computed({
  get() {
    return props.btnList
  },
  set(val) {
    emits('update:btnList', val)
  }
})
/**点击配置按钮 */
const emits = defineEmits<Emit>();


const onDrop = (info: AntTreeNodeDropEvent) => {
  const dropKey = info.node.key;
  const dragKey = info.dragNode.key;
  const dropPos = info.node.pos?.split('-');
  const dropPosition = info.dropPosition - Number(dropPos?.[dropPos?.length - 1]);
  if(!props.draggable && dropPosition === 0) {
    onlyMessage('操作列支持1级按钮', 'error')
    return
  }
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
    onlyMessage('仅支持2级按钮', 'error');
    return
  }
  // Find dragObject
  let dragObj: any;
  loop(data, dragKey, (item: any, index: number, arr: TreeProps['treeData']) => {
    arr?.splice(index, 1);
    dragObj = item;
  });
  dragObj.level = (dropPosition === 0) ? 1 : info.node.level;
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
    ar.splice(dropPosition === -1 ? i : i + 1, 0, dragObj);
  }
  btnTree.value = data;
};
</script>
<style scoped lang="less">
.btn-tree {
  margin: 20px 0;
    .title-config{
    display: flex;
    justify-content: space-between;
  }
}

</style>
