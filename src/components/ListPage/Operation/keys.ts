import { OperationConfigTreeItem, ErrorItemType } from './type'

export { DATA_BIND } from '../keys'

export const columnsTreeKey: InjectionKey<Ref<OperationConfigTreeItem[]>> = Symbol('columns_tree')
export const activeBtnKey: InjectionKey<Ref<Partial<OperationConfigTreeItem>>> = Symbol('active_button')
export const editTypeKey: InjectionKey<Ref<'add' | 'edit'>> = Symbol('edit_type')
export const typeKey: InjectionKey<string> = Symbol('type')
export const parentKeyKey: InjectionKey<Ref<string | undefined>> = Symbol('parent_Key')
export const showColumnsKey: InjectionKey<Ref<boolean>> = Symbol('show_columns')


export const errorListKey: InjectionKey<Ref<ErrorItemType[]>> = Symbol('error_list')
