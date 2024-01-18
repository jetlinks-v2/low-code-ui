<template>
  <div style="height: 100%;">
    <template v-if="listType === 'text' && !isButton">
      <Single v-if="maxCount === 1" v-bind="_componentProps" :value="_value" @change="onChange" />
      <Multiple v-else v-bind="_componentProps" :value="_value" @change="onChange" />
    </template>
    <template v-else-if="!isButton">
      <Picture v-bind="_componentProps" :value="_value" @change="onChange" />
    </template>
    <template v-if="isButton">
      <ButtonUpload v-bind="_componentProps" :list-type="listType" :value="_value" @change="onChange" />
    </template>
  </div>
</template>

  <script lang="ts" setup>
import { omit } from 'lodash-es'
import { computed, ref, watch } from 'vue'
import Single from './File/Single.vue'
import Multiple from './File/Multiple.vue'
import Picture from './Picture.vue'
import ButtonUpload from './ButtonUpload.vue'

const props = defineProps({
  fileSize: {
    type: Number,
    default: 2,
  },
  unit: {
    type: String,
    default: 'M',
  },
  accept: {
    type: Array,
  },
  maxCount: {
    type: Number,
    default: 1,
  },
  listType: {
    type: String,
    default:'text',
  },
  value: {
    type: String,
    default: '',
  },
  disabled:{
    type:Boolean,
    default:false
  },
  isButton:{
    type:Boolean,
    default:false
  },
  width:{
    type:Number,
  },
  noAccept:{
    type:Array,
  },
  imgDescription:{
    type:String,
    default:'请上传图片'
  },
  isCropper: {
    type: Boolean,
    default: true
  }
})
const _value: any = ref([])
const emit = defineEmits(['update:value', 'change'])

watch(
  () => props.value,
  (val) => {
    try {
      if(Array.isArray(val)){
      _value.value = val
      }else{
        _value.value = JSON.parse(val || '[]')
      }
    } catch (error) {
      console.error(error)
    }
  },
  {
    immediate: true,
    deep: true,
  },
)

const onChange = (item: any) => {
  const _value = item && item?.length > 0 ? JSON.stringify(item) : null
  emit('update:value', _value)
  emit('change', _value)
}

const _componentProps = computed(() => {
  console.log('listType',props)
  return omit(props, 'listType')
})
</script>
