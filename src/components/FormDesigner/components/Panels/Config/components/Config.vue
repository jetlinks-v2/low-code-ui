<!-- 组件属性 -->
<template>
  <div>
    <template v-if="['input-number', 'number-step'].includes(type)">
      <j-form-item
        :validateFirst="true"
        :rules="maxRules"
        label="最大值"
        :name="['componentProps', 'max']"
      >
        <j-input-number
          style="width: 100%"
          v-model:value="target.componentProps.max"
          placeholder="请输入"
          :max="99999999999999"
          @change="onDataChange"
        />
      </j-form-item>
      <j-form-item
        :validateFirst="true"
        :rules="minRules"
        label="最小值"
        :name="['componentProps', 'min']"
      >
        <j-input-number
          style="width: 100%"
          v-model:value="target.componentProps.min"
          placeholder="请输入"
          :max="99999999999999"
          @change="onDataChange"
        />
      </j-form-item>
      <j-form-item
        label="精度"
        :name="['componentProps', 'precision']"
        required
        :validateFirst="true"
      >
        <j-input-number
          style="width: 100%"
          v-model:value="target.componentProps.precision"
          placeholder="请输入"
          :precision="0"
          :min="0"
          :max="99999999999999"
          @change="onDataChange"
        />
      </j-form-item>
    </template>
    <template v-if="['number-step'].includes(type)">
      <j-form-item
          label="步数"
          :name="['componentProps', 'step']"
          required
          :validateFirst="true"
      >
        <j-input-number
            style="width: 100%"
            v-model:value="target.componentProps.step"
            placeholder="请输入"
            :precision="0"
            :min="1"
            :max="99999999999999"
            @change="onDataChange"
        />
      </j-form-item>
      <j-form-item
          :validateFirst="true"
          label="输入框展示值的格式"
          :name="['componentProps', 'formatter']"
      >
        <EditorBtn
            @change="onDataChange"
            v-model:value="target.componentProps.formatter"
            text="编写代码"
            language="javascript"
            tip="function(value: number | string, info: { userTyping: boolean, input: string }): string"
        />
      </j-form-item>
      <j-form-item
          :validateFirst="true"
          label="指定从 formatter 里转换回数字的方式"
          :name="['componentProps', 'parser']"
      >
        <EditorBtn
            @change="onDataChange"
            v-model:value="target.componentProps.parser"
            text="编写代码"
            language="javascript"
            tip="function(value: string): number"
        />
      </j-form-item>
    </template>
    <template
      v-if="
        ['select', 'org', 'role', 'user', 'product', 'device'].includes(type)
      "
    >
      <j-form-item
        :validateFirst="true"
        label="类型"
        :name="['componentProps', 'mode']"
      >
        <CheckButton
          :options="[
            { label: '单选项', value: undefined },
            { label: '多选项', value: 'multiple' },
          ]"
          @change="onModeChange"
          v-model:value="target.componentProps.mode"
        />
      </j-form-item>
    </template>
    <template v-if="['upload'].includes(type)">
      <j-form-item
        label="上传内容"
        :validateFirst="true"
        :name="['componentProps', 'listType']"
        :rules="[
          {
            required: true,
            message: '请选择',
          },
        ]"
      >
        <CheckButton
          :options="[
            { label: '文件', value: 'text' },
            { label: '图片', value: 'picture' },
          ]"
          @change="onChange"
          v-model:value="target.componentProps.listType"
        />
      </j-form-item>
      <j-form-item
        label="上传个数"
        :name="['componentProps', 'maxCount']"
        required
        :validateFirst="true"
      >
        <j-input-number
          style="width: 100%"
          v-model:value="target.componentProps.maxCount"
          placeholder="请输入"
          :precision="0"
          :min="1"
          @change="onDataChange"
        />
      </j-form-item>
      <j-form-item
        :validateFirst="true"
        :name="['componentProps', 'accept']"
        label="格式"
      >
        <j-select
          mode="multiple"
          placeholder="请选择"
          v-model:value="target.componentProps.accept"
          @change="onDataChange"
        >
          <j-select-option :key="item" v-for="item in list" :value="item">{{
            item
          }}</j-select-option>
        </j-select>
      </j-form-item>
      <j-form-item
        :validateFirst="true"
        :name="['componentProps', 'noAccept']"
        label="非格式"
      >
        <j-select
          mode="multiple"
          placeholder="请选择"
          v-model:value="target.componentProps.noAccept"
          @change="onDataChange"
        >
          <j-select-option :key="item" v-for="item in NoType" :value="item">{{
            item
          }}</j-select-option>
        </j-select>
      </j-form-item>
      <j-form-item
        required
        :name="['componentProps', 'fileSize']"
        label="单个大小"
        :rules="rules"
        :validateFirst="true"
      >
        <j-input-group compact>
          <j-input-number
            style="width: 60%"
            v-model:value="target.componentProps.fileSize"
            :min="0"
            @change="onDataChange"
          />
          <j-select
            :defaultValue="'M'"
            style="width: 40%"
            @change="onDataChange"
            v-model:value="target.componentProps.unit"
          >
            <j-select-option value="M">M</j-select-option>
            <j-select-option value="KB">KB</j-select-option>
          </j-select>
        </j-input-group>
      </j-form-item>
      <j-form-item
          label="是否为按钮"
          :validateFirst="true"
          :name="['componentProps', 'isButton']"
          :rules="[
            {
              required: true,
              message: '请选择',
            },
          ]"
      >
        <CheckButton
          :options="[
            { label: '否', value: false },
            { label: '是', value: true },
          ]"
          @change="onChange"
          v-model:value="target.componentProps.isButton"
        />
      </j-form-item>
      <j-form-item
          v-if="!target.componentProps.isButton && target.componentProps.listType !== 'text' && target.componentProps.maxCount === 1"
          label="组件宽度"
          :validateFirst="true"
          :name="['componentProps', 'width']"
          :rules="[
            {
              required: true,
              message: '请输入',
            },
          ]"
      >
        <j-input
          @change="onChange"
          v-model:value="target.componentProps.width"
        />
      </j-form-item>
        <j-form-item
        v-if="!target.componentProps.isButton && target.componentProps.listType !== 'text' && target.componentProps.maxCount === 1"
          :validateFirst="true"
          :name="['componentProps', 'imgDescription']"
          label="组件内部说明"
        >
        <j-input
            @change="onChange"
            v-model:value="target.componentProps.imgDescription"
          />
        </j-form-item>
      <j-form-item
        v-if="['upload'].includes(type)"
        :name="['componentProps','isCropper']"
        label="是否开启裁剪"
      >
        <CheckButton
          :options="[
            { label: '否', value: false },
            { label: '是', value: true },
          ]"
          v-model:value="target.componentProps.isCropper"
        />
      </j-form-item>
    </template>
    <template v-if="['tree-select', 'select-card'].includes(type)">
      <j-form-item
        :validateFirst="true"
        label="类型"
        :name="['componentProps', 'multiple']"
      >
        <CheckButton
          :options="[
            { label: '单选项', value: false },
            { label: '多选项', value: true },
          ]"
          @change="onMultipleChange"
          v-model:value="target.componentProps.multiple"
        />
      </j-form-item>
      <template v-if="['tree-select'].includes(type)">
        <j-form-item
          label="可选节点"
          v-if="target.componentProps.multiple"
          :name="['componentProps', 'treeCheckStrictly']"
          :validateFirst="true"
          :rules="[
            {
              required: true,
              message: '请选择',
            },
          ]"
        >
          <j-select
            v-model:value="target.componentProps.treeCheckStrictly"
            placeholder="请选择"
            @change="onDataChange"
          >
            <j-select-option :value="false">联动选择</j-select-option>
            <j-select-option :value="true">仅选子节点</j-select-option>
          </j-select>
        </j-form-item>
      </template>
    </template>
    <template v-if="['tree-select', 'select'].includes(type)">
      <j-form-item
        label="支持模糊搜索"
        :name="['componentProps', 'showSearch']"
        :validateFirst="true"
        :rules="[
          {
            required: true,
            message: '请选择',
          },
        ]"
      >
        <j-switch
          @change="onDataChange"
          v-model:checked="target.componentProps.showSearch"
        />
      </j-form-item>
    </template>
    <template v-if="['table'].includes(type)">
      <j-form-item
        :validateFirst="true"
        label="内容对齐"
        :name="['componentProps', 'align']"
      >
        <j-select
          v-model:value="target.componentProps.align"
          placeholder="请选择"
          @change="onDataChange"
        >
          <j-select-option :value="'left'">左</j-select-option>
          <j-select-option :value="'right'">右</j-select-option>
          <j-select-option :value="'center'">中</j-select-option>
        </j-select>
      </j-form-item>
      <j-form-item
        :validateFirst="true"
        label="表格高度"
        :name="['componentProps', 'height']"
      >
        <j-input-number
          v-model:value="target.componentProps.height"
          placeholder="请输入"
          :min="1"
          style="width: 100%"
          @change="onDataChange"
        />
      </j-form-item>
    </template>
    <template v-if="['geo'].includes(type)">
      <j-form-item label="组件形态" :name="['componentProps', 'type']">
        <CheckButton
          :options="[
            { label: '树形下拉框', value: 'tree' },
            { label: '分级下拉框', value: 'select' },
          ]"
          @change="onChange"
          v-model:value="target.componentProps.type"
        />
      </j-form-item>
      <j-form-item
        label="可选项格式"
        :name="['componentProps', 'format']"
        :validateFirst="true"
        :rules="[
          {
            required: true,
            message: '请选择',
          },
        ]"
      >
        <j-select
          v-model:value="target.componentProps.format"
          placeholder="请选择"
          @change="onDataChange"
        >
        <j-select-option :value="'name'">区域名称</j-select-option>
          <j-select-option :value="'code'">行政区划代码</j-select-option>
          <j-select-option :value="'nameCode'">区域名称｜行政区划代码</j-select-option>
        </j-select>
      </j-form-item>
    </template>
    <template v-if="['date-picker'].includes(type)">
      <j-form-item
        label="精度"
        :name="['componentProps', 'format']"
        :validateFirst="true"
        :rules="[
          {
            required: true,
            message: '请选择',
          },
        ]"
      >
        <j-select
          :defaultValue="'M'"
          @change="onDateChange"
          v-model:value="target.componentProps.format"
        >
          <j-select-option value="YYYY-MM-DD">年-月-日</j-select-option>
          <j-select-option value="YYYY-MM-DD HH:mm:ss"
            >时-分-秒</j-select-option
          >
        </j-select>
      </j-form-item>
    </template>
    <template
      v-if="
        [
          'input',
          'textarea',
          'input-number',
          'input-password',
          'select-card',
          'upload',
          'switch',
          'tree-select',
          'select',
          'date-picker',
          'time-picker',
          'editor',
          'org',
          'role',
          'user',
          'product',
          'device',
          'geo',
          'form',
          'radio',
          'checkbox'
        ].includes(type)
      "
    >
      <j-form-item
        label="约束"
        :name="['formItemProps', 'required']"
        :validateFirst="true"
        :rules="[
          {
            required: true,
            message: '请选择',
          },
        ]"
      >
        <CheckButton
          :options="[
            { label: '必填', value: true },
            { label: '非必填', value: false },
          ]"
          @change="onDataChange"
          v-model:value="target.formItemProps.required"
        />
      </j-form-item>
    </template>
    <template
      v-if="
        [
          'input',
          'input-group',
          'textarea',
          'input-number',
          'input-password',
          'tree-select',
          'select',
          'date-picker',
          'time-picker',
          'editor',
          'number-step'
        ].includes(type)
      "
    >
      <j-form-item
        :validateFirst="true"
        label="占位提示"
        :name="['componentProps', 'placeholder']"
      >
        <j-input
          placeholder="请输入"
          v-model:value="target.componentProps.placeholder"
          :maxlength="32"
          @change="onDataChange"
        />
      </j-form-item>
    </template>
    <template
      v-if="
        [
          'input',
        ].includes(type)
      "
    >
      <j-form-item
        :validateFirst="true"
        label="前标签"
        :name="['componentProps', 'addonBefore']"
      >
        <j-input
          placeholder="请输入"
          v-model:value="target.componentProps.addonBefore"
          :maxlength="10"
          @change="onDataChange"
        />
      </j-form-item>
      <j-form-item
        :validateFirst="true"
        label="后标签"
        :name="['componentProps', 'addonAfter']"
      >
        <j-input
          placeholder="请输入"
          v-model:value="target.componentProps.addonAfter"
          :maxlength="10"
          @change="onDataChange"
        />
      </j-form-item>
    </template>
    <template v-if="['editor'].includes(type)">
      <j-form-item
          label="高度"
          :name="['componentProps', 'height']"
          :validateFirst="true"
      >
        <j-input-number
            placeholder="请输入"
            @change="onDataChange"
            style="width: 100%"
            :precision="0"
            :min="0"
            v-model:value="target.componentProps.height"
        />
      </j-form-item>
    </template>
    <!-- 规则校验 -->
    <template v-if="rulesVisible">
      <j-form-item
        :rules="ruleRules"
        :name="['formItemProps', 'rules']"
        :validateFirst="true"
      >
        <Rule
          :type="type"
          v-model:value="target.formItemProps.rules"
          @change="onChange"
        />
      </j-form-item>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useTarget } from '../../../../hooks'
