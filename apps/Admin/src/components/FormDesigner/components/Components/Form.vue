<template>
  <div class="form-warp">
    <FormPreview
      :value="myValue"
      :mode="mode"
      :data="config"
      @valueChange="valueChange"
    />
  </div>

</template>
<script lang="ts" setup>
import FormPreview from '@/components/FormDesigner/preview.vue'

const props = defineProps({
  value:{
    type:Array,
    default:[]
  },
  mode: {
    type:String,
    default:''
  },
  disabled:{
    type:Boolean,
    default:false
  },
  data: {
    type: Object,
    default: () =>({})
  },
})

const emit = defineEmits(['update:value'])

const myValue = ref(props.value)

const config = computed(() => {
  return JSON.parse(props.data.componentProps?.source?.code || '{}')
})

const valueChange = (e) => {
  emit('update:value', e)
}

watch(() => JSON.stringify(props.value), () => {
  myValue.value = props.value
})

</script>
<style scoped>
.form-warp {
  border: 1px solid #e6e6e6;
}
</style>
