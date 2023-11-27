<template>
  <div class="responder-warp">
    <span>
      function (value){ // value依赖项值
    </span>
    <div class="responder-content">
      <div class="code">
        <j-monaco-editor
          v-model:value="_value"
          @change="onChange"
        />
      </div>
      <div class="code-tip">
        <j-monaco-editor

        />
      </div>
    </div>
    <span>}</span>
  </div>
</template>

<script setup name="Responder">

const props = defineProps({
  value: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits('update:value')

const _value = ref(props.value)

const onChange = (v) => {
  _value.value = v
  emit('update:value', v)
}

</script>

<style scoped lang="less">
.responder-warp {


  .responder-content {
    display: flex;
    height: 300px;

    .code {
      flex-grow: 1;
      min-width: 0;
    }

    .code-tip {
      width: 250px;
      padding: 0 8px;
    }
  }

}
</style>
