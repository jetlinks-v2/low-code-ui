import { PageSymbol } from '../core/context'
import type {Ref} from "vue";

type PageProviderType = {
    context: Record<string, any>
    add?: (key: string, data: any) => void

    remove?: (key: string) => void
    addSlot?: (key: string, data: any) => void

    removeSlot?: (key: string) => void
}
export const usePageProvider = (): PageProviderType => {
    return inject(PageSymbol, { context: {} })
}

export const usePageDependencies = <T extends any>(key: string, immediate: boolean = true): { dependencies: Ref<T | undefined> } => {
    const pageProvider = usePageProvider()

    const dependencies = ref<T>()

    watch(() => JSON.stringify(pageProvider.context), () => {
        dependencies.value = pageProvider.context[key] ?? undefined
    }, { immediate: immediate })

    return {
        dependencies
    }
}
