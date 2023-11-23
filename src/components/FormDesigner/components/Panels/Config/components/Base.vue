<template>
  <div>
    <template
      v-if="
        ![
          'collapse-item',
          'tabs-item',
          'card',
          'card-item',
          'title',
          'title-item',
          'table-item',
          'grid-item',
          'space-item',
          'grid',
          'tabs',
          'inline',
          'collapse',
          'space',
          'title',
          'org',
          'role',
          'user',
          'product',
          'device',
        ].includes(type)
      "
    >
      <j-form-item :validateFirst="true" required label="组件类型" name="type">
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
          'title',
          'tabs',
          'collapse',
          'space',
          'collapse-item',
          'tabs-item',
          'table-item',
          'grid-item',
          'space-item',
        ].includes(type)
      "
    >
      <j-form-item
        label="名称"
        :name="['formItemProps', 'label']"
        v-if="!['text'].includes(type)"
        :validateFirst="true"
        :rules="[
          {
            required: true,
            message: '请输入名称',
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
      <template
        v-if="['org', 'role', 'user', 'product', 'device'].includes(type)"
      >
        <j-form-item
          label="标识"
          :name="['formItemProps', 'name']"
          required
          :rules="rules"
          v-if="isShowName"
          :validateFirst="true"
        >
          <j-input
            placeholder="请输入"
            :maxlength="64"
            @change="onDataChange"
            v-model:value="target.formItemProps.name"
          />
        </j-form-item>
        <j-form-item
          label="存储配置"
          :name="['componentProps', 'keys']"
          required
          :rules="storageRules"
          :validateFirst="true"
        >
          <Storage
            v-model:value="target.componentProps.keys"
            @change="onStorageChange"
            :type="target.type"
          />
        </j-form-item>
      </template>
      <template v-else>
        <j-form-item
          label="标识"
          :name="['formItemProps', 'name']"
          required
          :rules="rules"
          :validateFirst="true"
        >
          <j-input
            placeholder="请输入"
            :maxlength="64"
            @change="onDataChange"
            v-model:value="target.formItemProps.name"
          />
        </j-form-item>
      </template>
      <template v-if="['text'].includes(type)">
        <j-form-item
          label="文本内容"
          :name="['componentProps', 'value']"
          required
          :validateFirst="true"
        >
          <j-input
            placeholder="请输入"
            @change="onDataChange"
            :maxlength="32"
            v-model:value="target.componentProps.value"
          />
        </j-form-item>
      </template>
    </template>
    <template v-else>
      <template v-if="type === 'card' || type === 'title'">
        <j-form-item
          label="名称"
          :validateFirst="true"
          :name="['componentProps', 'title']"
          :rules="[
            {
              required: true,
              message: '请输入名称',
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
      <template v-if="['card', 'collapse', 'tabs', 'title'].includes(type)">
        <j-form-item
          label="容器组件"
          :validateFirst="true"
          :name="['formItemProps', 'isLayout']"
          :rules="[
            {
              required: true,
              message: '请选择',
              trigger: 'change',
            },
          ]"
        >
          <j-switch
            :checked="target.formItemProps.isLayout"
            @change="onSwitch"
          />
        </j-form-item>
        <!-- <template> -->
        <j-form-item
          label="标识"
          v-if="target.formItemProps.isLayout"
          :name="['formItemProps', 'name']"
          required
          :validateFirst="true"
          :rules="rules"
        >
          <j-input
            placeholder="请输入"
            :maxlength="64"
            @change="onDataChange"
            v-model:value="target.formItemProps.name"
          />
        </j-form-item>
        <j-form-item
          v-if="target.formItemProps.isLayout"
          label="名称"
          :validateFirst="true"
          :name="['formItemProps', 'label']"
          :rules="[
            {
              required: true,
              message: '请输入名称',
              trigger: 'change',
            },
          ]"
        >
          <j-input
            placeholder="请输入"
            :maxlength="64"
            @change="onDataChange"
            v-model:value="target.formItemProps.label"
          />
        </j-form-item>
        <!-- </template> -->
      </template>
      <template v-if="['collapse-item'].includes(type)">
        <j-form-item
          label="名称"
          :name="['componentProps', 'name']"
          :validateFirst="true"
          :rules="[
            {
              required: true,
              message: '请输入名称',
              trigger: 'change',
            },
          ]"
        >
          <j-input
            placeholder="请输入"
            :maxlength="64"
            @change="onDataChange"
            v-model:value="target.componentProps.name"
          />
        </j-form-item>
        <!-- <j-form-item
          label="标识"
          :name="['formItemProps', 'name']"
          required
          :validateFirst="true"
          :rules="rules"
        >
          <j-input
            placeholder="请输入"
            :maxlength="64"
            @change="onDataChange"
            v-model:value="target.formItemProps.name"
          />
        </j-form-item> -->
      </template>
      <template v-if="['tabs-item'].includes(type)">
        <j-form-item
          label="名称"
          :name="['componentProps', 'name']"
          :validateFirst="true"
          :rules="[
            {
              required: true,
              message: '请输入名称',
              trigger: 'change',
            },
          ]"
        >
          <j-input
            placeholder="请输入"
            :maxlength="64"
            @change="onDataChange"
            v-model:value="target.componentProps.name"
          />
        </j-form-item>
        <!-- <j-form-item
          label="标识"
          :name="['formItemProps', 'name']"
          required
          :validateFirst="true"
          :rules="rules"
        >
          <j-input
            placeholder="请输入"
            :maxlength="64"
            @change="onDataChange"
            v-model:value="target.formItemProps.name"
          />
        </j-form-item> -->
      </template>
      <template v-if="['table-item'].includes(type)">
        <j-form-item
          label="名称"
          :name="['componentProps', 'name']"
          :validateFirst="true"
          :rules="[
            {
              required: true,
              message: '请输入名称',
              trigger: 'change',
            },
          ]"
        >
          <j-input
            placeholder="请输入"
            :maxlength="64"
            @change="onDataChange"
            v-model:value="target.componentProps.name"
          />
        </j-form-item>
        <template
          v-if="
            !['table-item-index', 'table-item-actions'].includes(
              target.children?.[0]?.type,
            )
          "
        >
          <j-form-item
            label="标识"
            :name="['children', 0, 'formItemProps', 'name']"
            required
            :validateFirst="true"
            :rules="rules"
          >
            <j-input
              placeholder="请输入"
              :maxlength="64"
              @change="onDataChange"
              v-model:value="target.children[0].formItemProps.name"
            />
          </j-form-item>
        </template>

        <j-form-item
          label="表头跨列"
          :name="['componentProps', 'colSpan']"
          :validateFirst="true"
        >
          <j-input-number
            placeholder="请输入表头跨列"
            @change="onDataChange"
            style="width: 100%"
            :precision="0"
            :min="0"
            v-model:value="target.componentProps.colSpan"
          />
        </j-form-item>
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
        <template
          v-if="
            !['table-item-index', 'table-item-actions'].includes(
              target?.children?.[0]?.type,
            )
          "
        >
          <j-form-item
            :validateFirst="true"
            label="组件类型"
            :name="['children', 0, 'type']"
          >
            <j-select
              v-model:value="target.children[0].type"
              placeholder="请选择"
              @change="onTypesChange"
              :options="typeList"
            />
          </j-form-item>
        </template>
      </template>
      <!-- <template v-if="['grid', 'space'].includes(type)">
        <j-form-item
          label="标识"
          :name="['formItemProps', 'name']"
          required
          :validateFirst="true"
          :rules="rules"
        >
          <j-input
            placeholder="请输入"
            :maxlength="64"
            @change="onDataChange"
            v-model:value="target.formItemProps.name"
          />
        </j-form-item>
      </template> -->
      <template v-if="['tabs'].includes(type)">
        <j-form-item
          :validateFirst="true"
          :name="['componentProps', 'type']"
          label="切卡样式"
        >
          <!-- <j-radio-group
            v-model:value="target.componentProps.type"
            button-style="solid"
            @change="onDataChange"
          >
            <j-radio-button :value="'line'">线框</j-radio-button>
            <j-radio-button :value="'card'">卡片</j-radio-button>
          </j-radio-group> -->
          <CheckButton
            :options="[
              { label: '线框', value: 'line' },
              { label: '卡片', value: 'card' },
            ]"
            @change="onDataChange"
            v-model:value="target.componentProps.type"
          />
        </j-form-item>
      </template>
      <template v-if="['space'].includes(type)">
        <j-form-item
          :validateFirst="true"
          :name="['componentProps', 'align']"
          label="对齐"
        >
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
          :validateFirst="true"
        >
          <!-- <j-radio-group
            v-model:value="target.componentProps.direction"
            button-style="solid"
            @change="onDataChange"
          >
            <j-radio-button :value="'vertical'">垂直</j-radio-button>
            <j-radio-button :value="'horizontal'">水平</j-radio-button>
          </j-radio-group> -->
          <CheckButton
            :options="[
              { label: '垂直', value: 'vertical' },
              { label: '水平', value: 'horizontal' },
            ]"
            @change="onDataChange"
            v-model:value="target.componentProps.direction"
          />
        </j-form-item>
        <j-form-item
          :name="['componentProps', 'size']"
          label="间隔尺寸"
          :validateFirst="true"
          required
        >
          <j-input-number
            v-model:value="target.componentProps.size"
            style="width: 100%"
            :precision="0"
            :min="0"
            @change="onDataChange"
          />
        </j-form-item>
      </template>
    </template>

    <!-- 说明 -->
    <template v-if="descVisible">
      <j-form-item
        :validateFirst="true"
        :name="['componentProps', 'description']"
      >
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
import { computed, inject, unref } from 'vue'
import { useTarget } from '../../../../hooks'
import { basic } from '@LowCode/components/FormDesigner/utils/defaultData'
import generatorData from '@LowCode/components/FormDesigner/utils/generatorData'
import { getBrotherList, queryKeys, updateData, _specialKeys } from '../../../../utils/utils'
import Storage from './Storage/index.vue'
import { uid } from '@LowCode/components/FormDesigner/utils/uid'
import { cloneDeep, flatten, map } from 'lodash-es'
import { CheckButton } from '@LowCode/components/index'

