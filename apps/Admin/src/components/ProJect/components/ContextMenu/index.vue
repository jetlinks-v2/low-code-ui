
<template>
   <div ref="containerRef" style="width: 100%; height: 100%">
      <slot></slot>
      <Teleport to="body">
         <div class="menu" v-show="showMenu" ref="menuRef" :style="{
            left: x + 'px',
            top: y + 'px'
         }">
            <j-menu v-if="props.type === 'list'" :selectedKeys="[]" @click="handleClick">
               <j-menu-item :key="actionMap['Profile'].key">{{ actionMap['Profile'].value }}</j-menu-item>
               <!-- <j-menu-item key="Cut">剪切</j-menu-item> -->
               <j-menu-item :key="actionMap['Copy'].key">{{ actionMap['Copy'].value }}</j-menu-item>
               <j-menu-item :key="actionMap['Paste'].key" :disabled="disabled">{{ actionMap['Paste'].value }}</j-menu-item>
               <j-menu-item :key="actionMap['Rename'].key">{{ actionMap['Rename'].value }}</j-menu-item>
               <j-menu-item :key="actionMap['Delete'].key">{{ actionMap['Delete'].value }}</j-menu-item>
            </j-menu>

            <j-menu v-else @click="handleClick" :selectedKeys="['']">
               <j-sub-menu :key="actionMap['Add'].key" :title="actionMap['Add'].value" style="width: 150px; ">
                  <template #icon>
                     <img :src="getImage('/project/add.png')" style="width: 18px; height: 21px;margin-right: 6px;">
                  </template>
                  <div v-for="item in projectListMenu">
                     <j-menu-item :key="item.type" style="line-height: 26px;height: 26px;font-size: 16px;">
                        <template #icon>
                           <img :src="item.img" style="width: 24px; height: 24px;">
                        </template>
                        {{ providerMap[item.type] }}
                     </j-menu-item>
                     <j-menu-item :key="item.type" style="height: 16px;line-height: 16px;">
                        <div class="menu-text">{{ item.text }}</div>
                     </j-menu-item>
                  </div>
               </j-sub-menu>

               <!-- <j-sub-menu :key="actionMap['Add'].key" :title="actionMap['Add'].value" style="width: 150px; ">
                  <j-menu-item :key="providerEnum.Module" >
                     <template #icon>
                        <img :src="getImage('/project/module.png')" style="width: 24px; height: 24px;">
                     </template>
                     {{ providerMap[providerEnum.Module] }}
                  </j-menu-item>
                  <j-menu-item :key="providerEnum.HtmlPage">
                     <template #icon>
                        <img :src="getImage('/project/html.png')" style="width: 24px; height: 24px;">
                     </template>
                     {{ providerMap[providerEnum.HtmlPage] }}
                  </j-menu-item>
                  <j-menu-item :key="providerEnum.ListPage">
                     <template #icon>
                        <img :src="getImage('/project/list.png')" style="width: 24px; height: 24px;">
                     </template>
                     {{ providerMap[providerEnum.ListPage] }}
                  </j-menu-item>
                  <j-menu-item :key="providerEnum.FormPage">
                     <template #icon>
                        <img :src="getImage('/project/form.png')" style="width: 24px; height: 24px;">
                     </template>
                     {{ providerMap[providerEnum.FormPage] }}
                  </j-menu-item>
                  <j-menu-item :key="providerEnum.CRUD">
                     <template #icon>
                        <img :src="getImage('/project/curd.png')" style="width: 24px; height: 24px;">
                     </template>
                     {{ providerMap[providerEnum.CRUD] }}
                  </j-menu-item>
                  <j-menu-item :key="providerEnum.SQL">
                     <template #icon>
                        <img :src="getImage('/project/sql.png')" style="width: 24px; height: 24px;">
                     </template>
                     {{ providerMap[providerEnum.SQL] }}
                  </j-menu-item>
                  <j-menu-item :key="providerEnum.Function">
                     <template #icon>
                        <img :src="getImage('/project/function.png')" style="width: 24px; height: 24px;">
                     </template>
                     {{ providerMap[providerEnum.Function] }}
                  </j-menu-item>
               </j-sub-menu> -->
               <j-menu-item :key="actionMap['Paste'].key" :disabled="disabled" v-if="type !== 'project'">
                  <template #icon>
                     <img :src="getImage('/project/paste.png')" style="width: 24px; height: 24px;">
                  </template>
                  {{actionMap['Paste'].value }}
               </j-menu-item>
            </j-menu>
         </div>
      </Teleport>
   </div>
</template>

<script setup lang='ts' name="ContextMenu">
import { useContextMenu } from '@/hooks/useContextMenu';
import { useEngine } from '@/store'
import { providerEnum, providerMap, actionMap, projectListMenu } from '../../index'
import { getImage } from '@jetlinks/utils';

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

const disabled = computed(() => engine.copyFile === '')

const emit = defineEmits<{
   select: [menuKey: string, divData?: object]
   show: [isShow: boolean]
}>()


const handleClick = (item: any) => {
   if (props.type === 'list') {
      emit('select', item.key, props.data)
   } else {
      emit('select', item.key)
   }
}

watch(
   () => showMenu.value,
   () => {
      emit('show', showMenu.value)
   }
)

</script>

<style scoped lang='less'>
.menu {
   // width: 150px;
   position: absolute;
   z-index: 999;

   :deep(.ant-menu) {
      border: 1px solid #eee;

      .ant-menu-vertical>.ant-menu-submenu>.ant-menu-submenu-title {
         line-height: 26px;
         height: 26px;
      }
   }

   .menu-img {
      width: 24px;
      height: 24px;
   }
}

.menu-text {
   color: rgba(0, 0, 0, 0.55);
   font-size: 14px;
   line-height: 14px;
   margin-left: 40px;
}
</style>
