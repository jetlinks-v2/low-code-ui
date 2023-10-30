<template>
  <div class="tree-search">
    <div class="search-text">
      <j-input placeholder="搜索" :bordered="false" class="search-input" @change="search">
        <template #prefix>
          <AIcon type="SearchOutlined" style="color: rgba(0, 0, 0, 0.45)" />
        </template>
      </j-input>
    </div>
    <div class="tool">
      <j-tooltip title="全部展开" v-if="!engine.isExpandAll">
        <div class="icon-button" @click="engine.expandedAll">
          <AIcon type="DownOutlined" />
        </div>
      </j-tooltip>
      <j-tooltip title="全部收起" v-else>
        <div class="icon-button" @click="engine.packUpAll">
          <AIcon type="UpOutlined" />
        </div>
      </j-tooltip>
      <j-tooltip title="隐藏">
        <div :class="collapsedClass" @click="collapsedChange">
          <img :src="getImage('/tree/fold.png')">
         
          <!-- <AIcon type="CaretLeftOutlined" @click="collapsedChange" /> -->
        </div>
      </j-tooltip>
    </div>
  </div>
</template>

<script setup name="TreeSearch">
import { useEngine, useProduct } from '@/store'
import {filterTreeNodes, getImage} from '@jetlinks/utils';
import { debounce } from 'lodash-es'

const engine = useEngine()
const product = useProduct()

const emit = defineEmits(['collapsed'])
const isExpand = ref(false)

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: true
  }
})

const collapsedClass = computed(() => {
  return {
    'icon-button': true,
    'collapsed': props.collapsed
  }
})

const search = debounce((v) => {
  console.log(v.target.value)
  product.filterTree(v.target.value)
}, 300)

const collapsedChange = () => {
  emit('collapsed', !props.collapsed)
}

</script>

<style scoped lang="less">
.tree-search {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 6px 12px;
  border-bottom: 1px solid #D9D9D9;
  margin-bottom: 10px;

  .search-text {
    flex: 1 1 auto;
    background-color: #F6F7F9;
    border-radius: 6px;
    margin-left: 20px;
  }

  .tool {
    display: flex;
    gap: 4px;
    font-size: 18px;

    .icon-button {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      color: #424242;
      width: 28px;
      height: 28px;
      font-size: 16px;
      padding: 2px;
      img{
        width: 60%;
        height: 50%;
      }

      &:hover {
        background-color: #F6F7F9;
      }
    }
  }
}
</style>
