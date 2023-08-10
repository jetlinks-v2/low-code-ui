
<template>
   <div ref="containerRef" style="width: 100%; height: 100%;">
      <slot></slot>
      <Teleport to="body">
         <div class="menu" v-show="showMenu" ref="menuRef" :style="{
            left: x + 'px',
            top: y + 'px'
         }">
            <j-menu v-if="props.type === 'list'" @click="handleClick">
               <j-menu-item key="Profile">显示简介</j-menu-item>
               <j-menu-item key="Cut">剪切</j-menu-item>
               <j-menu-item key="Copy">复制</j-menu-item>
               <j-menu-item key="Paste">粘贴</j-menu-item>
               <j-menu-item key="Rename">重命名</j-menu-item>
               <j-menu-item key="Delete">删除</j-menu-item>
            </j-menu>

            <j-menu v-else @click="handleClick">
               <j-sub-menu key="Add" title="新建" style="width: 130px">
                  <j-menu-item key="Module">模块</j-menu-item>
                  <j-menu-item key="Resource">资源</j-menu-item>

                  <j-sub-menu key="Page" title="页面" style="width: 130px">
                     <j-menu-item style="width: 130px" key="HtmlPage">自定义html</j-menu-item>
                     <j-menu-item style="width: 130px" key="ListPage">列表页模版</j-menu-item>
                     <j-menu-item style="width: 130px" key="FormPage">表单页模版</j-menu-item>
                  </j-sub-menu>

                  <j-menu-item key="CRUD">增删改查</j-menu-item>
                  <j-menu-item key="SQL">SQL</j-menu-item>
                  <j-menu-item key="Function">函数</j-menu-item>
               </j-sub-menu>
               <j-menu-item key="Copy">
                  复制
               </j-menu-item>
            </j-menu>
         </div>
      </Teleport>
   </div>
</template>

<script setup lang='ts' name="ContextMenu">
import { useContextMenu } from '@/hooks/useContextMenu';

const containerRef = ref(null)
const menuRef = ref<any>(null)
const { x, y, showMenu } = useContextMenu(containerRef, menuRef);


const props = defineProps({
   menu: {
      type: Array,
      default: () => [],
   },
   type: {
      type: String,
      default: 'empty'
   },
   data: {
      type: Object,
      default: {}
   },
   onSelect: {
      type: Function,
   }
})

const emit = defineEmits<{
   select: [menuKey: string, divData?: object]
}>()


const handleClick = (item: any) => {
   if (props.type === 'list') {
      emit('select', item.key, props.data)
   } else {
      emit('select', item.key)
   }
}

</script>

<style scoped lang='less'>
.menu {
   width: 150px;
   position: absolute;
}
</style>