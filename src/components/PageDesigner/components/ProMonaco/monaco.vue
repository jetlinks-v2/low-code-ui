<template>
  <div class="monaco-warp">
    <div class="code">
      <j-monaco-editor
        v-model:modelValue="myValue"
        :language="language"
        :registrationTips="registrationTips"
        :registrationTypescript="registrationTypescript"
        @change="change"
      />
    </div>
    <div class="code-tips">
      <j-monaco-editor
        readOnly
        :modelValue="tipCode"
        :language="language"
        :registrationTypescript="{
          name: 'typescript',
          typescript: tipCode
        }"
      />
    </div>
  </div>
</template>

<script setup name="ProMonaco">

const props = defineProps({
  value: {
    type: String,
    default: undefined
  },
  language: {
    type: String,
    default: 'javascript'
  },
  registrationTips: {
    type: Object,
    default: () => ({
      name: 'javascript',
      suggestions: []
    })
  },
  tipCode: {
    type: '',
    default: undefined
  }
})

const emit = defineEmits(['update:value'])

const myValue = ref(props.value)

const registrationTypescript = computed(() => {
  return ['javascript', 'typescript'].includes(props.language)? {
    name: 'typescript',
    typescript: props.tipCode
  } : undefined
})

const change = () => {
  emit('update:value', myValue.value)
}

</script>

<style scoped lang="less">
.monaco-warp {
  display: flex;
  justify-content: space-between;

  .code {
    width: calc(60% - 2px);
  }

  .code-tips {
    width: 40%;
  }
}
</style>
