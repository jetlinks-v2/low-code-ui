import { PageSymbol } from '../core/context'

export const UsePageProvider = () => {
    return inject(PageSymbol, {})
}
