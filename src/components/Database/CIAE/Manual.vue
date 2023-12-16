<template>
  <div class="manual-warp">
    <div class="warp-items" ref="SortableRef">
      <div class="warp-item" :key="item.key" v-for="(item, index) in dataSource">
        <div class="item-select">
          <j-input v-model:value="item.value" placeholder="请输入可选项" maxLength="64" @change="valueChange"/>
        </div>
        <div class="item-action">
          <j-space>
            <AIcon class="delete" type="DeleteOutlined" @click="() => deleteItem(index)"/>
            <div class="glyphicon-move">
              <AIcon type="icon-tongbu"/>
            </div>
          </j-space>
        </div>
      </div>
    </div>
    <j-button type="dashed" :disabled="dataSource.length > 10" @click="() => add()" style="width: 100%;margin-top: 12px;">
      <template #icon>
        <AIcon type="PlusCircleOutlined"/>
      </template>
      新增
    </j-button>
  </div>
</template>

<script setup name="Manual">
import Sortable from "sortablejs";
import {randomString} from "@jetlinks-web/utils";
import { Form } from 'ant-design-vue'

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:value'])

const formItemContext = Form.useInjectFormItemContext()
const dataSource = ref(props.value?.map(item => ({ key: randomString(6), value: item })))
const SortableRef = ref()

const valueChange = () => {
  emit('update:value', dataSource.value.map(item => item.value))
  formItemContext.onFieldChange()
}

const deleteItem = (index) => {
  dataSource.value.splice(index, 1)
  valueChange()
}
const add = () => {
  dataSource.value.push({
    key: randomString(6),
    value: ''
  })
  valueChange()
}

onMounted(() => {
  Sortable.create(SortableRef.value, {
    handle: '.glyphicon-move',
    animation: 150,
    onEnd: ({ newIndex, oldIndex }) => {
      if (newIndex !== oldIndex) {
        const currRow = dataSource.value.splice(oldIndex, 1)[0]
        dataSource.value.splice(newIndex, 0, currRow)
      }
    }
  })
})

</script>

<style scoped lang="less">
.manual-warp {
  .warp-item {
    display: flex;
    gap: 6px;
    align-items: center;
    &:not(:last-child) {
      margin-bottom: 12px;
    }

    .item-select {
      flex: 1;
    }

    .item-action {
      width: 60px;
      .delete {
        color: var(--ant-error-color);
      }
      .glyphicon-move {
        transform: rotateZ(90deg);
      }
    }
  }
}
</style>
