<template>
  <div>
    <j-tag v-bind="omit(props, ['closeIcon', 'icon'])">
      <template v-if="icon" #icon><AIcon :type="icon" /></template>
      <template v-if="icon" #closeIcon><AIcon :type="closeIcon" /></template>
      {{ text }}
    </j-tag>
  </div>
</template>

<script lang="ts" setup>
import { omit } from "lodash-es";
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  closable: {
    type: Boolean,
    default: false,
  },
  closeIcon: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
});
</script>