import { PageSymbol } from '../core/context'

type PageProviderType = {
    context: Record<string, any>
    add?: (key: string, data: any) => void

    remove?: (key: string) => void
}
export const UsePageProvider = (): PageProviderType => {
    return inject(PageSymbol, { context: {} })
}
