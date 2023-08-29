
<template>
   <div ref="containerRef" style="width: 100%; height: 100%;">
      <slot></slot>
      <Teleport to="body">
         <div class="menu" v-show="showMenu" ref="menuRef" :style="{
            left: x + 'px',
            top: y + 'px'
         }">
            <j-menu v-if="props.type === 'list'" @click="handleClick">
               <j-menu-item :key="actionMap['Profile'].key">{{actionMap['Profile'].value}}</j-menu-item>
               <!-- <j-menu-item key="Cut">剪切</j-menu-item> -->
               <j-menu-item :key="actionMap['Copy'].key">{{actionMap['Copy'].value  }}</j-menu-item>
               <j-menu-item :key="actionMap['Paste'].key" :disabled="disabled">{{actionMap['Paste'].value  }}</j-menu-item>
               <j-menu-item :key="actionMap['Rename'].key">{{actionMap['Rename'].value  }}</j-menu-item>
               <j-menu-item :key="actionMap['Delete'].key">{{actionMap['Delete'].value  }}</j-menu-item>
            </j-menu>

            <j-menu v-else @click="handleClick">
               <j-sub-menu :key="actionMap['Add'].key" :title="actionMap['Add'].value" style="width: 150px;">
                  <j-menu-item :key="providerEnum.Module">{{ providerMap[providerEnum.Module] }}</j-menu-item>
                  <!-- <j-menu-item key="Resource">资源</j-menu-item> -->

                  <j-sub-menu :key="providerEnum.Page" :title="providerMap[providerEnum.Page]" >
                     <j-menu-item  :key="providerEnum.HtmlPage">{{ providerMap[providerEnum.HtmlPage] }}</j-menu-item>
                     <j-menu-item  :key="providerEnum.ListPage">{{ providerMap[providerEnum.ListPage] }}</j-menu-item>
                     <j-menu-item  :key="providerEnum.FormPage">{{ providerMap[providerEnum.FormPage] }}</j-menu-item>
                  </j-sub-menu>

                  <j-menu-item :key="providerEnum.CRUD">{{ providerMap[providerEnum.CRUD] }}</j-menu-item>
                  <j-menu-item :key="providerEnum.SQL">{{ providerMap[providerEnum.SQL] }}</j-menu-item>
                  <j-menu-item :key="providerEnum.Function">{{ providerMap[providerEnum.Function] }}</j-menu-item>
               </j-sub-menu>
               <j-menu-item :key="actionMap['Paste'].key" :disabled="disabled">{{actionMap['Paste'].value  }}</j-menu-item>
            </j-menu>
         </div>
      </Teleport>
   </div>
</template>

<script setup lang='ts' name="ContextMenu">
import { useContextMenu } from '@/hooks/useContextMenu';
import { useEngine } from '@/store'
import { providerEnum,providerMap,actionMap } from '../../index'

const engine = useEngine()

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
   },
})

const disabled = computed(()=>engine.copyFile==='')

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
   // width: 150px;
   position: absolute;
}
</style>