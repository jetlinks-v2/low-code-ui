<template>
  <div>
    <j-button @click="visible = true">配置</j-button>
    <Config
      :type="type"
      v-if="visible"
      :data="value"
      @save="onSave"
      @close="onClose"
    />
  </div>
</template>
  
<script lang="ts" setup>
import { PropType, ref } from "vue";
import Config from "./Config.vue";

const props = defineProps({
  value: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  type: {
    type: String,
    default: "search",
  },
});
const emits = defineEmits(["update:value", "change"]);

const visible = ref<boolean>(false);

const onSave = (_dt: any[]) => {
  emits("update:value", _dt);
  emits("change", _dt);
  visible.value = false;
};

const onClose = () => {
  visible.value = false;
};
</script>