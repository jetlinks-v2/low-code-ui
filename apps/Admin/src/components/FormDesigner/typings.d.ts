import type { FormItemProps, InputProps, TextAreaProps, SelectProps } from 'jetlinks-ui-components';

type ComponentProps = InputProps | TextAreaProps | SelectProps | Record<string, any>;

export declare type ISchema = {
    componentProps?: ComponentProps; // 组件的配置项
    type: string; // 组件类型
    formItemProps?: FormItemProps; // form-item的配置项
    name?: string; // 组件名称
    key?: string | number; // 标识
    children?: ISchema[];
    context?: any;
    icon?: string;
    visible?: boolean; // 字段是否显示
    editable?: boolean; // 编辑时是否可修改
    dependence?: any[]; // 显示依赖
}