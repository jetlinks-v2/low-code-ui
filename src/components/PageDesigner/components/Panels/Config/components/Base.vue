<template>
  <div>
    <template v-if="!['steps-item', 'info-item', 'info-item-item', 'card-item', 'timeline-item', 'tabs-item'].includes(target.type)">
      <j-form-item
          label="名称"
          name="name"
          required
          :validateFirst="true"
      >
        <j-input
            placeholder="请输入"
            @change="onDataChange"
            :maxlength="32"
            v-model:value="target.name"
        />
      </j-form-item>
    </template>
    <template v-if="['tag', 'button', 'dropdown', 'text'].includes(target.type)">
      <j-form-item
          label="文本内容"
          :name="['componentProps', 'text']"
          required
          :validateFirst="true"
      >
        <j-input
            placeholder="请输入"
            @change="onDataChange"
            :maxlength="32"
            v-model:value="target.componentProps.text"
        />
      </j-form-item>
    </template>
    <template v-if="['button', 'dropdown'].includes(target.type)">
      <j-form-item
        label="按钮类型"
        :name="['componentProps', 'type']"
        :validateFirst="true"
      >
        <j-select
          @change="onDataChange"
          v-model:value="target.componentProps.type"
        >
          <j-select-option value="primary">主按钮</j-select-option>
          <j-select-option value="dashed">虚线按钮</j-select-option>
          <j-select-option value="link">链接按钮</j-select-option>
          <j-select-option value="text">文本按钮</j-select-option>
          <j-select-option value="default">次按钮</j-select-option>
        </j-select>
      </j-form-item>
      <j-form-item
        label="按钮形状"
        :name="['componentProps', 'shape']"
        :validateFirst="true"
      >
        <CheckButton
          :options="[
            { label: '半圆', value: 'round' },
            { label: '圆形', value: 'circle' },
            { label: '默认', value: 'default' },
          ]"
          @change="onDataChange"
          v-model:value="target.componentProps.shape"
        />
      </j-form-item>
      <j-form-item
        label="按钮大小"
        :name="['componentProps', 'size']"
        :validateFirst="true"
      >
        <CheckButton
          :options="[
            { label: '大', value: 'large' },
            { label: '中', value: 'middle' },
            { label: '小', value: 'small' },
          ]"
          @change="onDataChange"
          v-model:value="target.componentProps.size"
        />
      </j-form-item>
      <j-form-item
        label="幽灵属性"
        :validateFirst="true"
        :name="['componentProps', 'ghost']"
      >
        <j-switch
          v-model:checked="target.componentProps.ghost"
          @change="onDataChange"
        />
      </j-form-item>
      <j-form-item
        label="危险按钮"
        :validateFirst="true"
        :name="['componentProps', 'danger']"
      >
        <j-switch
          v-model:checked="target.componentProps.danger"
          @change="onDataChange"
        />
      </j-form-item>
      <j-form-item
        label="Block 按钮"
        :validateFirst="true"
        :name="['componentProps', 'block']"
      >
        <j-switch
          v-model:checked="target.componentProps.block"
          @change="onDataChange"
        />
      </j-form-item>
      <j-form-item
        label="图标"
        :validateFirst="true"
        :name="['componentProps', 'icon']"
      >
        <Icon
          v-model:value="target.componentProps.icon"
          @change="onDataChange"
        />
      </j-form-item>
    </template>
    <template v-if="['tag'].includes(target.type)">
      <j-form-item
        label="标签是否可以关闭"
        :validateFirst="true"
        :name="['componentProps', 'closable']"
      >
        <j-switch
          v-model:checked="target.componentProps.closable"
          @change="onDataChange"
        />
      </j-form-item>
      <j-form-item
        label="关闭图标"
        :validateFirst="true"
        :name="['componentProps', 'closeIcon']"
      >
        <Icon
          v-model:value="target.componentProps.closeIcon"
          @change="onDataChange"
        />
      </j-form-item>
      <j-form-item
        label="颜色"
        :validateFirst="true"
        :name="['componentProps', 'color']"
      >
        <ColorPicker
          v-model:hex="target.componentProps.color"
          @change="onDataChange"
        />
      </j-form-item>
      <j-form-item
        label="图标"
        :validateFirst="true"
        :name="['componentProps', 'icon']"
      >
        <Icon
          v-model:value="target.componentProps.icon"
          @change="onDataChange"
        />
      </j-form-item>
    </template>
    <template v-if="['steps'].includes(target.type)">
      <j-form-item
        label="是否为点状步骤条"
        :validateFirst="true"
        :name="['componentProps', 'progressDot']"
      >
        <j-switch
          v-model:checked="target.componentProps.progressDot"
          @change="onDataChange"
        />
      </j-form-item>
      <j-form-item
          label="步骤按钮配置"
          :validateFirst="true"
          :name="['componentProps', 'action']"
          required
      >
        <Steps
            v-model:value="target.componentProps.action"
            @change="onDataChange"
            :data="stepsList"
        />
      </j-form-item>
    </template>
    <template v-if="['steps-item'].includes(target.type)">
      <j-form-item
        label="图标"
        :validateFirst="true"
        :name="['componentProps', 'icon']"
      >
        <Icon
          v-model:value="target.componentProps.icon"
          @change="onDataChange"
        />
      </j-form-item>
      <j-form-item
        label="标题"
        :name="['componentProps', 'title']"
        required
        :validateFirst="true"
      >
        <j-input
          placeholder="请输入"
          @change="onDataChange"
          :maxlength="32"
          v-model:value="target.componentProps.title"
        />
      </j-form-item>
      <j-form-item
        label="子标题"
        :name="['componentProps', 'subTitle']"
        :validateFirst="true"
      >
        <j-input
          placeholder="请输入"
          @change="onDataChange"
          :maxlength="32"
          v-model:value="target.componentProps.subTitle"
        />
      </j-form-item>
      <j-form-item
        label="描述"
        :name="['componentProps', 'description']"
        :validateFirst="true"
        :maxlength="32"
      >
        <j-input
          placeholder="请输入"
          @change="onDataChange"
          v-model:value="target.componentProps.description"
        />
      </j-form-item>
    </template>
    <template v-if="['info-item'].includes(target.type)">
      <j-form-item
        label="标题"
        :name="['componentProps', 'title']"
        required
        :validateFirst="true"
      >
        <j-input
          placeholder="请输入"
          @change="onDataChange"
          :maxlength="32"
          v-model:value="target.componentProps.title"
        />
      </j-form-item>
      <j-form-item
        label="是否展示边框"
        :validateFirst="true"
        :name="['componentProps', 'bordered']"
      >
        <j-switch
          v-model:checked="target.componentProps.bordered"
          @change="onDataChange"
        />
      </j-form-item>
      <j-form-item
          label="内容描述宽度"
          :name="['componentProps', 'labelWidth']"
          required
          :validateFirst="true"
      >
        <j-input-number
            placeholder="请输入"
            style="width: 100%"
            :precision="0"
            :min="100"
            addon-after="px"
            @change="onDataChange"
            v-model:value="target.componentProps.labelWidth"
        />
      </j-form-item>
      <j-form-item
        label="一行的数量"
        :name="['componentProps', 'column']"
        required
        :validateFirst="true"
      >
        <j-select @change="onDataChange" placeholder="请输入" v-model:value="target.componentProps.column" :options="columnsOptions" />
