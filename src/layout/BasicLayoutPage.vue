<template>
  <j-pro-layout
    v-bind="config"
    v-model:openKeys="state.openKeys"
    v-model:collapsed="state.collapsed"
    :selectedKeys="state.selectedKeys"
    :breadcrumb="{ routes: breadcrumb }"
    :pure="state.pure"
  >
    <template #breadcrumbRender="slotProps">
      <a v-if="slotProps.route.index !== 0 && !slotProps.route.isLast" @click="() => jumpPage(slotProps.route)" >
        {{ slotProps.route.breadcrumbName }}
      </a>
      <span v-else style='cursor: default' >{{ slotProps.route.breadcrumbName }}</span>
    </template>

    <template #rightContentRender>
      <div class="right-content">
        <Notice />
        <User />
      </div>
    </template>
    <slot>
      <router-view v-slot="{ Component }">
        <component :is="components || Component" />
      </router-view>
    </slot>
  </j-pro-layout>
</template>

<script setup name="BasicLayoutPage" lang="ts">
import { useRouter, useRoute } from '@jetlinks-web/router'
import { reactive, computed, watchEffect } from 'vue'
import { useSystemStore } from '@LowCode/store/system'
import { store } from '@jetlinks-web/stores'
import { User, Notice } from './components'
import { storeToRefs } from 'pinia'


type StateType = {
  collapsed: boolean;
  openKeys: string[];
  selectedKeys: string[];
  pure: boolean;
};

const router = useRouter();
const route = useRoute();
const systemStore = useSystemStore()
const menuStore = store.useMenuStore()

const { theme, layout } = storeToRefs(systemStore)

const components = computed(() => {
  const componentName = route.matched[route.matched.length - 1]?.components?.default?.name
  if (componentName !== 'BasicLayoutPage') {
    return route.matched[route.matched.length - 1]?.components?.default
  }
  return undefined
})


const config = computed(() => ({
  ...layout.value,
  title: 'Jetlinks Code',
  theme: theme.value,
  menuData: menuStore.siderMenus,
  splitMenus: layout.value.layout === 'mix'
}))

const state = reactive<StateType>({
  pure: false,
  collapsed: false, // default value
  openKeys: [],
  selectedKeys: [],
});

/**
 * 面包屑
 */
const breadcrumb = computed(() =>
  {
    const paths = router.currentRoute.value.matched
    const breadcrumbs = paths.filter(item => (item.meta as any).title).map((item, index) => {
      return {
        index,
        isLast: index === (paths.length -1),
        path: item.path,
        breadcrumbName: (item.meta as any).title || '',
      }
    })
    console.log('breadcrumbs',breadcrumbs)
    return breadcrumbs
  }
);

/**
 * 路由跳转
 */
const jumpPage = (route: { path: string}) => {
  router.push(route.path)
}

/**
 * 处理菜单选中，展开状态
 */
watchEffect(() => {
  if (router.currentRoute) {
    const paths = router.currentRoute.value.matched
    state.selectedKeys = paths.map(item => item.path)
    state.openKeys = paths.map(item => item.path)
    console.log(paths) //
  }

  if (route.query?.layout === 'false') {
    state.pure = true
  }
})

</script>

<style scoped>
.right-content {
  margin-right: 24px;
  display: flex;
  align-items: center;
}
</style>
