<template>
  <Scrollbar>
    <div class="header">组件配置</div>
    <div style="position: relative">
      <div class="config-container">
        <j-form ref="formRef" :model="formState" layout="vertical">
          <j-collapse
              v-model:activeKey="activeKey"
              :expand-icon-position="'right'"
              :bordered="false"
          >
            <j-collapse-panel v-for="item in panelsList" :key="item.key">
              <template #header>
                <TitleComponent :data="item.header"/>
              </template>
              <component :is="Panels[item.key]" @refresh="onRefresh"/>
            </j-collapse-panel>
          </j-collapse>
        </j-form>
      </div>
    </div>
  </Scrollbar>
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  watchEffect,
  inject,
  watch,
  unref,
  reactive,
} from "vue";
import {Scrollbar} from "jetlinks-ui-components";
import PageConfig from "./components/Page.vue";
import Base from "./components/Base.vue";
import Status from "./components/Status.vue";
import Button from './components/Button/index.vue'
import {useTarget, useTool} from "../../../hooks";
import {map} from "lodash-es";
import {getConfigList} from "./utils";
import {updateData} from "@LowCode/components/PageDesigner/utils/utils";
import SourceForm from "./components/SourceForm.vue";
import SourcePage from "./components/SourcePage.vue";

const formRef = ref<any>();

const {target} = useTarget();
const {setSelection} = useTool();
const formState = reactive({...unref(target)});

const designer: any = inject("PageDesigner");

const _type = computed(() => {
  return target?.value?.type || "root";
});

const Panels = {
  PageConfig,
  Base,
  Status,
  Button,
  SourceForm,
  SourcePage
};

const panelsList = computed(() => {
  return getConfigList(_type.value);
});

const activeKey = ref<string[]>(map(panelsList.value, "key"));

watchEffect(() => {
  activeKey.value = map(panelsList.value, "key");
});

const onRefresh = (obj: any) => {
  if (obj?.key) {
    if (obj.key === "root") {
      designer.pageData.value = {
        ...obj,
        children: designer.pageData.value?.children || [],
      };
    } else {
      const arr = updateData(unref(designer.pageData)?.children, obj);
      designer.pageData.value = {
        ...designer.pageData.value,
        children: arr,
      };
      setSelection(obj);
    }
  }
};

watch(
    () => target.value,
    (newVal) => {
      Object.assign(formState, newVal);
    },
    {
      immediate: true,
      deep: true,
    }
);

watch(
    () => designer.errorKey?.value,
    (newValue) => {
      if (unref(newValue)?.length) {
        formRef.value?.validateFields()
      }
    },
    {
      immediate: true,
      deep: true,
    },
)

</script>

<style lang="less" scoped>
.header {
  font-size: 18px;
  font-weight: 500;
  border-bottom: 1px solid #f0f0f0;
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 16px;
}

.config-container {
  height: 100%;
  padding: 16px;
  position: relative;

  :deep(.ant-collapse) {
    background-color: #fff;

    .ant-collapse-item {
      border: none !important;
      margin-bottom: 2px;

      .ant-collapse-header {
        background-color: #fafafa !important;
        padding: 13px;

        .title {
          margin: 0;
        }

        span {
          color: #333333;
        }
      }
    }
  }
}

.box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  bottom: 0;
  background: #fff;
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;

  .header {
    width: 100%;
    border-bottom: 1px solid #f0f0f0;
  }
}
</style>
