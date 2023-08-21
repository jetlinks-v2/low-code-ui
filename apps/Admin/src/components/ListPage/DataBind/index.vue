<template>
  <div class="data-bind">
    <j-form layout="inline">
      <j-form-item label="数据绑定">
        <j-select style="width: 200px">
          <j-select-option
            v-for="item in functions"
            :value="item.id"
            :key="item.id"
          >
            {{ item.name }}
          </j-select-option>
        </j-select>
      </j-form-item>
      <j-form-item>
        <j-select style="width: 200px"></j-select>
      </j-form-item>
      <j-form-item>
        <j-button type="link">变更</j-button>
      </j-form-item>
      <j-form-item>
        <j-button type="link">校验</j-button>
      </j-form-item>
      <j-form-item v-if="!open">
        <j-button @click="emits('update:open', true)">操作向导</j-button>
      </j-form-item>
    </j-form>
  </div>
</template>

<script setup lang="ts" name="DataBind">
import { useProduct } from '@/store'
import { omit } from 'lodash-es'

interface Emit {
  (e: 'update:open', value: boolean): void
}

const emits = defineEmits<Emit>()
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const productStore = useProduct()

const functions = ref<any[]>([])
const pages = ref<any[]>([])

/**树形结构转一维数组 */
const treeToArr = (data: any[]) => {
  data.forEach((item) => {
    if (item.functions && item.functions.length) {
      functions.value.push(...item.functions)
    }
    if (item.type !== 'ListPage') {
      pages.value.push(omit(item, 'children'))
    }
    if (item.children) {
      treeToArr(item.children)
    }
  })
}

treeToArr(productStore.data)
</script>

<style scoped lang="less">
.data-bind {
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 1px 4px #0015291f;
}
</style>
