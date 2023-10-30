<template>
  <j-modal
    :visible="props.visible"
    title="菜单图标"
    width="416px"
    :maskClosable="false"
    :getContainer='() => refs'
    :wrap-style="{ position: 'absolute', zIndex: 1001 }"
    :mask-style="{ position: 'absolute' }"
    @cancel="emits('update:visible', false)"
    @ok="confirm"
  >
    <j-scrollbar>
      <j-radio-group v-model:value="selected" class="radio">
        <j-radio-button
          v-for="typeStr in iconKeys"
          :value="typeStr"
          :key="typeStr"
          :class="{ active: selected === typeStr }"
        >
          <div class="icon-item">
            <AIcon :type="typeStr" />
          </div>
        </j-radio-button>
      </j-radio-group>
    </j-scrollbar>
  </j-modal>
</template>

<script setup lang="ts">
import iconKeys from './fields'
const emits = defineEmits(['confirm', 'update:visible', 'update:type'])
const props = defineProps<{
  visible: boolean,
  refs: any
  type: string,
}>()

const selected = ref(props.type)
const confirm = () => {
  emits('update:type', selected.value)
  emits('update:visible', false)
}


watch(() => props.visible, () => {
  selected.value = props.type
})
</script>

<style lang="less" scoped>
.radio {
  display: grid;
  grid-gap: 8px;
  grid-template-columns: repeat(6, 1fr);
  max-height: 200px;
  overflow-y: auto;

  .ant-radio-button-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    width: 48px;
    font-size: 20px;
    cursor: pointer;
    background: #f0f1f4;
    border-radius: 4px;
    border: none;
    &::before{
      display: none;
    }
    &.active {
      color: #415ed1;
      border-color: #415ed1;
      border-width: 2px;
      border-style: solid;
    }
  }
}
</style>
