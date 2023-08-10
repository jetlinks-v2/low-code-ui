
import { get, isEmpty } from 'lodash-es';
import { useProps, useTarget } from '../../hooks';
import ControlInsertionPlugin from './ControlInsertionPlugin';
import DraggableWrap from './DragGableWrap'
import Selection from '../Selection'
import { FormItem } from 'jetlinks-ui-components'
import componentMap from '../../utils/componentMap';
import LayoutInlineLayout from './LayoutInlineLayout';

const DraggableLayout = defineComponent({
    name: 'DraggableLayout',
    props: {
        data: Object,
        parent: Object,
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
        const _data = inject('FormDesigner')

        const {
            state,
            isEditModel
        } = useTarget()

        const dragOptions = {
            swapThreshold: 1,
            group: {
                name: 'j-canvas'
            },
            parent: props.parent,
            plugins: [ControlInsertionPlugin(_data)],
            ControlInsertion: true
        }

        const handleMove = () => {
            return true
        }

        const slots = {
            item: ({ element }) => {
                switch (element.type) {
                    // case 'grid':
                    //     node = (<LayoutGridLayout key={element.id} data={element} parent={props.data}></LayoutGridLayout>)
                    //     break
                    // case 'table':
                    //     node = (<LayoutTableLayout key={element.id} data={element} parent={props.data}></LayoutTableLayout>)
                    //     break
                    // case 'tabs':
                    //     node = (<LayoutTabsLayout key={element.id} data={element} parent={props.data}></LayoutTabsLayout>)
                    //     break
                    // case 'collapse':
                    //     node = (<LayoutCollapseLayout key={element.id} data={element} parent={props.data}></LayoutCollapseLayout>)
                    //     break
                    case 'inline':
                        return (<LayoutInlineLayout key={element.id} data={element} parent={props.data}></LayoutInlineLayout>)
                    default:
                        let TypeComponent = ''
                        if (unref(isEditModel) || get(state.fieldsLogicState.get(element), 'visible', undefined) !== 0) {
                            // props
                            const typeProps = useProps(state, element)

                            console.log(element?.type)

                            TypeComponent = componentMap?.[element?.type] // load.findComponent('FormTypes', element.type)
                            const params = {
                                data: element,
                                parent: props.data
                            }
                            if (process.env.NODE_ENV === 'test') {
                                params['data-field-id'] = `${element.id}`
                            }
                            return (
                                <Selection hasWidthScale hasCopy hasDel hasDrag hasMask {...params}>
                                    <FormItem {...typeProps.value}>
                                        <TypeComponent data={element} params={typeProps.value}></TypeComponent>
                                    </FormItem>
                                </Selection>
                            )
                        }
                        break
                }
            },
            footer() {
                if (isEmpty(props.data) && !props.isRoot) {
                    return (
                        <div>
                            Drop here
                        </div>
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
                    item-key="id"
                    move={handleMove}
                    {...dragOptions}
                    v-slots={slots}
                    componentData={useAttrs()} // tag的props和event
                />
            )
        };
    },
});

export default DraggableLayout;