<template>
  <div>
    <j-dropdown>
      <j-button v-bind="omit(props, ['icon', 'text'])">{{ text }}</j-button>
      <template #overlay>
        <j-menu>
          <j-menu-item v-for="item in menu" :key="item?.key">
            <j-button v-bind="omit(item, ['key', 'text'])">{{
              item?.text
            }}</j-button>
          </j-menu-item>
        </j-menu>
      </template>
    </j-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { omit } from "lodash-es";

const props = defineProps({
  text: {
    type: String,
    default: "批量操作",
  },
  type: {
    type: String as PropType<
      "primary" | "dashed" | "link" | "text" | "default"
    >,
    default: "default",
  },
  shape: {
    type: String as PropType<"circle" | "round" | "default">,
    default: "default",
  },
  size: {
    type: String as PropType<"large" | "middle" | "small">,
    default: "middle",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  ghost: {
    type: Boolean,
    default: false,
  },
  danger: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
  },
  menu: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});
</script>

<style lang="less" scoped>
</style>