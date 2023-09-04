<template>
  <div>
    <template v-if="listType === 'text'">
      <File v-bind="_componentProps" :value="_value" @change="onChange"/>
    </template>
    <template v-else>
      <Picture v-bind="_componentProps" :value="_value" @change="onChange"/>
    </template>
  </div>
</template>
  
  <script lang="ts" setup>
import { omit } from 'lodash-es'
import { computed } from 'vue'
import File from './File.vue'
import Picture from './Picture.vue'

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
    default: 'text',
  },
  value:Array
})
const _value:any = ref([])
const emit = defineEmits(['update:value'])

// const updateValue = (value:any) =>{
//   emit('update:value',value)
// }

watch(
  ()=>props.value,
  (val)=>{
    _value.value = val
  }
)

const onChange = (item:any)=>{
  // console.log('item---',item)
  emit('update:value',item)
}

const _componentProps = computed(() => {
  return omit(props, 'listType')
})
</script>