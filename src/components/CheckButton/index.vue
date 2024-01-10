<template>
  <div class="box" :style="_style">
    <div
      :key="item?.value"
      @click="onClick(item.value)"
      v-for="item in options"
      :class="{ 'box-item': true, active: item.value === props.value }"
    >
      {{ item?.label }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  value: {
    type: String,
  },
})
const emits = defineEmits(['update:value', 'change'])

const _style = {
  gridTemplateColumns: `repeat(${props.options?.length || 1}, auto)`,
}

const onClick = (_val: string) => {
  emits('update:value', _val)
  emits('change', _val)
}
</script>

<style lang="less" scoped>
.box {
  display: grid;
  .box-item {
    background-color: #f0f3fa;
    border-radius: 2px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    cursor: pointer;

    &.active {
      background-color: @primary-color;
      color: #fff;
    }

    &:hover {
      background-color: @primary-color-hover;
      color: #fff;
    }

    &:not(:last-child) {
      margin-right: 16px;
    }
  }
}
</style>