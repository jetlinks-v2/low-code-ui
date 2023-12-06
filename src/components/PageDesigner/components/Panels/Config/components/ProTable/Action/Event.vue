<template>
  <div>
    <j-button @click="visible = true">配置</j-button>
    <Modal v-if="visible" :value="value" @cancel="visible = false" @save="onSave" />
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import Modal from './Modal.vue';

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  },
});

const emits = defineEmits(["update:value", "change"]);
const visible = ref<boolean>(false)

const onSave = (val: any) => {
  emits("update:value", val);
  emits("change", val);
  visible.value = false
}
</script>

