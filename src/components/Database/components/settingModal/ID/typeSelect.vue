<template>
  <div class="code-warp">
    <div
      v-for="item in options"
      :class="{
        'code-item': true,
        'active': myValue.includes(item.value)
      }"
      @click="() => { onClick(item.value) }"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script setup name="TypeSelect">

const props = defineProps({
  value: {
    type: String,
    default: undefined
  },
  options: {
    type: Array,
    default: () => ([])
  },
  multiple: {
    type: Boolean,
    default: false
  }
})

const myValue = ref(props.multiple ? props.value : [props.value])

const emit = defineEmits(['update:value', 'change'])

const changeValue = (val) => {
  emit('update:value', val)
  emit('change', val)
}

const onClick = (key) => {
  if (props.multiple) {
    const valueSet = new Set(myValue.value || [])
    if (valueSet.has(key)) {
      valueSet.delete(key)
    } else {
      valueSet.add(key)
    }
    myValue.value = [...valueSet.values()]
    changeValue([...valueSet.values()])
  } else {
    myValue.value = [key]
    changeValue(key)
  }
}

watch(() => props.value, () =>{
  myValue.value = props.multiple ? props.value : [props.value]
})

</script>

<style scoped lang="less">
.code-warp {
  display: flex;
  gap: 12px;

  .code-item {
    flex: auto 1;
    padding: 10px 16px;
    text-align: center;
    border-radius: 6px;
    border: 1px solid #e3e3e3;
    cursor: pointer;
    transition: all .2s;

    &.active {
      border-color: var(--ant-primary-color);
    }
  }
}
</style>
