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

export const DATA_BIND: InjectionKey<any> = Symbol('')
export const BASE_INFO: InjectionKey<any> = Symbol('')
export const MENU_CONFIG: InjectionKey<MENU_CONFIG> = Symbol('menu_config')
export const SHOW_TYPE_KEY: InjectionKey<SHOW_TYPE> = Symbol('show_type')
export const LIST_PAGE_DATA_KEY: InjectionKey<any> = Symbol('list_page_data')