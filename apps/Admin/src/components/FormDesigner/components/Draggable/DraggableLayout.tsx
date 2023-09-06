
import { cloneDeep, get, isEmpty, omit, set } from 'lodash-es';
import { useProps } from '../../hooks';
import { onEnd, onMove } from './ControlInsertionPlugin';
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
import { watch, PropType } from 'vue';
import { queryOptions } from '../../utils/utils';
import { useProduct } from '@/store';

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

        const product = useProduct()

        const dragOptions = {
            swapThreshold: 1,
            group: {
                name: 'j-canvas'
            },
        }

        const isEditModel = computed(() => {
            return unref(designer.model) === 'edit'
        })

        const handleMove = () => {
            return true
        }

        const slots = {
            getWidgetRef: (path) => {
                let foundRef = unref(designer.refList)?.[path]
                return foundRef
            },
            item: ({ element }) => {
                const _path: string[] = cloneDeep(props?.path || []);
                const _index: number = props?.index || 0;

                const _hidden = computed(() => {
                    return !unref(isEditModel) && !element.componentProps?.visible && unref(designer.mode) === 'add'
                })

                if(unref(_hidden)) return ''

                switch (element.type) {
                    case 'text':
                        if (unref(isEditModel)) {
                            const params = {
                                data: element,
                                parent: props.data
                            }
                            const TypeComponent = componentMap?.[element?.type] || 'div'
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
                            const typeProps = useProps(element)
                            const TypeComponent = componentMap?.[element?.type] || 'div'

                            const selectRef = ref<any>(null)
                            const options = ref<any[]>(element?.componentProps?.options || [])

                            const params = {
                                data: element,
                                parent: props.data
                            }

                            const formItemProps = computed(() => {
                                const rules = (element.formItemProps?.rules || []).map(item => {
                                    if(item?.validator) { // 处理自定义校验函数
                                        return {
                                            ...omit(item, 'validator'),
                                            validator(rule, value, callback){
                                                let customFn = new Function('rule', 'value', 'callback', item?.validator)
                                                return customFn(rule, value, callback)
                                            }
                                        }
                                    }
                                    return item
                                })
                                
                                return { ...element?.formItemProps, rules }
                            })

                            if (element?.formItemProps?.name) {
                                _path[_index] = element?.formItemProps?.name
                            }

                            const myValue = ref<any>(get(designer.formState, _path))
                            const checked = ref<any>(get(designer.formState, _path))
                            

                            watch(
                                () => myValue.value, 
                                (newValue) => {
                                    set(designer.formState, _path, newValue)
                                }, 
                                {
                                    deep: true
                                }
                            )
                            watch(
                                () => checked.value, 
                                (newValue) => {
                                    set(designer.formState, _path, newValue)
                                }, 
                                {
                                    deep: true
                                }
                            )

                            const onChange = (...arg) => {
                                if(!element?.componentProps?.eventCode && !unref(isEditModel)) return 
                                if(['input', 'input-number', 'textarea', 'input-password'].includes(element.type)){
                                    let customFn = new Function('e', element?.componentProps?.eventCode)
                                    customFn.call(slots, arg?.[0])
                                }
                                if(['select', 'switch', 'select-card', 'tree-select'].includes(element.type)){
                                    let customFn = new Function('value', 'option', element?.componentProps?.eventCode)
                                    customFn.call(slots, arg?.[0], arg?.[1])
                                }
                                if(['time-picker'].includes(element.type)){
                                    let customFn = new Function('time', 'timeString', element?.componentProps?.eventCode)
                                    customFn.call(slots, arg?.[0], arg?.[1])
                                }
                                if(['date-picker'].includes(element.type)){
                                    let customFn = new Function('date', 'timeString', element?.componentProps?.eventCode)
                                    customFn.call(slots, arg?.[0], arg?.[1])
                                }
                            }

                            const registerToRefList = (path: string[], _ref: any) => {
                                if(!unref(isEditModel) && Array.isArray(path) && path?.length && element?.formItemProps?.name && designer.refList){
                                    const __path = path.join('.')
                                    designer.refList.value[__path] = _ref
                                }
                            }

                            watchEffect(() => {
                                registerToRefList(_path, selectRef.value)
                            })

                            if(!isEditModel.value && unref(designer.mode) && ['select', 'select-card', 'tree-select'].includes(element.type)) {
                                queryOptions(element.componentProps.source, product.info?.id).then(resp => {
                                    options.value = resp
                                })
                            }

                            return (
                                <Selection path={_path} ref={selectRef} {...params} hasCopy={true} hasDel={true} hasDrag={true} hasMask={true}>
                                    <FormItem {...unref(formItemProps)} name={_path}>
                                        {
                                            unref(isEditModel) ? 
                                            <TypeComponent
                                                {...unref(typeProps)}
                                                data={element}
                                                {...omit(element.componentProps, ['description'])}
                                                size={unref(designer.formData)?.componentProps.size}
                                            ></TypeComponent> : 
                                            <TypeComponent
                                                {...unref(typeProps)}
                                                data={element}
                                                {...omit(element.componentProps, ['description'])}
                                                size={unref(designer.formData)?.componentProps.size}
                                                v-model:value={myValue.value}
                                                v-model:checked={checked.value}
                                                onChange={onChange}
                                                disabled={element?.componentProps?.disabled || (unref(designer.mode) === 'edit' && !element?.componentProps?.editable)}
                                                options={unref(options)}
                                            ></TypeComponent>
                                        }
                                        <div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{element.componentProps?.description}</div>
                                    </FormItem>
                                </Selection>
                            )
                        }
                        break
                }
            },
            footer() {
                const _style = {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    minHeight: '60px',
                    minWidth: '100px'
                }
                if (isEmpty(props.data)) {
                    return (
                        <div style={{
                            ..._style,
                            background: !props.isRoot ? '#F2F8FF !important' : '',
                        }}>
                            Drop here
                        </div >
                    )
                }
                return ''
            }
        }

        return () => {
            return (
                <DraggableWrap
                    list={props.data || []}
                    handle=".handle"
                    tag={props.tag}
                    item-key="key"
                    move={handleMove}
                    {...dragOptions}
                    v-slots={slots}
                    componentData={useAttrs()} // tag的props和event
                    onMove={(e) => {
                        onMove(e, designer)
                    }}
                    model={unref(designer.model)}
                    onEnd={(e) => {
                        onEnd(e, designer)
                    }}
                />
            )
        };
    },
});

export default DraggableLayout;
