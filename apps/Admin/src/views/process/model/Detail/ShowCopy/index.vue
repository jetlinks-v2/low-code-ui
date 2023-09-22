<!-- 展示及抄送 -->
<template>
  <div>
    <j-form ref="formRef" :model="form" autocomplete="off" layout="vertical">
      <TitleComponent data="展示配置" />
      <j-form-item name="variable" label="可用变量">
        <j-button>
          <AIcon type="PlusOutlined" />
          <span>表单字段</span>
        </j-button>
        <div></div>
        <j-space>
          <div
            class="variable-item"
            :style="{ background: randomColor() || item.color }"
            v-for="item of form.variable"
          >
            <span>{{ item.label }}</span>
          </div>
        </j-space>
      </j-form-item>
      <j-form-item
        name="title"
        :rules="[{ required: true, trigger: 'change' }]"
      >
        <template #label>
          <div>
            <span>请配置标题模板</span>
            <j-tooltip placement="right">
              <template #title
                >流程开始后所有候选人看到的流程表单名称，如：产品部的采购申请</template
              >
              <AIcon type="InfoCircleOutlined" />
            </j-tooltip>
          </div>
        </template>
        <div class="title-template">
          <j-textarea
            v-model:value="form.title"
            placeholder="{发起人}的{流程名称}"
            :auto-size="{ minRows: 4 }"
            :bordered="false"
          />
          <div class="html">
            <span v-html="titleHtml"></span>
          </div>
          <div class="select">
            <j-form-item-rest>
              <j-select
                style="width: 120px; text-align: left"
                placeholder="添加变量"
                :options="form.variable"
                @select="selectVariable"
              >
              </j-select>
            </j-form-item-rest>
          </div>
        </div>
      </j-form-item>
      <j-form-item
        name="summary"
        :rules="[{ required: true, trigger: 'change' }]"
      >
        <template #label>
          <div>
            <span>请配置摘要模板</span>
          </div>
        </template>
        <div class="title-template">
          <j-textarea
            v-model:value="form.summary"
            placeholder="{请假人}的{请假类型}"
            :auto-size="{ minRows: 4 }"
            :bordered="false"
          />
          <div class="html">
            <span v-html="summaryHtml"></span>
          </div>
          <div class="select">
            <j-form-item-rest>
              <j-select
                style="width: 120px; text-align: left"
                placeholder="添加变量"
                :options="form.variable"
                @select="selectSummary"
              >
              </j-select>
            </j-form-item-rest>
          </div>
        </div>
      </j-form-item>
      <TitleComponent data="抄送配置" />
      <j-form-item name="members" label="配置该流程需要抄送的成员">
        <ConfigureMembers :hasWeight="false" v-model:members="form.members" />
      </j-form-item>
    </j-form>

    <!-- <j-button @click="submit1"> 提交 </j-button> -->
  </div>
</template>

<script setup lang="ts">
const formRef = ref()
const form = reactive({
  // variable: [], // 可用变量
  variable: [
    { label: '流程名称', value: '1', color: '#d7faa1' },
    { label: '发起人', value: '2', color: '#fce3c1' },
    { label: '发起人所属组织', value: '3', color: '#ddb8ff' },
    { label: '请假类型', value: '4', color: '#ffffb8' },
  ],
  title: '', // 标题模板
  summary: '', // 摘要模板
  members: [], // 成员
})

/**
 * 选中变量
 * @param value
 */
const selectVariable = (value: string, option) => {
  form.title += `{${option.label}}`
}
const selectSummary = (value: string, option) => {
  form.summary += `{${option.label}}`
}

// 正则匹配{}中间内容，并替换成<span style="color: 随机颜色"></span>
const replace = (str: string) => {
  return str.replace(/\n/g, '<br/>').replace(/\{(.*?)\}/g, ($1, $2) => {
    return `<span style="color: ${getColor($2)}">${$1}</span>`
  })
}

// 根据选择的变量找出颜色
const getColor = (str: string) => {
  return form.variable.filter((item) => item.label === str)[0]?.color
}

// 生成随机背景色，并且保证黑色文字可读性
const randomColor = () => {
  // const color = '#' + Math.floor(Math.random() * 0xffffff).toString(16)
  // return color
  const letters = '0123456789ABCDEF'
  let color = '#'
  do {
    color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
  } while (isDarkColor(color))

  return color
}
// 判断是否是深色
const isDarkColor = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness < 128
}

// 标题
const titleHtml = computed(() => {
  return replace(form.title)
})
// 摘要
const summaryHtml = computed(() => {
  return replace(form.summary)
})

/**
 * 保存
 * @param type 默认save 不校验填写内容，submit 提交时校验
 */
const submit = async (type = 'save') => {
  // console.log(`output->type`,type)
  // 仅保存配置数据，不校验填写内容的合规性。
  if (type !== 'save') {
    await formRef.value.validate()
  }
  return form
}

defineExpose({ submit })
</script>

<style lang="less" scoped>
.variable-item {
  margin-top: 10px;
  padding: 2px 10px;
}
.title-template {
  padding: 10px;
  position: relative;
  width: 100%;
  border: 1px solid #d9d9d9;

  .html {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 4px 11px;
    pointer-events: none;
  }

  .select {
    text-align: end;
  }
}
</style>
