<template>
  <div>
    <div class="list">
      <Draggable
        :list="list"
        class="list-group"
        handle=".handle"
        item-key="key"
      >
        <template #item="{ element, index }">
          <div class="list-group-item">
            <AIcon class="handle" type="AlignLeftOutlined"></AIcon>
            <DrawerSetter :value="element" @change="onChange" :index="index" />
            <AIcon type="CloseOutlined" @click="onDelete(index)" />
          </div>
        </template>
      </Draggable>
      <j-button type="dashed" style="width: 100%" @click="onClick">
        <AIcon type="PlusOutlined" />
        添加校验规则
      </j-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, unref } from 'vue'
import { uid } from '../../../../../utils/uid'
import Draggable from '../../../../JSortable/index'
import DrawerSetter from './DrawerSetter.vue'

const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
})
const emits = defineEmits(['update:value', 'change'])
const list = ref<any[]>([])

watchEffect(() => {
  list.value = props?.value || []
})

const onClick = () => {
  list.value.push({key: uid()})
  emits('update:value', unref(list))
  emits('change', unref(list))
}

const onDelete = (index: number) => {
  list.value.splice(index, 1)
  emits('update:value', unref(list))
  emits('change', unref(list))
}

const onChange = (item: any, index: number) => {
  list.value[index] = item
  emits('update:value', unref(list))
  emits('change', unref(list))
}
</script>

<style scoped lang="less">
.list {
  background-color: #eee;
  padding: 10px;
}
.list-group {
  .list-group-item {
    background-color: #fff;
    padding: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
}
</style>