<!--        <j-input-number-->
<!--          placeholder="请输入"-->
<!--          @change="onDataChange"-->
<!--          style="width: 100%"-->
<!--          :precision="0"-->
<!--          :min="1"-->
<!--          v-model:value="target.componentProps.column"-->
<!--        />-->
      </j-form-item>
    </template>
    <template v-if="['info-item-item'].includes(target.type)">
      <j-form-item
        label="内容描述"
        :name="['componentProps', 'label']"
        required
        :validateFirst="true"
      >
        <j-input
          placeholder="请输入"
          @change="onDataChange"
          :maxlength="32"
          v-model:value="target.componentProps.label"
        />
      </j-form-item>
      <j-form-item
        label="包含列的数量"
        :name="['componentProps', 'span']"
        required
        :validateFirst="true"
      >
        <j-input-number
          placeholder="请输入"
          @change="onDataChange"
          style="width: 100%"
          :precision="0"
          :min="1"
          v-model:value="target.componentProps.span"
        />
      </j-form-item>
    </template>
    <template v-if="['search'].includes(target.type)">
      <j-form-item
        label="搜索项"
        :name="['componentProps', 'columns']"
        required
        :validateFirst="true"
      >
        <Search
          @change="onDataChange"
          v-model:value="target.componentProps.columns"
        />
      </j-form-item>
    </template>
    <template v-if="['timeline'].includes(target.type)">
      <j-form-item
        label="位置"
        :name="['componentProps', 'mode']"
        :validateFirst="true"
      >
        <CheckButton
          :options="[
            { label: '左', value: 'left' },
            { label: '交叉', value: 'alternate' },
            { label: '右', value: 'right' },
          ]"
          @change="onDataChange"
          v-model:value="target.componentProps.mode"
        />
      </j-form-item>
    </template>
    <template v-if="['proTable'].includes(target.type)">
      <j-form-item
        label="表格列"
        :name="['componentProps', 'columns']"
        required
        :validateFirst="true"
      >
        <Search
          @change="onDataChange"
          type="table"
          v-model:value="target.componentProps.columns"
        />
      </j-form-item>
      <!--      <j-form-item label="数据源" :name="['componentProps', 'request']">-->
      <!--        <DataSource v-model:value="target.componentProps.request" />-->
      <!--      </j-form-item>-->
      <j-form-item label="分页器">
        <j-switch
          v-model:checked="target.componentProps.paginationSetting.open"
          @change="onDataChange"
        />
      </j-form-item>
      <j-form-item label="展示格式" :name="['componentProps', 'viewType']">
        <ShowFormat
          v-model:value="target.componentProps.viewType"
          @change="onDataChange"
        />
      </j-form-item>
      <j-form-item
            label="配置操作列"
            :name="['componentProps', 'action']"
        >
          <Action v-model:value="target.componentProps.action" @change="onDataChange" />
      </j-form-item>
    </template>
    <template v-if="['inline'].includes(target.type)">
      <j-form-item
        label="对齐方式"
        :name="['componentProps', 'align']"
        :validateFirst="true"
      >
        <j-select
          @change="onDataChange"
          v-model:value="target.componentProps.align"
        >
          <j-select-option value="start">start</j-select-option>
          <j-select-option value="end">end</j-select-option>
          <j-select-option value="center">center</j-select-option>
          <j-select-option value="baseline">baseline</j-select-option>
        </j-select>
      </j-form-item>
      <j-form-item
        label="间距方向"
        :name="['componentProps', 'direction']"
        :validateFirst="true"
      >
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
        label="间距大小"
        :name="['componentProps', 'size']"
        :validateFirst="true"
      >
        <j-slider v-model:value="target.componentProps.size" @change="onDataChange" />
      </j-form-item>
    </template>
    <template v-if="['tabs'].includes(target.type)">
      <j-form-item
          :validateFirst="true"
          :name="['componentProps', 'type']"
          label="切卡样式"
      >
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
    <template v-if="['tabs-item'].includes(target.type)">
      <j-form-item
          label="标题"
          name="name"
          required
          :validateFirst="true"
      >
        <j-input
            placeholder="请输入"
            @change="onDataChange"
            :maxlength="32"
            v-model:value="target.componentProps.name"
        />
      </j-form-item>
    </template>
  </div>
</template>

<script lang="ts" setup>
import Icon from "./Icon/index.vue";
import Search from "./Search/index.vue";
import Dropdown from "./Dropdown/index.vue";
import ShowFormat from "./ProTable/ShowFormat/index.vue";
import Action from './ProTable/Action/index.vue';
import Steps from './Steps/index.vue'
import { ColorPicker } from "jetlinks-ui-components";
import { useTarget } from "../../../../hooks";
import {CheckButton} from "@LowCode/components/index";

const { target } = useTarget();

const emits = defineEmits(["refresh"]);

const stepsList = computed(() => {
  if(target.value?.type === 'steps'){
    return (target.value?.children || []).map((item: any) => {
      return {
        label: item?.componentProps?.title || item?.key,
        value: item?.key
      }
    })
  }
  return []
})

const columnsOptions = computed(() => {
  return [1, 2, 3, 4, 6, 8, 12, 24].map(item => {
    return {label: item, value: item}
  })
})

const onDataChange = () => {
  emits("refresh", target.value);
};
</script>
