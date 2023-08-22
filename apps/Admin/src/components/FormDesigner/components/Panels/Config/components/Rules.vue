<template>
  <div class="list">
    <Draggable
      :list="list"
      class="list-group"
      handle=".handle"
      item-key="name"
    >
      <template #item="{ element, index }">
        <div class="list-group-item">
          <AIcon class="handle" type="AlignLeftOutlined"></AIcon>
          <j-button size="small">配置规则{{ element?.text }}</j-button>
          <AIcon type="CloseOutlined" @click="onDelete(index)" />
        </div>
      </template>
    </Draggable>
    <j-button type="dashed" style="width: 100%" @click="onClick">
      <AIcon type="PlusOutlined" />
      添加校验规则
    </j-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Draggable from 'vuedraggable'
import { uid } from '../../../../utils/uid'

const validatorOptions = [
  { label: 'URL地址', value: 'url' },
  { label: '邮箱格式', value: 'email' },
  { label: '数字格式', value: 'number' },
  { label: '整数格式', value: 'integer' },
  { label: '身份证格式', value: 'idcard' },
  { label: '手机号格式', value: 'phone' },
  { label: '货币格式', value: 'money' },
  { label: '中文格式', value: 'zh' },
  { label: '日期格式', value: 'date' },
  { label: '邮编格式', value: 'zip' },
]
const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
})
const emits = defineEmits(['update:value'])
const list = ref<any[]>([])

const onClick = () => {
  list.value.push({ name: 'test ' + uid(), id: uid(), text: '' })
}

const onDelete = (index: number) => {
    list.value.splice(index, 1)
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