import { computed, unref } from 'vue'
import Rule from './Rules/Rule.vue'
import { uid } from '@LowCode/components/FormDesigner/utils/uid'
import { CheckButton } from '@LowCode/components/index'
import EditorBtn from "./EditorBtn.vue";

const { target } = useTarget()

const emits = defineEmits(['refresh'])

const type = computed(() => {
  return target.value?.type
})

const onChange = () => {
  target.value.componentProps.accept = undefined
  emits('refresh', target.value)
}

const textType = ['.xlsx', '.xls', '.csv', '.zip', '.json']
const imgType = ['.jpg', '.png', '.jpeg']
const NoType = ['.xlsx', '.xls', '.csv', '.zip', '.json','.jpg', '.png', '.jpeg','.exe']

const list = computed(() =>
  target.value.componentProps?.listType === 'text' ? textType : imgType,
)

const rulesVisible = computed(() => {
  return [
    'input',
    'textarea',
    'input-password',
    'date-picker',
    'time-picker',
    'editor',
    'number-step'
  ].includes(unref(type))
})

const rules = [
  {
    required: true,
    message: '请输入单个大小',
  },
  {
    validator(_: any, value: number) {
      if (value === null || value === undefined) return Promise.resolve()
      if (value === 0) return Promise.reject(`单个大小应该大于0`)
      return Promise.resolve()
    },
    trigger: 'change',
  },
]

