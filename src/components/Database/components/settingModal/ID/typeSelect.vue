<template>
  <div class="code-warp">
    <div
      v-for="item in options"
      :class="{
        'code-item': true,
        'active': myValue === item.value
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
  }
})

const myValue = ref(props.value)

const emit = defineEmits(['update:value', 'change'])

const onClick = (key) => {
  myValue.value = key
  emit('update:value', key)
  emit('change', key)
}

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
