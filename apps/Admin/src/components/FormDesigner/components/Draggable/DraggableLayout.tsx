
import { cloneDeep, get, isEmpty, omit, set } from 'lodash-es';
import DraggableWrap from './DragGableWrap'
import Selection from '../Selection'
import { FormItem } from 'jetlinks-ui-components'
import componentMap from '../../utils/componentMap';
import GridLayout from './GridLayout';
import TabsLayout from './TabsLayout';
import CardLayout from './CardLayout';
import SpaceLayout from './SpaceLayout';
import CollapseLayout from './CollapseLayout';
import TableLayout from './TableLayout'
import { PropType } from 'vue';
import { queryOptions } from '../../utils/utils';
import { useProduct } from '@/store';
import { onEnd } from './ControlInsertionPlugin';
import { useProps } from '../../hooks';
import './index.less'
import { request } from '@jetlinks/core';

const DraggableLayout = defineComponent({
    name: 'DraggableLayout',
    props: {
        data: {
            type: Object,
            default: () => { }
        },
        parent: {
            type: [Array, Object],
            default: () => []
        },
        isRoot: {
            type: Boolean,
            default: false
        },
        tag: {
            type: String,
            default: 'div'
        },
        type: {
            type: String
        },
        path: {
            type: Array as PropType<string[]>,
            default: () => []
        },
        index: {
            type: Number,
            default: 0
        }
    },
    setup(props) {
        const designer: any = inject('FormDesigner')
        const platform = navigator.platform.toLowerCase();

        const product = useProduct()

        const isEditModel = computed(() => {
            return unref(designer.model) === 'edit'
        })

        const slots = {
            item: ({ element }) => {
                const _path: string[] = cloneDeep(props?.path || []);
                const _index: number = props?.index || 0;

                const _hidden = computed(() => {
                    return !unref(isEditModel) && !element.componentProps?.visible && unref(designer.mode) === 'add'
                })

                if (unref(_hidden)) return ''

                switch (element.type) {
                    case 'text':
                        if (unref(isEditModel) || componentMap?.[element?.type]) {
                            const TypeComponent = componentMap?.[element?.type] || 'div'
                            const params = {
                                data: element,
                                parent: props.data
                            }
                            return (
                                <Selection {...params} hasCopy={true} hasDel={true} hasDrag={true} hasMask={true}>
                                    <TypeComponent data={element} {...element.componentProps} />
                                </Selection>
                            )
                        }
                        break
                    case 'card':
                        return (<CardLayout index={_index} path={_path} key={element.key} data={element} parent={props.data}></CardLayout>)
                    case 'space':
                        return (<SpaceLayout index={_index} path={_path} key={element.key} data={element} parent={props.data}></SpaceLayout>)
                    case 'grid':
                        return (<GridLayout index={_index} path={_path} key={element.key} data={element} parent={props.data}></GridLayout>)
                    case 'tabs':
                        return (<TabsLayout index={_index} path={_path} key={element.key} data={element} parent={props.data}></TabsLayout>)
                    case 'collapse':
                        return (<CollapseLayout index={_index} path={_path} key={element.key} data={element} parent={props.data}></CollapseLayout>)
                    case 'table':
                        return (<TableLayout index={_index} path={_path} key={element.key} data={element} parent={props.data}></TableLayout>)
                    default:
                        if (unref(isEditModel) || componentMap?.[element?.type]) {
                            const TypeComponent = componentMap?.[element?.type] || 'div'
                            const _props = useProps(element, unref(designer.formData), unref(designer.mode))
                            const selectRef = ref<any>(null)
                            const options = ref<any[]>(_props.componentProps.options)
                            const treeData = ref<any[]>(_props.componentProps.treeData)

                            const params = {
                                data: element,
                                parent: props.data
                            }
                            if (element?.formItemProps?.name) {
                                _path[_index] = element?.formItemProps?.name
                            }

                            const onChange = (...arg) => {
                                const _this = {
                                    getWidgetRef: (path) => {
                                        let foundRef = unref(designer.refList)?.[path]
                                        return foundRef
                                    },
                                    request: request
                                }
                                if (!element?.componentProps?.eventCode && !unref(isEditModel)) return
                                if (['input', 'textarea', 'input-password'].includes(element.type)) {
                                    let customFn = new Function('e', element?.componentProps?.eventCode)
                                    customFn.call(_this, arg?.[0])
                                }
                                if (['input-number'].includes(element.type)) {
                                    let customFn = new Function('value', element?.componentProps?.eventCode)
                                    customFn.call(_this, arg?.[0])
                                }
                                if (['select', 'switch', 'select-card', 'tree-select'].includes(element.type)) {
                                    let customFn = new Function('value', 'option', element?.componentProps?.eventCode)
                                    customFn.call(_this, arg?.[0], arg?.[1])
                                }
                                if (['time-picker'].includes(element.type)) {
                                    let customFn = new Function('time', 'timeString', element?.componentProps?.eventCode)
                                    customFn.call(_this, arg?.[0], arg?.[1])
                                }
                                if (['date-picker'].includes(element.type)) {
                                    let customFn = new Function('date', 'timeString', element?.componentProps?.eventCode)
                                    customFn.call(_this, arg?.[0], arg?.[1])
                                }
                            }

                            const registerToRefList = (path: string[], _ref: any) => {
                                if (!unref(isEditModel) && Array.isArray(path) && path?.length && element?.formItemProps?.name && designer.refList) {
                                    const __path = path.join('.')
                                    designer.refList.value[__path] = _ref
                                }
                            }

                            watchEffect(() => {
                                registerToRefList(_path, selectRef.value)
                            })
                            
                            if (!isEditModel.value && unref(designer.mode) && ['select', 'select-card', 'tree-select'].includes(element.type)) {
                                queryOptions(element.componentProps.source, product.info?.id).then(resp => {
                                    if (['select', 'select-card'].includes(element.type)) {
                                        options.value = resp
                                    } else {
                                        treeData.value = resp
                                    }
                                })
                            }

                            const renderContent = () => {
                                if (unref(isEditModel)) {
                                    return <TypeComponent
                                        model={unref(designer.model)}
                                        // data={element}
                                        {...omit(_props.componentProps, ['disabled'])}
                                    ></TypeComponent>
                                } else if (['switch'].includes(element.type)) {
                                    return <TypeComponent
                                        // data={element} // TypeError: Cannot convert object to primitive value报错
                                        {..._props.componentProps}
                                        checked={get(designer.formState, _path)}
                                        onUpdate:checked={(newValue) => {
                                            set(designer.formState, _path, newValue || false)
                                        }}
                                        onChange={onChange}
                                    ></TypeComponent>
                                } if (['form'].includes(element.type)) {
                                    return <TypeComponent
                                        {..._props.componentProps}
                                        mode={unref(designer.mode)}
                                        value={get(designer.formState, _path)}
                                        onUpdate:value={(newValue) => {
                                            set(designer.formState, _path, newValue)
                                        }}
                                        onChange={onChange}
                                    ></TypeComponent>
                                } else {
                                    return <TypeComponent
                                        {..._props.componentProps}
                                        value={get(designer.formState, _path)}
                                        onUpdate:value={(newValue) => {
                                            set(designer.formState, _path, newValue)
                                        }}
                                        options={unref(options)}
                                        treeData={unref(treeData)}
                                        onChange={onChange}
                                    ></TypeComponent>
                                }
                            }

                            return (
                                <Selection path={_path} ref={selectRef} {...params} hasCopy={true} hasDel={true} hasDrag={true} hasMask={true}>
                                    <FormItem {...unref(_props.formItemProps)} name={_path} validateFirst={true}>
                                        {renderContent()}
                                        <div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{element.componentProps?.description}</div>
                                    </FormItem>
                                </Selection>
                            )
                        }
                        break
                }
            },
            footer() {
                if (isEmpty(props.data)) {
                    return (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            textAlign: 'center', // 不知道为什么justifyContent这个不行 ？？？
                            alignItems: 'center',
                            height: '100%',
                            minHeight: '60px',
                            background: !props.isRoot ? '#F2F8FF !important' : '',
                        }}>
                            Drop here
                        </div>
                    )
                }
                return ''
            }
        }

        const options = {
            animation: 150,
            multiDrag: true,
            itemKey: 'key',
            // dragClass: 'dragClass',
            // selectedClass: "sortable-selected",
            multiDragKey: platform.includes('mac') ? "Meta" : "Ctrl",
            group: { name: "j-canvas" },
            //拖动结束
            onEnd: (e) => {
                onEnd(e, designer)
            }
        }

        return () => {
            return (
                <DraggableWrap
                    list={props.data || []}
                    tag={props.tag}
                    v-slots={slots}
                    componentData={useAttrs()} // tag的props和event
                    model={unref(designer.model)}
                    {...options}
                />
            )
        };
    },
});

export default DraggableLayout;
