<template>
  <div>
    <j-radio-group v-model:value="selected" class="radio" @change="change">
      <j-radio-button :value="icon" :class="{ active: selected === icon }">
        <ImageUpload
          class="upload"
          v-model:value="icon"
          :accept="accept"
          style="width: 60px; height: 60px"
        />
      </j-radio-button>
      <j-radio-button
        v-for="typeStr in iconKeys"
        :value="typeStr"
        :key="typeStr"
        :class="{ active: selected === typeStr }"
      >
        <AIcon :type="typeStr" />
      </j-radio-button>
    </j-radio-group>
  </div>
</template>
<script setup>
import iconKeys from './fields'
const props = defineProps({
  value: {
    type: String,
    default: '',
  },
})
// 上传icon格式
const accept = '.jpg,.jpeg,.png'
const icon = ref('')
const selected = ref(props.modelValue)

const change = () => {}

defineExpose({ selected })

watch(icon, () => {
  selected.value = icon.value
})
</script>
<style scoped lang="less">
.radio {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(6, 1fr);
  max-height: 500px;
  overflow-y: auto;

  .ant-radio-button-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    font-size: 40px;
    border: 2px solid #efefef;
    border-radius: 2px;
    cursor: pointer;

    &.active {
      color: #415ed1;
      border-color: #415ed1;
    }
  }
}
</style>
