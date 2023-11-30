import { request } from "@jetlinks-web/core/src/request";
import { useRoute } from 'vue-router'
import { usePageProvider } from "./usePageProvider";
import type { Ref } from "vue";
export const useLifeCycle = (componentProps: any, refs: Record<string, Ref<any>>, isEditModel: Ref<boolean>) => {

    const pageProvider = usePageProvider()
    const route = useRoute()
    const onCreatedFn = (code?: string) => {
        if (code && !isEditModel.value) {
            const context = {
                context: pageProvider.context,
                axios: request,
                route: route,
                refs
            }
            const fn = new Function('context', code)
            fn(context)
        }
    }

    onCreatedFn(componentProps?.onCreated)

    const executionMounted = () => {
        onCreatedFn(componentProps?.onMounted)
    }

    return {
        executionMounted
    }
}
