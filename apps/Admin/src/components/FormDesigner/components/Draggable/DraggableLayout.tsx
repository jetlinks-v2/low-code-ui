
import { cloneDeep, get, isEmpty, set } from 'lodash-es';
import { useProps } from '../../hooks';
import { PropType } from 'vue';
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
import { watch } from 'vue';

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
            item: ({ element }) => {
                const _path: string[] = cloneDeep(props?.path || []);
                const _index: number = props?.index || 0;
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

                            const params = {
                                data: element,
                                parent: props.data
                            }

                            const formItemProps = computed(() => {
                                return { ...element?.formItemProps }
                            })

                            if (element?.formItemProps?.name) {
                                _path[_index] = element?.formItemProps?.name
                            }

                            const value = ref<any>(get(designer.formState, _path))
                            const checked = ref<any>(get(designer.formState, _path))

                            watch(
                                () => value.value, 
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
                                if(!element?.onChange) return 
                                if(['input', 'input-number'].includes(element.type)){
                                    let customFn = new Function('e', element?.onChange)
                                    customFn.call(arg?.[0])
                                }
                                if(['select', 'switch'].includes(element.type)){
                                    let customFn = new Function('value', 'option', element?.onChange)
                                    customFn.call(arg?.[0], arg?.[1])
                                }
                            }

                            return (
                                <Selection {...params} hasCopy={true} hasDel={true} hasDrag={true} hasMask={true}>
                                    <FormItem {...unref(formItemProps)} name={_path}>
                                        {
                                            unref(isEditModel) ? <TypeComponent
                                                {...unref(typeProps)}
                                                data={element}
                                                {...element.componentProps}
                                                size={designer.formData.value?.componentProps.size}
                                            ></TypeComponent> : <TypeComponent
                                                {...unref(typeProps)}
                                                data={element}
                                                {...element.componentProps}
                                                size={designer.formData.value?.componentProps.size}
                                                // v-model={[designer.formState[_path[0]], 'value']}
                                                v-model:value={value.value}
                                                v-model:checked={checked.value}
                                                onChange={onChange}
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