const designer: any = inject('FormDesigner')

const { target } = useTarget()

const type = computed(() => {
  return target.value?.type
})

const emits = defineEmits(['refresh'])

const onSwitch = (_checked: boolean) => {
  target.value.formItemProps.label = _checked ? target.value.name : undefined
  target.value.formItemProps.name = _checked ? `${target.value?.type}_${uid()}` : undefined
  target.value.formItemProps.isLayout = _checked
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
    'title',
    'org',
    'role',
    'user',
    'product',
    'device',
    'geo',
  ].includes(unref(type))
})

const typeList = [
  {
    label: '文本框',
    value: 'input',
  },
  {
    label: '文本域',
    value: 'textarea',
  },
  {
    label: '数字输入',
    value: 'input-number',
  },
  {
    label: '密码框',
    value: 'input-password',
  },
  {
    label: '下拉框',
    value: 'select',
  },
  {
    label: '开关',
    value: 'switch',
  },
  {
    label: '树选择',
    value: 'tree-select',
  },
  {
    label: '日期选择',
    value: 'date-picker',
  },
  {
    label: '时间选择',
    value: 'time-picker',
  },
]

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
    validator(_: any, value: string) {
      if (!value) return Promise.resolve()
      const _arr = cloneDeep(queryKeys(designer.formData.value.children))
      let __key = ['table-item'].includes(target.value.type)
        ? target.value.children?.[0]?.key
        : target.value.key
      const arr = getBrotherList(__key, _arr)
      const flag = arr
        .filter((item) => item.key !== __key)
        .find((i) => i?.formItemProps?.name === value)
      if (flag) return Promise.reject(`标识${value}已被占用`)
      // 判断key是否为_specialKeys
      if(designer.type === 'workflow' && _specialKeys.includes(value)){
        return Promise.reject(`标识不能与内置字段重名`)
      }
      return Promise.resolve()
    },
    trigger: 'change',
  },
]

