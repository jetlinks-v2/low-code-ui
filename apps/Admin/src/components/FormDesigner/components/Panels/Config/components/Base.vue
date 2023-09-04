<template>
  <div>
    <template
      v-if="
        ![
          'collapse-item',
          'tabs-item',
          'card',
          'card-item',
          'grid',
          'tabs',
          'collapse',
          'space',
          'org',
          'role',
          'user',
          'product',
          'device',
        ].includes(type)
      "
    >
      <j-form-item required label="组件类型" name="type">
        <j-select
          :value="target.type"
          @change="onTypeChange"
          :options="typeOptions"
        />
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
          'table-item',
        ].includes(type)
      "
    >
      <j-form-item
        label="名称"
        :name="['formItemProps', 'label']"
        v-if="
          !['text', 'org', 'role', 'user', 'product', 'device'].includes(type)
        "
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
          @change="onDataChange"
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
          @change="onDataChange"
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
            @change="onDataChange"
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
        <j-form-item label="占位提示" :name="['componentProps', 'placeholder']">
          <j-input
            placeholder="请输入"
            v-model:value="target.componentProps.placeholder"
            :maxlength="32"
            @change="onDataChange"
          />
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
            @change="onDataChange"
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
              @change="onDataChange"
              v-model:value="target.formItemProps.name"
            />
          </j-form-item>
          <j-form-item label="名称" :name="['formItemProps', 'label']" required>
            <j-input
              placeholder="请输入"
              :maxlength="64"
              @change="onDataChange"
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
            @change="onDataChange"
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
            @change="onDataChange"
            v-model:value="target.formItemProps.name"
          />
        </j-form-item>
      </template>
      <template v-if="['tabs-item'].includes(type)">
        <j-form-item label="名称" :name="['componentProps', 'tab']" required>
          <j-input
            placeholder="请输入"
            :maxlength="64"
            @change="onDataChange"
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
            @change="onDataChange"
            v-model:value="target.formItemProps.name"
          />
        </j-form-item>
      </template>
      <template v-if="['table-item'].includes(type)">
        <j-form-item label="名称" :name="['componentProps', 'title']" required>
          <j-input
            placeholder="请输入"
            :maxlength="64"
            @change="onDataChange"
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
            @change="onDataChange"
            v-model:value="target.formItemProps.name"
          />
        </j-form-item>
      </template>
      <template v-if="['grid', 'space'].includes(type)">
        <j-form-item
          label="标识"
          :name="['formItemProps', 'name']"
          required
          :rules="rules"
        >
          <j-input
            placeholder="请输入"
            :maxlength="64"
            @change="onDataChange"
            v-model:value="target.formItemProps.name"
          />
        </j-form-item>
      </template>
      <template v-if="['tabs'].includes(type)">
        <j-form-item :name="['componentProps', 'type']" label="切卡样式">
          <j-radio-group
            v-model:value="target.componentProps.type"
            button-style="solid"
            @change="onDataChange"
          >
            <j-radio-button :value="'line'">线框</j-radio-button>
            <j-radio-button :value="'card'">卡片</j-radio-button>
          </j-radio-group>
        </j-form-item>
      </template>
      <template v-if="['space'].includes(type)">
        <j-form-item :name="['componentProps', 'align']" label="对齐">
          <j-select
            v-model:value="target.componentProps.align"
            placeholder="请选择"
            @change="onDataChange"
          >
            <j-select-option value="start">头部</j-select-option>
            <j-select-option value="end">尾部</j-select-option>
            <j-select-option value="center">居中</j-select-option>
            <j-select-option value="baseline">基准线</j-select-option>
          </j-select>
        </j-form-item>
        <j-form-item
          :name="['componentProps', 'direction']"
          label="类型"
          required
        >
          <j-radio-group
            v-model:value="target.componentProps.direction"
            button-style="solid"
            @change="onDataChange"
          >
            <j-radio-button :value="'vertical'">垂直</j-radio-button>
            <j-radio-button :value="'horizontal'">水平</j-radio-button>
          </j-radio-group>
        </j-form-item>
        <j-form-item
          :name="['componentProps', 'size']"
          label="间隔尺寸"
          required
        >
          <j-input-number
            v-model:value="target.componentProps.size"
            style="width: 100%"
            :precision="0"
            @change="onDataChange"
          />
        </j-form-item>
      </template>
    </template>

    <!-- 规则校验 -->
    <template v-if="rulesVisible">
      <j-form-item>
        <Rule v-model:value="target.formItemProps.rules" @change="onChange" />
      </j-form-item>
    </template>

    <!-- 说明 -->
    <template v-if="descVisible">
      <j-form-item :name="['componentProps', 'description']">
        <template #label>
          说明内容<j-tooltip title="配置后会在该配置项名称后方展示">
            <AIcon type="QuestionCircleOutlined" />
          </j-tooltip>
        </template>
        <j-input
          :maxlength="100"
          placeholder="请输入100字以内文字"
          @change="onDataChange"
          v-model:value="target.componentProps.description"
        />
      </j-form-item>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, unref, watchEffect } from 'vue'
