<template>
  <div class="menu-config" ref="menuConfigRef">
    <j-drawer
      title="菜单配置"
      placement="right"
      width="560px"
      :closable="false"
      :visible="open"
      :destroyOnClose="true"
      :getContainer="() => $refs.menuConfigRef"
      :wrap-style="{ position: 'absolute', zIndex: 1 }"
      @close="emits('update:open', false)"
    >
      <Menu
        ref="menuRef"
        @update:form="(newValue) => (subValue = newValue)"
        :errorList="errorList"
        :formData="formData"
      />
    </j-drawer>
  </div>
</template>
<script setup lang="ts">
import Menu from '@/components/ListPage/MenuConfig/components/menu.vue'
import { validMenu } from './utils/valid'
import { MENU_CONFIG } from '../keys';
interface Emit {
  (e: 'update:open', value: boolean): void
}

const emits = defineEmits<Emit>()
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: '',
  },
})
const menConfig = inject(MENU_CONFIG)
const open = computed({
  get() {
    return props.open
  },
  set(val: boolean) {
    emits('update:open', val)
  },
})
const subValue = ref({})
const menuRef = ref()
const formData = ref({ pageName: '', main: true, name: '', icon: '' })

const errorList = ref<any[]>([])
const valid = () => {
  errorList.value = validMenu(menConfig)
  return errorList.value.length ? [{message: '菜单配置错误'}] : []
  // return new Promise((resolve, reject) => {
  //   errorList.value = validMenu(menConfig)
  //   if(errorList.value.length) reject([{message: '菜单配置错误'}])
  //   else resolve([])
  // })
}
defineExpose({
  errorList,
  valid
})
</script>
