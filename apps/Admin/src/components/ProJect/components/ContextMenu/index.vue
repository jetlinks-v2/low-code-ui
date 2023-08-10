
<template>
   <div ref="containerRef" style="width: 100%; height: 100%;">
      <slot></slot>
      <Teleport to="body">
         <div class="menu" v-show="showMenu" ref="menuRef" :style="{
            left: x + 'px',
            top: y + 'px'
         }">
            <j-menu v-if="props.type === 'list'" @click="handleClick">
               <j-menu-item key="1">
                  菜单1
               </j-menu-item>
               <j-menu-item key="2">
                  菜单2
               </j-menu-item>
               <j-menu-item key="3">
                  菜单3
               </j-menu-item>
               <j-sub-menu key="4">
                  <template #title>菜单4</template>
                  <j-menu-item key="4-1">菜单4-1</j-menu-item>
                  <j-menu-item key="4-2">菜单4-2</j-menu-item>
               </j-sub-menu>
            </j-menu>

            <j-menu v-else>
               <j-menu-item key="1">
                  菜单1
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
   id: {
      type: String,
      default: ''
   },
   onSelect: {
      type: Function,
   }
})

const emit = defineEmits<{
   select: [menuKey: string, divId?: string]
}>()


const handleClick = (item:any) => {
   if (props.type === 'list') {
      emit('select',item.key,props.id)
   } else {
      emit('select',item.key)
   }
}

</script>

<style scoped lang='less'>
.menu {
   width: 150px;
   position: absolute;
}
</style>