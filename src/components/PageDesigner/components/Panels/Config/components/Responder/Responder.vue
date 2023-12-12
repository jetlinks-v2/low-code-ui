<template>
  <div class="responder-warp">
    <div>
      function ($self, $dep, $depValue)
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

const defaultCode = `
  /**
  *$self 组件本身的数据，可以获取值和设值
  *$dep 被依赖的组件的key
  *$depValue 被依赖的组件的值
  */

  $self.visible = true // 控制组件的显示和隐藏
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
