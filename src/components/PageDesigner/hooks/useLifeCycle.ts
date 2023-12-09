import useTool from "./useTool";
import type { Ref } from "vue";
export const useLifeCycle = (componentProps: any, refs: Record<string, Ref<any>>, isEditModel: Ref<boolean>) => {
    const { paramsUtil, _global } = useTool()
    const onCreatedFn = (code?: string) => {
        if (code && !isEditModel.value) {
            const fn = new Function('refs', 'util', 'global', code)
            fn(refs, paramsUtil, _global)
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
