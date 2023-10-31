
<template>
    <j-select
      allowClear
      v-model:value="_value"
      max-tag-count="responsive"
      mode="multiple"
      placeholder="请选择"
      style="width:100%"
      @change="onChange"
    >
        <j-select-option :value="defaultOption.value" :disabled="_value?.length && !_value?.includes('default')">{{
            defaultOption.label }}</j-select-option>
        <j-select-option v-for="item in options" :value="item.value" :disabled="_value?.includes('default')">{{ item.label
        }}</j-select-option>
    </j-select>
</template>

<script setup  name="OppositeSelect">
import { ref } from 'vue';




const props = defineProps({
    defaultOption: {
        type: Object,
        default: () => ({
            value: 'default',
            label: '无'
        })
    },
    options: {
        type: [Object],
        default: []
    },
    value: Array
})

const emits = defineEmits(['update:value', 'change'])

const _value = ref(props.defaultOption.value ? [props.defaultOption.value] : undefined)

const onChange = (val) => {
    // console.log('val', val)
    let _val = val.includes('default') ? [] : val.length === 0 ? undefined : val
    emits('update:value', _val)
    emits('change', _val)
}

watch(
    () => props.value,
    (val) => {
        if (val?.length === 0) {
            _value.value = ['default']
        } else {
            _value.value = val
        }
    }
)

</script>

<style scoped lang='less'></style>
