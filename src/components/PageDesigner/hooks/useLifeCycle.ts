import { request } from "@jetlinks-web/core/src/request";
import { useRoute } from 'vue-router'
import { usePageProvider } from "./usePageProvider";
import type { Ref } from "vue";
export const useLifeCycle = (componentProps: any, refs: Record<string, Ref<any>>, isEditModel: Ref<boolean>) => {

    const pageProvider = usePageProvider()
    const route = useRoute()
    const designer: any = inject('PageDesigner')

    const setContext = (code: string,name:string,value:any) => {
        pageProvider.context[code] = value
        designer.dependencies[code] = name
    }
    const onCreatedFn = (code?: string) => {
        if (code && !isEditModel.value) {
            const context = {
                context: pageProvider.context,
                axios: request,
                route: route,
                refs,
                setContext
            }
            const fn = new Function('context', code)
            fn(context)
        }
    }

    onCreatedFn(componentProps?.createdCode)

    const executionMounted = () => {
        onCreatedFn(componentProps?.mountedCode)
    }

    return {
        executionMounted
    }
}
