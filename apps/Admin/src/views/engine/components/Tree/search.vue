<template>
  <div class="tree-search">
    <div class="search-text">
      <j-input placeholder="搜索" />
    </div>
    <div class="tool">
      <j-tooltip title="全部展开">
        <div class="icon-button">
          <AIcon type="ArrowsAltOutlined" />
        </div>
      </j-tooltip>
      <j-tooltip title="全部收起">
        <div class="icon-button">
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
