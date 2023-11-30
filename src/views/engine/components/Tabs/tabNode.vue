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
  padding: 8px 12px;
  background-color: #ececec;
  outline: none;
  cursor: pointer;
  gap: 12px;
  border-bottom: 4px solid transparent;
  color: #6a6a6a;
  transition: all .3s;

  &:hover {
    background-color: rgba(#ececec, .8);
  }

  &.active {
    background-color: #ffffff;
    //border-color: #333;
  }

  .content {
    flex: 0 0 auto;
    min-width: 0;
  }
}
</style>
