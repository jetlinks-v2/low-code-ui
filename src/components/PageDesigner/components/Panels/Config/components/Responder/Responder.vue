<template>
  <div class="responder-warp">
    <div>
      function (self, dep, depValue)
    </div>
    <div class="responder-content">
      <div class="code">
        <j-monaco-editor
          v-model:modelValue="_value"
          language="javascript"
          :registrationTypescript="registrationTypescript"
          @change="onChange"
        />
      </div>
      <div class="code-tip">
        <j-monaco-editor
            readOnly
            :modelValue="defaultCode"
            language="javascript"
            :registrationTypescript="registrationTypescript"
        />
      </div>
    </div>
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

const defaultCode = ` // return返回值作为显示值
  (function (value) {
    return value["属性值"]
    // 可以自由组合值
    // return value["属性值1"] + value["属性值2"]
  })

`

const registrationTypescript = {
  name: 'typescript',
  typescript: `
    const value: Record<string, any>
  `
}

const onChange = (v) => {
  _value.value = v
  emit('update:value', v)
}

</script>

<style scoped lang="less">
.responder-warp {


  .responder-content {
    display: flex;
    height: 320px;

    .code {
      flex-grow: 1;
      min-width: 0;
    }

    .code-tip {
      width: 450px;
      padding: 0 8px;
    }
  }

}
</style>
