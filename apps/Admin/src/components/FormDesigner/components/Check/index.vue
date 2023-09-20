<template>
  <div class="check" :style="{ height: _height }">
    <div class="check-btn">
      <j-button v-if="!checkVisible" type="primary" @click="checkVisible = true"
        >数据校验</j-button
      >
      <j-space v-else>
        <j-button class="btn" @click="onCancel">取消</j-button>
        <j-button class="btn" @click="onInput('get')"
          >获取数据<j-tooltip title="将表单中填写的所有数据获取到代码框中">
            <AIcon type="QuestionCircleOutlined" /> </j-tooltip
        ></j-button>
        <j-button :disabled="disabled" class="btn" @click="onInput('set')"
          >加载数据<j-tooltip title="将代码框输入的模拟数据反显到表单">
            <AIcon type="QuestionCircleOutlined" /> </j-tooltip
        ></j-button>
      </j-space>
    </div>
    <div class="check-editor" v-if="checkVisible">
      <j-monaco-editor
        @change="onChange"
        v-model="editData"
        :language="'json'"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, unref, ref, inject, watch } from 'vue'

const designer: any = inject('FormDesigner')

const editData = ref<string>()
const checkVisible = ref<boolean>(false)
const disabled = ref<boolean>(true)

const _height = computed(() => {
  return !unref(checkVisible) ? '40px' : '248px'
})

// 获取数据
const onInput = async (type: 'get' | 'set') => {
  if (type === 'set') {
    const obj = JSON.parse(editData?.value || '{}')
    Object.assign(designer.formState, obj)
  } else {
    const obj = await designer.onSave()?.catch(() => {})
    if (obj) {
      editData.value = JSON.stringify(obj)
    }
  }
}

const onChange = (e) => {
  disabled.value = true
  try {
    const a = JSON.parse(e)
    disabled.value = false
  } catch (error) {
    disabled.value = true
  }
}

const onCancel = () => {
  checkVisible.value = false
  editData.value = ''
}
</script>

<style lang="less" scoped>
.check {
  background-color: #1b1f29;
  width: 100%;
  .check-btn {
    display: flex;
    align-items: center;
    height: 40px;
    justify-content: flex-end;
    padding-right: 24px;

    .btn {
      background-color: #404756;
      box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);
      border: none;
      color: #cfcfd0;
    }
  }

  .check-editor {
    height: 200px;
    overflow: hidden;
  }
}
</style>