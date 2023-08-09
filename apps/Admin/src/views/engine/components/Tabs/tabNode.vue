<template>
  <div :class="className" @click="click">
    <div class="content">
      {{ title }}
    </div>
    <div class="remove" @click="remove">
      <AIcon type="CloseOutlined" />
    </div>
  </div>
</template>

<script setup name="SimpleTabs">

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'remove'])

const className = computed(() => {
  return {
    'tab-node': true,
    'active': props.active
  }
})

const click = () => {
  emit('click', props.id)
}

const remove = () => {
  emit('remove', props.id)
}

</script>

<style scoped lang="less">
.tab-node {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: transparent;
  outline: none;
  cursor: pointer;
  gap: 12px;
  border-bottom: 4px solid transparent;
  color: #f8f8f8;
  transition: all .3s;

  &:hover {
    background-color: #323844;
  }

  &.active {
    background-color: #3d424b;
    border-color: #568af2;
  }

  .content {
    flex: 0 0 auto;
    min-width: 0;
  }
}
</style>
