<template>
  <div class="tree-search">
    <div class="search-text">
      <j-input placeholder="搜索" >
        <template #suffix>
          <AIcon type="SearchOutlined" style="color: rgba(0, 0, 0, 0.45)" />
        </template>
      </j-input>
    </div>
    <div class="tool">
      <j-tooltip title="全部展开">
        <div class="icon-button" @click="engine.expandedAll">
          <AIcon type="ArrowsAltOutlined" />
        </div>
      </j-tooltip>
      <j-tooltip title="全部收起">
        <div class="icon-button" @click="engine.packUpAll">
          <AIcon type="ShrinkOutlined" />
        </div>
      </j-tooltip>
      <j-tooltip title="隐藏">
        <div :class="collapsedClass">
          <AIcon type="CaretLeftOutlined" @click="collapsedChange" />
        </div>
      </j-tooltip>
    </div>
  </div>
</template>

<script setup name="TreeSearch">
import { useEngine } from '@/store'

const engine = useEngine()

const emit = defineEmits(['collapsed'])

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

const collapsedChange = () => {
  emit('collapsed', !props.collapsed)
}

</script>

<style scoped lang="less">
.tree-search {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 6px 6px;

  .search-text {
    flex: 1 1 auto;
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
      width: 26px;
      height: 26px;

      &:hover {
        background-color: #e1e1e1;
      }
    }
  }
}
</style>
