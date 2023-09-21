
<template>
  <j-modal visible :width="300" @cancel="emit('close')" :footer="null">
    <div class="item">
      <div class="item-text">确定删除</div>
      <div class="item-title">
        <j-ellipsis>
          {{ props.data.name }}
        </j-ellipsis>
      </div>
      <div class="item-btn">
        <j-button @click="emit('close')" style="margin-right: 10px;">取消</j-button>
        <j-button type="primary" @click="emit('save', props.data)">确定</j-button>
      </div>
    </div>
  </j-modal>
</template>
  
<script setup lang='ts' name="DelModal">

const props = defineProps({
  data: {
    type: Object,
    default: {}
  },
})
type Emits = {
  (e: 'save', data: any): void;
  (e: 'close'): void
};
const emit = defineEmits<Emits>();

</script>
  
<style scoped lang='less'>
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 120px;
  justify-content: center;

  .item-text {
    height: 30px;
    margin-top: 20px;
  }

  .item-title{
    width: 200px;
  }
  .item-btn {
    margin-top: 20px;
  }
}
</style>