const maxRules = [
  {
    required: true,
    message: '请输入最大值',
  },
  {
    validator(_: any, value: number) {
      if (value === null || value === undefined) return Promise.resolve()
      if (value < target.value.componentProps.min)
        return Promise.reject(`最大值必须大于最小值`)
      return Promise.resolve()
    },
    trigger: 'change',
  },
]

const minRules = [
  {
    required: true,
    message: '请输入最小值',
  },
  {
    validator(_: any, value: number) {
      if (value === null || value === undefined) return Promise.resolve()
      if (value > target.value.componentProps.max)
        return Promise.reject(`最大值必须大于最小值`)
      return Promise.resolve()
    },
    trigger: 'change',
  },
]

const ruleRules = [
  {
    validator(_: any, value: any) {
      const _value = (value || []).find((item) => {
        return !item.trigger?.length
      })
      if (_value) {
        return Promise.reject(`请正确填写规则配置`)
      }
      return Promise.resolve()
    },
    trigger: 'change',
  },
]

const onDataChange = () => {
  emits('refresh', target.value)
}

const onModeChange = () => {
  if (unref(type) !== 'select') {
    target.value.formItemProps.name = `${type.value}_${uid()}`
  }
  emits('refresh', target.value)
}

const onMultipleChange = (e) => {
  if (e) {
    target.value.componentProps.treeCheckable = true
  } else {
    target.value.componentProps.treeCheckable = false
    target.value.componentProps.treeCheckStrictly = false
  }
  emits('refresh', target.value)
}

const onDateChange = (e) => {
  target.value.componentProps.format = e
  target.value.componentProps.valueFormat = e
  target.value.componentProps.showTime = !(e === 'YYYY-MM-DD')
  emits('refresh', target.value)
}
</script>
