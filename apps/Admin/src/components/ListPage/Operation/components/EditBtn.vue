<template>
  <div>
    <j-space>
      <j-button @click="handleBack" type="text">
        <AIcon type="LeftOutlined"></AIcon>
        返回
      </j-button>
    </j-space>
    <Edit :data="activeBtn" ref="EditRef"></Edit>
  </div>
</template>

<script setup lang="ts" name="EditBtn">
import Edit from './Edit.vue'
import { randomString } from '@jetlinks/utils'
import {
  activeBtnKey,
  editTypeKey,
  columnsTreeKey,
  parentKeyKey,
} from '../keys'
interface Emit {
  (e: 'update:steps', value: string): void
}
const props = defineProps({
  data: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
  steps: {
    type: String,
  },
})

const emits = defineEmits<Emit>()
const EditRef = ref();
const activeBtn = inject(activeBtnKey)
const editType = inject(editTypeKey)
const columnsTree = inject(columnsTreeKey)
const parentKey:any = inject(parentKeyKey)

const handleBack = () => {
  if(activeBtn!.value.key) {
    emits('update:steps', 'BtnsList')
  } else {
    emits('update:steps', 'BtnsType')
  }
}

const save = async (callback: (...any) => void) => {
  const valid = await EditRef.value?.submit()
  if(valid) {
    if(editType!.value == 'add'){
      if (parentKey.value) {
        columnsTree!.value.forEach((item, index) => {
          if (item.key === parentKey.value) {
            item.children?.push({ ...valid, key: randomString(16), level: 1 })
          }
        })
      } else {
        columnsTree!.value.push({ ...valid, key: randomString(16), level: 0 })
      }
    } else if(editType!.value == 'edit'){
      columnsTree!.value.forEach((item) => {
        if (item.key === valid.key) {
          Object.assign(item, valid)
        } else {
          item.children?.forEach((child) => {
            if (child.key === valid.key) {
              Object.assign(child, valid)
            }
          })
        }
      })
    }
    callback && callback(EditRef.value?.jsError, EditRef.value?.cssError);
  }
}

defineExpose({
  save,
})
</script>
<style scoped lang="less">
form {
  padding: 20px;
}
</style>
