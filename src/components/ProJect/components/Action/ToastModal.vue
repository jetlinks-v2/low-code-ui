
<template>
  <j-modal visible :width="300" :closable="false" :footer="null" @cancel="emit('close')">
    <div class="item">
      <span>
        名称 "{{props.data.name}}" 已被占用
      </span>
      <span>请选取其他名称</span>
      <j-button type="primary" style="width: 100%;" @click="onClick">好</j-button>
    </div>
  </j-modal>
  <InputModal v-if="visible" @close="visible = false" @save="onSave" :provider="props.data.type" />
</template>

<script setup lang='ts' name="ToastModal">
import InputModal from './InputModal.vue'

type Emits = {
  (e: 'save', data: string): void;
  (e: 'close'): void
};
const emit = defineEmits<Emits>();

const props = defineProps({
  data: {
    type: Object,
    default: {}
  },
})


const visible = ref<boolean>(false)
const onSave = (data) => {
  emit('save', data)
}

const onClick = ()=>{
  visible.value = true
  // emit('close')
}


</script>

<style scoped lang='less'>
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>