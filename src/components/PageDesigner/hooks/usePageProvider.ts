import { PageSymbol } from '../core/context'

type PageProviderType = {
    $refs?: Record<string, any>
    addRef?: (key: string, data: any) => void
    removeRef?: (key: string) => void
}
export const usePageProvider = (): PageProviderType => {
    return inject(PageSymbol, { $refs: {} })
}
