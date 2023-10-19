<template>
  <div class="editor-modal-warp">
    <j-monaco-editor
      v-model="myValue"
      :language="language"
      @change="valueChange"
      @errorChange="errorChange"
    />
    <div class="open-modal" @click="visible = true">
      <div class="icon">
        <AIcon type="ArrowsAltOutlined" />
      </div>
    </div>
  </div>
  <Modal
    v-if="visible"
    :value="myValue"
    :title="title"
    :language="language"
    :height="height"
    :width="width"
    @save="save"
    @cancel="cancel"
  />
</template>

<script setup name="EditorModal">
import Modal from './modal.vue'
import { defaultProps } from './data'

const props = defineProps({
  ...defaultProps()
})

const emit = defineEmits(['update:value', 'errorChange'])

const errorChange = (v) => {
  emit('errorChange', v)
}

const myValue = ref()
const visible = ref(false)

const valueChange = (v) => {
  myValue.value = v
  emit('update:value', v)
}

const cancel = () => {
  visible.value = false
}

const save = (v) => {
  valueChange(v)
  cancel()
}

watch(() => props.value, () => {
  myValue.value = props.value
}, { immediate: true })

</script>

<style scoped lang="less">
.editor-modal-warp {
  position: relative;
  height: 300px;

  .open-modal {
    position: absolute;
    right: 14px;
    bottom: 6px;

    .icon {
      font-size: 12px;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      color: rgba(255,255,255, .8);
      border: 1px solid rgba(255,255,255, .8);
    }
  }
}
</style>