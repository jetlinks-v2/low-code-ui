<template>
  <div class="number-range">
    <j-input-number v-model:value="myValue[0]" @change="minChange" />
    <span>-</span>
    <j-input-number v-model:value="myValue[1]" @change="maxChange" />
  </div>
</template>

<script setup name="SettingRange">

const props = defineProps({
  max: {
    type: Array,
    default: () => []
  },
  min: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:max', "update:min"])

const myValue = reactive([undefined, undefined])

const minChange = (e) => {
  myValue[0] = e
  emit('update:min', e)
}

const maxChange = (e) => {
  myValue[1] = e
  emit('update:max', e)
}

watch(() => JSON.stringify(props.value || []), () => {
  if (props.value) {
    myValue[0] = props.min
    myValue[1] = props.max
  } else {
    myValue[0] = undefined
    myValue[1] = undefined
  }
}, { immediate: true })

</script>

<style scoped lang="less">
.number-range {
  display: flex;
  gap: 12px;
  align-items: center;

  :deep(.ant-input-number) {
    flex: 1 1 auto;
    min-width: 0;
  }
}
</style>
