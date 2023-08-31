
<template>
   <div ref="containerRef" style="width: 100%; height: 100%;">
      <slot></slot>
      <Teleport to="body">
         <div class="menu" v-show="showMenu" ref="menuRef" :style="{
            left: x + 'px',
            top: y + 'px'
         }">
            <j-menu>
               <j-menu-item key="copy">复制</j-menu-item>
               <j-menu-item key="paste">粘贴</j-menu-item>
               <j-menu-item key="shear">剪切</j-menu-item>
               <j-menu-item key="delete">删除</j-menu-item>
               <j-menu-item key="collect">收藏为模版</j-menu-item>
            </j-menu>
         </div>
      </Teleport>
   </div>
</template>

<script setup lang='ts'>
import { useContextMenu } from '@/hooks/useContextMenu';
import { useEngine } from '@/store';
import { computed, ref } from 'vue';

const engine = useEngine()

const containerRef = ref(null)
const menuRef = ref<any>(null)

const { x, y, showMenu } = useContextMenu(containerRef, menuRef);
</script>

<style scoped lang='less'>
.menu {
   position: absolute;
   box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
}
</style>