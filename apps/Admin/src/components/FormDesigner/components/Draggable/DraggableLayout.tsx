
import { isEmpty } from 'lodash-es';
import { useProps } from '../../hooks';
import { onEnd, onMove } from './ControlInsertionPlugin';
import DraggableWrap from './DragGableWrap'
import Selection from '../Selection'
import { FormItem } from 'jetlinks-ui-components'
import componentMap from '../../utils/componentMap';
import { useFormDesignerStore } from '@/store';
import GridLayout from './GridLayout';
import TabsLayout from './TabsLayout';
import CardLayout from './CardLayout';
import CollapseLayout from './CollapseLayout';

const DraggableLayout = defineComponent({
    name: 'DraggableLayout',
    props: {
        data: {
            type: Object,
            default: () => { }
        },
        parent: {
            type: Array,
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
        }
    },
    setup(props) {
        const designer = useFormDesignerStore()

        const dragOptions = {
            swapThreshold: 1,
            group: {
                name: 'j-canvas'
            },
            parent: props.parent
        }

        const isEditModel = computed(() => {
            return designer.model === 'edit'
        })

        const handleMove = () => {
            return true
        }

        const slots = {
            item: ({ element }) => {
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
                        return (<CardLayout key={element.key} data={element} parent={props.data}></CardLayout>)
                    case 'grid':
                        return (<GridLayout key={element.key} data={element} parent={props.data}></GridLayout>)
                    case 'tabs':
                        return (<TabsLayout key={element.key} data={element} parent={props.data}></TabsLayout>)
                    case 'collapse':
                        return (<CollapseLayout key={element.key} data={element} parent={props.data}></CollapseLayout>)
                    default:
                        if (unref(isEditModel) || componentMap?.[element?.type]) {
                            const typeProps = useProps(element)
                            const TypeComponent = componentMap?.[element?.type] || 'div'

                            const params = {
                                data: element,
                                parent: props.data
                            }

                            const formItemProps = computed(() => {
                                return { ...element?.formItemProps, label: element.name }
                            })

                            return (
                                <Selection {...params} hasCopy={true} hasDel={true} hasDrag={true} hasMask={true}>
                                    <FormItem {...unref(formItemProps)}>
                                        <TypeComponent {...unref(typeProps)} data={element} {...element.componentProps}></TypeComponent>
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
                    model={designer.model}
                    onEnd={(e) => {
                        onEnd(e, designer)
                    }}
                />
            )
        };
    },
});

export default DraggableLayout;