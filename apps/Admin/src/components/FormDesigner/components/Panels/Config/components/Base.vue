<template>
  <div>
    <template v-if="!['collapse-item', 'tabs-item'].includes(type)">
      <j-form-item required label="组件类型" name="type">
        <j-select :disabled="true" :value="target.type" />
      </j-form-item>
    </template>
    <template
      v-if="
        ![
          'grid',
          'card',
          'tabs',
          'collapse',
          'space',
          'collapse-item',
          'tabs-item',
          'table-item'
        ].includes(type)
      "
    >
      <j-form-item
        label="名称"
        :name="['formItemProps', 'label']"
        v-if="type !== 'text'"
        :rules="[
          {
            required: true,
            message: '请输入',
            trigger: 'change',
          },
        ]"
      >
        <j-input
          placeholder="请输入"
          :maxlength="64"
          v-model:value="target.formItemProps.label"
        />
      </j-form-item>
      <j-form-item
        label="标识"
        :name="['formItemProps', 'name']"
        required
        :rules="rules"
      >
        <j-input
          placeholder="请输入"
          :maxlength="64"
          v-model:value="target.formItemProps.name"
        />
      </j-form-item>
      <template v-if="['text'].includes(type)">
        <j-form-item
          label="文本内容"
          :name="['componentProps', 'value']"
          required
        >
          <j-input
            placeholder="请输入"
            v-model:value="target.componentProps.value"
          />
        </j-form-item>
      </template>
      <template
        v-if="
          [
            'input',
            'textarea',
            'input-number',
            'input-password',
            'tree-select',
            'select',
            'date-picker',
            'time-picker',
          ].includes(type)
        "
      >
        <j-form-item label="提示语" :name="['componentProps', 'placeholder']">
          <j-input
            placeholder="请输入"
            v-model:value="target.componentProps.placeholder"
            :maxlength="32"
          />
        </j-form-item>
      </template>
      <template v-if="['select-card', 'tree-select', 'select'].includes(type)">
        <j-form-item
          label="类型"
          :name="['componentProps', 'mode']"
          :rules="[
            {
              required: true,
              message: '请选择',
            },
          ]"
        >
          <j-radio-group
            v-model:value="target.componentProps.mode"
            button-style="solid"
          >
            <j-radio-button :value="''">单选项</j-radio-button>
            <j-radio-button :value="'multiple'">多选项</j-radio-button>
          </j-radio-group>
        </j-form-item>
      </template>
      <template v-if="['upload'].includes(type)">
        <j-form-item
          label="上传内容"
          :name="['componentProps', 'listType']"
          required
        >
          <j-radio-group
            v-model:value="target.componentProps.listType"
            button-style="solid"
          >
            <j-radio-button :value="'text'">文件</j-radio-button>
            <j-radio-button :value="'picture'">图片</j-radio-button>
          </j-radio-group>
        </j-form-item>
        <j-form-item
          label="上传个数"
          :name="['componentProps', 'maxCount']"
          required
        >
          <j-input-number
            style="width: 100%"
            v-model:value="target.componentProps.maxCount"
            placeholder="请输入"
            :precision="0"
            :min="1"
          />
        </j-form-item>
      </template>
      <template v-if="['tree-select'].includes(type)">
        <j-form-item
          label="可选节点"
          :name="['componentProps', 'treeCheckStrictly']"
          required
        >
          <j-select
            v-model:value="target.componentProps.treeCheckStrictly"
            placeholder="请选择"
          >
            <j-select-option :value="false">联动选择</j-select-option>
            <j-select-option :value="true">仅选子节点</j-select-option>
          </j-select>
        </j-form-item>
      </template>
      <template v-if="['tree-select', 'select'].includes(type)">
        <j-form-item
          label="支持模糊搜索"
          :name="['componentProps', 'showSearch']"
          required
        >
          <j-switch v-model:checked="target.componentProps.showSearch" />
        </j-form-item>
      </template>
      <template v-if="['table'].includes(type)">
        <j-form-item
          label="数据绑定"
          :name="['componentProps', 'data']"
          required
        >
          <j-select
            v-model:value="target.componentProps.data"
            placeholder="请选择"
          >
            <j-select-option :value="1">1</j-select-option>
          </j-select>
        </j-form-item>
      </template>
    </template>
    <template v-else>
      <template v-if="type === 'card'">
        <j-form-item
          label="卡片名称"
          :name="['componentProps', 'title']"
          :rules="[
            {
              required: true,
              message: '请输入',
              trigger: 'change',
            },
          ]"
        >
          <j-input
            placeholder="请输入"
            :maxlength="64"
            v-model:value="target.componentProps.title"
          />
        </j-form-item>
      </template>
      <template v-if="['card', 'collapse', 'tabs'].includes(type)">
        <j-form-item
          required
          label="容器组件"
          :name="['formItemProps', 'isLayout']"
        >
          <j-switch
            v-model:checked="target.formItemProps.isLayout"
            @change="onSwitch"
          />
        </j-form-item>
        <template v-if="target.formItemProps.isLayout">
          <j-form-item
            label="标识"
            :name="['formItemProps', 'name']"
            required
            :rules="rules"
          >
            <j-input
              placeholder="请输入"
              :maxlength="64"
              v-model:value="target.formItemProps.name"
            />
          </j-form-item>
          <j-form-item label="名称" :name="['formItemProps', 'label']" required>
            <j-input
              placeholder="请输入"
              :maxlength="64"
              v-model:value="target.formItemProps.label"
            />
          </j-form-item>
        </template>
      </template>
      <template v-if="['collapse-item'].includes(type)">
        <j-form-item label="名称" :name="['componentProps', 'header']" required>
          <j-input
            placeholder="请输入"
            :maxlength="64"
            v-model:value="target.componentProps.header"
          />
        </j-form-item>
        <j-form-item
          label="标识"
          :name="['formItemProps', 'name']"
          required
          :rules="rules"
        >
          <j-input
            placeholder="请输入"
            :maxlength="64"
            v-model:value="target.formItemProps.name"
          />
        </j-form-item>
      </template>
      <template v-if="['tabs-item'].includes(type)">
        <j-form-item label="名称" :name="['componentProps', 'tab']" required>
          <j-input
            placeholder="请输入"
            :maxlength="64"
            v-model:value="target.componentProps.tab"
          />
        </j-form-item>
        <j-form-item
          label="标识"
          :name="['formItemProps', 'name']"
          required
          :rules="rules"
        >
          <j-input
            placeholder="请输入"
            :maxlength="64"
            v-model:value="target.formItemProps.name"
          />
        </j-form-item>
      </template>
      <template v-if="['table-item'].includes(type)">
        <j-form-item label="名称" :name="['componentProps', 'title']" required>
          <j-input
            placeholder="请输入"
            :maxlength="64"
            v-model:value="target.componentProps.title"
          />
        </j-form-item>
        <j-form-item
          label="标识"
          :name="['formItemProps', 'name']"
          required
          :rules="rules"
        >
          <j-input
            placeholder="请输入"
            :maxlength="64"
            v-model:value="target.formItemProps.name"
          />
        </j-form-item>
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useTarget } from '../../../../hooks'

const { target } = useTarget()

const type = computed(() => {
  return target.value?.type
})

const onSwitch = (_checked: boolean) => {
  target.value.formItemProps.label = _checked ? target.value.name : undefined
  target.value.formItemProps.name = undefined
}

const rules = [
  { max: 64, message: '最多可输入64个字符' },
  {
    pattern: /^[a-zA-Z0-9_\-]+$/,
    message: '标识只能由数字、字母、下划线、中划线组成',
  },
]
</script>