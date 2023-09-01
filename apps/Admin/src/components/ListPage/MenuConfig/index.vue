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
        ref="menuRef"
        @update:form="(newValue) => (subValue = newValue)"
        :formData="formData"
      />
    </j-drawer>
  </div>
</template>
<script setup lang="ts">
import Menu from '@/components/ListPage/MenuConfig/components/menu.vue'
import { useAllListDataStore } from '@/store/listForm'
interface Emit {
  (e: 'update:open', value: boolean): void
}

const emits = defineEmits<Emit>()
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: () => {},
  },
})
const configurationStore = useAllListDataStore()
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
onMounted(() => {
  formData.value =
    configurationStore.getALLlistDataInfo(props.data?.id)?.menu || {}
  formData.value.pageName = props.data?.title || ''
})

watch(
  () => props.data,
  (val) => {
    formData.value.pageName = val.title || ''
  },
)
watch(
  () => subValue.value,
  (val) => {
    configurationStore.setALLlistDataInfo('menu', val, props.data?.id)
  },
)
</script>
