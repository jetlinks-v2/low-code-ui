import Selection from '../Selection/index'
import './index.less'
import { FormItem, Ellipsis } from 'jetlinks-ui-components'
import { cloneDeep, get, isNumber, omit, set } from 'lodash-es'
import componentMap from '../../utils/componentMap'
import { useProps, useTool } from '../../hooks'
import { request } from '@jetlinks/core'
import { queryOptions } from '../../utils/utils'
import dayjs from 'dayjs'

export default defineComponent({
    name: 'CommLayout',
    // inheritAttrs: false, 默认情况下父作用域的不被认作 props 的 attribute 绑定 (attribute bindings) 将会“回退”且作为普通的 HTML attribute 应用在子组件的根元素上。
    customOptions: {},
    props: {
        data: {
            type: Object,
            default: () => { }
        },
        parent: {
            type: [Array, Object],
            default: () => []
        },
        path: {
            type: Array,
            default: () => []
        },
        index: {
            type: Number,
            default: 0
        },
        visible: {
            type: Boolean,
            default: true
        },
        editable: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {
        const { isEditModel } = useTool()
        const designer: any = inject('FormDesigner')
        const TypeComponent = componentMap?.[props?.data?.type] || 'div'
        const _path: string[] = cloneDeep(props?.path || []);
        const selectRef = ref<any>(null)
        const _formRef = ref<any>(null)
        const options = ref<any[]>(props.data?.componentProps.options || [])
        const treeData = ref<any[]>(props.data?.componentProps.treeData || [])
        const __value = ref<any>(get(designer.formState, _path))

        const _index = computed(() => {
            return isNumber(props?.index) ? props.index : 0
        })

        const params = {
            data: props.data,
            parent: props.parent
        }

        if (props.data?.formItemProps?.name) {
            _path[_index.value] = props.data?.formItemProps?.name
        }

        const onChange = (...arg) => {
            designer?.onChange?.()
            if (isEditModel.value) {
                return
            }
            const _this = {
                getWidgetRef: (path) => {
                    let foundRef = unref(designer.refList)?.[path]
                    return foundRef
                },
                request: request
            }
            if (!props.data?.componentProps?.eventCode && !unref(isEditModel)) return
            if (['input', 'textarea', 'input-password'].includes(props.data?.type)) {
                let customFn = new Function('e', props.data?.componentProps?.eventCode)
                customFn.call(_this, arg?.[0])
            }
            if (['input-number'].includes(props.data?.type)) {
                let customFn = new Function('value', props.data?.componentProps?.eventCode)
                customFn.call(_this, arg?.[0])
            }
            if (['select', 'switch', 'select-card', 'tree-select'].includes(props.data.type)) {
                let customFn = new Function('value', 'option', props.data?.componentProps?.eventCode)
                customFn.call(_this, arg?.[0], arg?.[1])
            }
            if (['time-picker'].includes(props.data?.type)) {
                let customFn = new Function('time', 'timeString', props.data?.componentProps?.eventCode)
                customFn.call(_this, arg?.[0], arg?.[1])
            }
            if (['date-picker'].includes(props.data?.type)) {
                let customFn = new Function('date', 'timeString', props.data?.componentProps?.eventCode)
                customFn.call(_this, arg?.[0], arg?.[1])
            }
        }

        const registerToRefList = (path: string[], _ref: any) => {
            if (!unref(isEditModel) && Array.isArray(path) && path?.length && props.data?.formItemProps?.name && designer.refList) {
                const __path = path.join('.')
                designer.refList.value[__path] = _ref
            }
        }

        watchEffect(() => {
            registerToRefList(_path, selectRef.value)
        })

        if (!isEditModel.value && unref(designer.mode) && ['select', 'select-card', 'tree-select'].includes(props.data?.type)) {
            queryOptions(props.data?.componentProps.source).then(resp => {
                if (['select', 'select-card'].includes(props.data?.type)) {
                    options.value = resp
                } else {
                    treeData.value = resp
                }
            })
        }

        watchEffect(() => {
            // 时间组件处理
            if (['date-picker', 'time-picker'].includes(props?.data.type)) {
                const val = get(designer.formState, _path)
                if (typeof val === 'number') {
                    __value.value = dayjs(val).format(props.data.componentProps?.format || 'YYYY-MM-DD HH:mm:ss')
                } else if (typeof val === 'string') {
                    __value.value = val
                } else {
                    __value.value = val
                }
            } else if (['org', 'role', 'user', 'product', 'device'].includes(props.data?.type) && props.data?.componentProps?.mode !== "multiple") {
                const obj = {}
                props.data?.componentProps.keys?.forEach((i: any) => {
                    const __path = _path.slice(0, _path.length - 1) || []
                    __path.push(i?.config?.source)
                    if (get(designer.formState, __path)) {
                        obj[i?.key] = get(designer.formState, __path)
                    }
                })
                __value.value = obj
            } 
            // else if (['form'].includes(props?.data.type)) {// 会被置空
            //     __value.value = get(designer.formState, _path)
            // } 
            else if (['switch'].includes(props?.data.type)) {// 会被置空
                const val = get(designer.formState, _path)
                __value.value = val === 'true' ? true : val
            } else {
                __value.value = get(designer.formState, _path)
            }
        })

        watchEffect(() => {
            if (props.data?.type === 'form' && _formRef.value && !unref(isEditModel) && props.data?.key) {
                designer.formRefList.value[props.data?.key] = _formRef.value
            }
        })
        return () => {
            const _props = useProps(props.data, unref(designer.formData), props.editable, designer.disabled, unref(designer.mode))
            return (
                <Selection path={_path} ref={selectRef} {...params} hasCopy={true} hasDel={true} hasDrag={true} hasMask={true}>
                    <FormItem {...unref(_props.formItemProps)} name={_path} validateFirst={true}>
                        {
                            unref(isEditModel) ? <TypeComponent
                                model={unref(designer.model)}
                                {...omit(_props.componentProps, ['disabled'])}
                                source={props.data?.type === 'form' ? props.data?.componentProps?.source : undefined}
                                onChange={onChange}
                            ></TypeComponent> : (
                                props.data?.type === 'switch' ? <TypeComponent
                                    {..._props.componentProps}
                                    checked={__value.value}
                                    onUpdate:checked={(newValue) => {
                                        set(designer.formState, _path, newValue || false)
                                    }}
                                    onChange={onChange}
                                    ref={_formRef}
                                ></TypeComponent> : <TypeComponent
                                    {..._props.componentProps}
                                    value={__value.value}
                                    onUpdate:value={(newValue) => {
                                        if (['org', 'role', 'user', 'product', 'device'].includes(props.data?.type) && !Array.isArray(newValue)) {
                                            props.data?.componentProps.keys.forEach(i => {
                                                const __path = _path.slice(0, _path.length - 1) || []
                                                __path.push(i.config?.source)
                                                set(designer.formState, __path, newValue?.[i?.key] || null)
                                            })
                                        } else {
                                            set(designer.formState, _path, newValue || null)
                                        }
                                    }}
                                    options={unref(options)}
                                    treeData={unref(treeData)}
                                    source={props.data?.type === 'form' ? props.data?.componentProps?.source : undefined}
                                    mode={props.data?.type === 'form' ? unref(designer.mode) : _props.componentProps?.mode}
                                    onChange={onChange}
                                    ref={_formRef}
                                ></TypeComponent>
                            )
                        }
                    </FormItem>
                    {props.data?.componentProps?.description &&
                        <div class="form-designer-description">
                            <div>
                                <Ellipsis>{props.data?.componentProps?.description}</Ellipsis>
                            </div>
                        </div>
                    }
                </Selection>
            )
        }
    }
})