import { useTarget } from '../../../../hooks'
import Rule from './Rules/Rule.vue'
import { basic } from '@/components/FormDesigner/utils/defaultData'
import { omit } from 'lodash-es'
import generatorData from '@/components/FormDesigner/utils/generatorData'
import { getBrotherList, updateData } from '../../../../utils/utils'

const designer: any = inject('FormDesigner')

const { target } = useTarget()

const type = computed(() => {
  return target.value?.type
})

const emits = defineEmits(['refresh'])

const onSwitch = (_checked: boolean) => {
  target.value.formItemProps.label = _checked ? target.value.name : undefined
  target.value.formItemProps.name = undefined
  emits('refresh', target.value)
}

const descVisible = computed(() => {
  return [
    'input',
    'textarea',
    'select-card',
    'input-password',
    'switch',
    'upload',
    'input-number',
    'tree-select',
    'select',
    'date-picker',
    'time-picker',
    'table',
    'card',
    'org',
    'role',
    'user',
    'product',
    'device',
    'geo',
  ].includes(unref(type))
})

const rulesVisible = computed(() => {
  return [
    'input',
    'textarea',
    'input-password',
    'date-picker',
    'time-picker',
    'table',
  ].includes(unref(type))
})

const rules = [
  {
    required: true,
    message: '请输入标识',
  },
  { max: 64, message: '最多可输入64个字符' },
  {
    pattern: /^[a-zA-Z0-9_\-]+$/,
    message: '标识只能由数字、字母、下划线、中划线组成',
  },
  {
    validator(_rule: any, value: string) {
      if (!value) return Promise.resolve()
      const arr = getBrotherList(
        target.value.key,
        designer.formData.value.children,
      )
      const flag = arr
        .filter((item) => item.key !== target.value.key)
        .find((i) => i?.formItemProps?.name === value)
      if (flag) return Promise.reject('标识已存在')
      return Promise.resolve()
    },
  },
]

const typeOptions = computed(() => {
  return [...basic, { name: '地区', type: 'geo' }].map((item) => {
    return {
      label: item.name,
      value: item.type,
    }
  })
})

const onTypeChange = (val: string) => {
  const item = basic.find((item) => item?.type === val)
  const obj = {
    ...generatorData(omit(item, ['icon'])),
    key: target.value?.key,
  }
  const arr = updateData(unref(designer.formData)?.children, obj)
  designer.formData.value = {
    ...designer.formData.value,
    children: arr
  }
  designer.setSelection(obj)
}

const onChange = (arr: any[]) => {
  target.value.formItemProps.rules = arr
  emits('refresh', target.value)
}

const onDataChange = () => {
  emits('refresh', target.value)
}
</script>