<template>
  <div class="menu-config">
    <j-drawer
      title="菜单配置"
      placement="right"
      :closable="false"
      :visible="open"
      @close="emits('update:open', false)"
    >
      <Menu
        :pageName="pageName"
        ref="menuRef"
        @update:form="(newValue) => (subValue = newValue)"
        :errorList="errorList"
      />
    </j-drawer>
  </div>
</template>
<script setup lang="ts">
import Menu from '@/components/ListPage/MenuConfig/components/menu.vue'
import { validMenu } from './utils/valid'
import { useAllListDataStore } from '@/store/listForm'
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
const configurationStore = useAllListDataStore()
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
const pageName = ref('')
onMounted(() => {
  configurationStore.setALLlistDataInfo('menu', menuRef.value?.form, props.id)
})

const errorList = ref<any[]>([])
const valid = () => {
  return new Promise((resolve, reject) => {
    errorList.value = validMenu(menConfig)
    if(errorList.value.length) reject(errorList.value)
    else resolve([])
  })
}
defineExpose({
  errorList,
  valid
})

watch(
  () => subValue.value,
  (val) => {
    configurationStore.setALLlistDataInfo('menu', val, props.id)
  },
)
</script>
