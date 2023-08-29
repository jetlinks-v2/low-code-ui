<template>
  <!-- 导入 -->
  <j-modal
    :maskClosable="false"
    :visible="visible"
    :confirm-loading="confirmLoading"
    title="导入"
    okText="确定"
    cancelText="取消"
    width="630px"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <div style="margin-top: 10px">
      <j-form :model="modelRef" ref="formRef">
        <j-form-item label="下载模版">
          <j-radio-group
            v-model:value="modelRef.fileType"
            placeholder="请选择文件格式"
          >
            <j-radio-button value="xlsx" @click="message.success('导出成功')"
              >模板格式 .xlsx</j-radio-button
            >
            <j-radio-button value="csv" @click="message.success('导出成功')"
              >模板格式. csv</j-radio-button
            >
          </j-radio-group>
        </j-form-item>

        <j-form-item
          label="文件上传"
          name="upload"
          :rules="[{ required: true, message: '请上传文件!' }]"
        >
          <j-upload
            v-model:fileList="modelRef.upload"
            :dragger="true"
            name="file"
            :multiple="true"
            :showUploadList="false"
          >
            <div class="ant-upload-drag-icon">
              <p>演示文件.xlsx</p>
            </div>
          </j-upload>
        </j-form-item>
        <j-form-item v-show="false">
          <j-button type="primary" @click="handleOk">Check</j-button>
        </j-form-item>
      </j-form>
    </div>
  </j-modal>
  <j-modal :visible="progressVisible" :closable="false">
    <h3 v-if="percent !== 100">正在导入</h3>
    <h3 v-else>导入完成</h3>

    <template #footer>
      <j-button
        v-if="percent === 100"
        type="primary"
        @click="progressVisible = false"
        >完成</j-button
      >
    </template>
    <div style="display: flex" v-if="percent !== 100">
      <j-progress
        style="width: 500px"
        :percent="percent"
        :show-info="false"
        :stroke-color="{
          '0%': '#87d068',
          '100%': '#87d068',
        }"
      />
      <p style="margin-left: 10px">{{ modelRef.upload.length }}</p>
    </div>
    <div v-else>
      <span style="margin-right: 20px"
        >导入成功：{{ modelRef.upload.length }}</span
      >
      <span>导入失败：0</span>
    </div>
  </j-modal>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'

const emit = defineEmits(['close', 'save'])
const visible = ref(true)
const formRef = ref()
const modelRef = reactive({
  upload: [],
  fileType: 'xlsx',
})
const progressVisible = ref(false)
const percent = ref(0)
const confirmLoading = ref<boolean>(false)

const handleCancel = () => {
  emit('close', true)
}

const handleOk = async () => {
  await formRef?.value?.validateFields()
  visible.value = false
  progressVisible.value = true
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      percent.value++
    }, 1000)
  }
}
</script>

<style scoped lang="less">
.ant-upload-drag-icon {
  width: 300px;
  height: 150px;
  border: 1px dashed #000000;
  background-color: rgba(187, 187, 187, 0.5);
  text-align: center;
  line-height: 150px;
  &:hover {
    cursor: pointer !important;
  }
}
</style>
