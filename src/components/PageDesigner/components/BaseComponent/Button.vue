<template>
  <j-button v-bind="omit(props, 'icon')">
    <template v-if="icon" #icon><AIcon :type="icon" /></template>
    {{ text }}
  </j-button>
</template>

<script lang="ts" setup>
import { omit } from "lodash-es";

const props = defineProps({
  text: {
    type: String,
    default: "",
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
  // loading: {
  //   type: String as PropType<"large" | "middle" | "small">,
  //   default: "middle",
  // },
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
});
</script>