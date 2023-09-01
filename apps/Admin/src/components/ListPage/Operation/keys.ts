import { OperationConfigTreeItem, ErrorItemType } from './type'

export const columnsTreeKey: InjectionKey<Ref<OperationConfigTreeItem[]>> = Symbol()
export const activeBtnKey: InjectionKey<Ref<Partial<OperationConfigTreeItem>>> = Symbol()
export const editTypeKey: InjectionKey<Ref<'add' | 'edit'>> = Symbol()
export const typeKey: InjectionKey<string> = Symbol()
export const parentKeyKey: InjectionKey<Ref<string | undefined>> = Symbol()
export const showColumnsKey: InjectionKey<Ref<boolean>> = Symbol()


export const errorListKey: InjectionKey<Ref<ErrorItemType[]>> = Symbol()
