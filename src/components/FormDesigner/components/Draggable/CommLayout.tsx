import Selection from '../Selection/index'
import './index.less'
import {FormItem, Ellipsis} from 'jetlinks-ui-components'
import {cloneDeep, get, isNumber, omit, set} from 'lodash-es'
import componentMap from '../../utils/componentMap'
import {useProps, useTool} from '../../hooks'
import {request as axiosRequest} from "@jetlinks-web/core/src/request";
import {queryOptions} from '../../utils/utils'
import dayjs from 'dayjs'

export default defineComponent({
    name: 'CommLayout',
    // inheritAttrs: false, 默认情况下父作用域的不被认作 props 的 attribute 绑定 (attribute bindings) 将会“回退”且作为普通的 HTML attribute 应用在子组件的根元素上。
    customOptions: {},
    props: {
        data: {
            type: Object,
            default: () => {
            }
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
        const {isEditModel} = useTool()
        const designer: any = inject('FormDesigner')
        const TypeComponent = componentMap?.[props?.data?.type] || 'div'
        const _path: string[] = cloneDeep(props?.path || []);
        const visible = ref<boolean>(true)
        const disabled = ref<boolean>(false)
        const _formRef = ref<any>(null)
        const options = ref<any[]>(props.data?.componentProps.options || [])
        const treeData = ref<any[]>(props.data?.componentProps.treeData || [])
        const __value = ref<any>(get(designer.formState, _path))

        const _index = computed(() => {
            return isNumber(props?.index) ? props.index : 0
        })

        if (props.data?.formItemProps?.name) {
            _path[_index.value] = props.data?.formItemProps?.name
        }

        const setVisible = (bool: boolean) => {
            if (unref(isEditModel)) return
            visible.value = bool
        }

        const setOptions = (arr: any[]) => {
            if (unref(isEditModel)) return
            if (['select', 'select-card', 'radio', 'checkbox'].includes(props.data?.type)) {
                options.value = arr
            } else {
                treeData.value = arr
            }
        }

        const setValue = (_val: any) => {
            if (unref(isEditModel)) return
            if (Array.isArray(_path) && _path?.length) {
              set(designer.formState, _path, _val)
            }
        }

        const setDisabled = (bool: boolean) => {
            if (unref(isEditModel)) return
            disabled.value = bool
        }

        const onChange = (...arg) => {
            if (unref(isEditModel)) return
            designer?.onChange?.()
            const _refs = {
                refList: designer.refList,
                axios: axiosRequest
            }
            if (!props.data?.componentProps?.eventCode && !unref(isEditModel)) return
            let obj: any = undefined
            if (['input', 'textarea', 'input-password', 'radio', 'checkbox'].includes(props.data?.type)) {
                obj = arg?.[0]
            }
            if (['input-number'].includes(props.data?.type)) {
                obj = arg?.[0]
            }
            if (['select', 'switch', 'select-card', 'tree-select'].includes(props.data.type)) {
                obj = {value: arg?.[0], option: arg?.[1]}
            }
            if (['time-picker'].includes(props.data?.type)) {
                obj = {time: arg?.[0], timeString: arg?.[1]}
            }
            if (['date-picker'].includes(props.data?.type)) {
                obj = {date: arg?.[0], timeString: arg?.[1]}
            }
            const customFn = new Function('value', 'refs', props.data?.componentProps?.eventCode)
            customFn(obj, _refs)
        }

        const registerToRefList = (path: string[]) => {
            if (!unref(isEditModel) && Array.isArray(path) && path?.length && props.data?.formItemProps?.name && designer.refList) {
                const __path = path.join('.')
                if(['select', 'select-card', 'radio', 'checkbox'].includes(props.data?.type)){
                    designer.refList.value[__path] = {setVisible, setValue, setDisabled, setOptions}
                }else {
                    designer.refList.value[__path] = {setVisible, setValue, setDisabled}
                }
            }
        }

        registerToRefList(_path)

        watchEffect(() => {
            registerToRefList(_path)
        })

        if (!isEditModel.value && unref(designer.mode) && ['select', 'select-card', 'tree-select', 'radio', 'checkbox'].includes(props.data?.type)) {
            queryOptions(props.data?.componentProps.source).then(resp => {
                if (['select', 'select-card', 'radio', 'checkbox'].includes(props.data?.type)) {
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
            } else if (['switch'].includes(props?.data.type)) {// 会被置空
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

        const path_ = computed(() => {
            if (['org', 'role', 'user', 'product', 'device'].includes(props.data?.type) && props.data?.componentProps?.mode !== "multiple") {
                const _key = (props.data?.componentProps.keys || [])?.find(i => i?.flag)
                const __path = _path.slice(0, _path.length - 1) || []
                __path.push(_key?.config?.source)
                return __path
            }
            return _path
        })

        const onMountedFn = () => {
            const customFn = new Function('refs', props.data?.componentProps?.mountedCode)
            const obj = {
                axios: axiosRequest,
                myRef: designer.refList
            }
            customFn(obj)
        }

        onMounted(() => {
            if (props.data?.componentProps?.mountedCode && !unref(isEditModel)) {
                onMountedFn()
            }
        })

        return () => {
            const _props = useProps(props.data, unref(designer.formData), props.editable, designer.disabled, unref(designer.mode))

            disabled.value = _props.componentProps?.disabled

            const params = {
                data: props.data,
                parent: props.parent
            }

            const _description = () => {
                if(props.data?.componentProps?.description){
                    return <div class="form-designer-description">
                        <div>
                            <Ellipsis>{props.data?.componentProps?.description}</Ellipsis>
                        </div>
                    </div>
                }
            }

            const renderContent = () => {
                if(unref(isEditModel)){
                    return <Selection path={_path} {...params} hasCopy={true} hasDel={true} hasDrag={true} hasMask={true}>
                        <FormItem {...unref(_props.formItemProps)} name={path_.value} validateFirst={true}>
                            <TypeComponent
                                model={unref(designer.model)}
                                {...omit(_props.componentProps, ['disabled'])}
                                source={props.data?.type === 'form' ? props.data?.componentProps?.source : undefined}
                                onChange={onChange}
                            ></TypeComponent>
                        </FormItem>
                        {_description()}
                    </Selection>
                } else {
                    if(visible.value){
                        return <Selection path={_path} {...params} hasCopy={true} hasDel={true} hasDrag={true} hasMask={true}>
                            <FormItem {...unref(_props.formItemProps)} name={path_.value} validateFirst={true}>
                                {
                                    ['switch'].includes(props.data?.type) ? <TypeComponent
                                        {..._props.componentProps}
                                        checked={__value.value}
                                        onUpdate:checked={(newValue: any) => {
                                            set(designer.formState, _path, newValue || false)
                                        }}
                                        onChange={onChange}
                                        ref={_formRef}
                                        disabled={unref(disabled)}
                                    ></TypeComponent> : <TypeComponent
                                        {..._props.componentProps}
                                        value={__value.value}
                                        onUpdate:value={(newValue: any) => {
                                            if (['org', 'role', 'user', 'product', 'device'].includes(props.data?.type) && !Array.isArray(newValue)) {
                                                props.data?.componentProps.keys.forEach((i: any) => {
                                                    const __path = _path.slice(0, _path.length - 1) || []
                                                    __path.push(i.config?.source)
                                                    set(designer.formState, __path, newValue?.[i?.key] || null)
                                                })
                                            } else {
                                                set(designer.formState, _path, newValue || null)
                                            }
                                        }}
                                        treeData={unref(treeData)}
                                        source={props.data?.type === 'form' ? props.data?.componentProps?.source : undefined}
                                        mode={props.data?.type === 'form' ? unref(designer.mode) : _props.componentProps?.mode}
                                        onChange={onChange}
                                        ref={_formRef}
                                        options={unref(options)}
                                        disabled={unref(disabled)}
                                    ></TypeComponent>
                                }
                            </FormItem>
                            {_description()}
                        </Selection>
                    } else {
                        return ''
                    }
                }
            }

            return renderContent()
        }
    }
})
