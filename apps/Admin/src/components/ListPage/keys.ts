type MENU_CONFIG = {
  pageName: string;
  main: boolean;
  name: string;
  icon: string;
}

type SHOW_TYPE = {
  type: string;
  configured: string[];
  configurationShow: boolean;
  defaultForm: string
}

export const DATA_BIND: InjectionKey<any> = Symbol('data_bind')
export const BASE_INFO: InjectionKey<any> = Symbol('base_info')
export const MENU_CONFIG: InjectionKey<MENU_CONFIG> = Symbol('menu_config')
export const SHOW_TYPE_KEY: InjectionKey<SHOW_TYPE> = Symbol('show_type')
export const LIST_PAGE_DATA_KEY: InjectionKey<any> = Symbol('list_page_data')
export const LIST_FORM_INFO: InjectionKey<any> = Symbol('list_form_info')
export const DATA_SOURCE: InjectionKey<any> = Symbol('data_source')
export const SEARCH_DATA: InjectionKey<any> = Symbol('search_data')
export const ACTION_CONFIG_KEY: InjectionKey<any> = Symbol('action_config')
export { showColumnsKey } from './Operation/keys'