const storageRules = [
  {
    required: true,
    message: '请配置存储配置',
  },
  {
    validator(_rule: any, value: any[]) {
      if (!value) return Promise.resolve()
      if (!value?.length) return Promise.reject(`请配置存储配置`)
      if (target.value.componentProps?.mode === 'multiple')
        return Promise.resolve()
      const _arr = cloneDeep(queryKeys(designer.formData.value.children))
      const arr = getBrotherList(target.value.key, _arr)
      const _keys = arr
        .filter((item) => {
          return (
            item.key !== target.value.key &&
            item.componentProps?.mode !== 'multiple'
          )
        })
        .map((i) => {
          return i?.componentProps?.keys || []
        })
      const flag = map(flatten(_keys), 'config.source')?.find((i) => {
        return map(value, 'config.source')?.includes(i)
      })
      if (flag) return Promise.reject(`标识${flag}已被占用`)
      if(designer.type === 'workflow'){
        const _flag = map(value, 'config.source')?.find(i => {
          return _specialKeys.includes(i)
        })
        if (_flag) return Promise.reject(`标识不能与内置字段重名`)
      }
      return Promise.resolve()
    },
    trigger: 'change',
  },
]

const typeOptions = computed(() => {
  return [...basic].map((item) => {
    return {
      label: item.name,
      value: item.type,
    }
  })
})

const onTypeChange = (val: string) => {
  const item = basic.find((item) => item?.type === val)
  const _data = generatorData(item)
  const obj = {
    ..._data,
    formItemProps: {
      ..._data?.formItemProps,
      label: target.value?.formItemProps?.label || _data?.formItemProps.label,
      name: target.value?.formItemProps?.name || _data?.formItemProps.name,
    },
    key: target.value?.key,
  }
  const arr = updateData(unref(designer.formData)?.children, obj)
  designer.formData.value = {
    ...designer.formData.value,
    children: arr,
  }
  designer.setSelection(obj)
}

const onTypesChange = (val: string) => {
  const _data = generatorData({
    type: val,
    name: '列名',
    children: [],
  })
  const obj = {
    ..._data,
    formItemProps: {
      ..._data?.formItemProps,
      label:
        target.value.children[0]?.formItemProps?.label ||
        _data?.formItemProps.label,
      name:
        target.value.children[0]?.formItemProps?.name ||
        _data?.formItemProps.name,
    },
    key: target.value.children[0]?.key,
  }

  const arr = updateData(unref(designer.formData)?.children, obj)
  designer.formData.value = {
    ...designer.formData.value,
    children: arr,
  }
}

const isShowName = computed(() => {
  return target.value?.componentProps?.mode === 'multiple'
})

const onDataChange = () => {
  emits('refresh', target.value)
}

const onStorageChange = () => {
  if (!isShowName.value) {
    target.value.formItemProps.name =
      target.value.componentProps?.keys?.find((i) => i?.config?.flag)?.config
        ?.source || `${type.value}_${uid()}`
  }
  emits('refresh', target.value)
}
</script>
