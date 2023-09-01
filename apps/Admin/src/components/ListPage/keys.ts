type MENU_CONFIG = {
  pageName: string;
  main: boolean;
  name: string;
  icon: string;
}

export const DATA_BIND: InjectionKey<any> = Symbol('')
export const BASE_INFO: InjectionKey<any> = Symbol('')
export const MENU_CONFIG: InjectionKey<Ref<MENU_CONFIG>> = Symbol('menu_config')