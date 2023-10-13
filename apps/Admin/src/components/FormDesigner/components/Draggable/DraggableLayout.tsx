
import { cloneDeep, isEmpty } from 'lodash-es';
import DraggableWrap from './DragGableWrap'
import Selection from '../Selection'
import componentMap from '../../utils/componentMap';
import GridLayout from './GridLayout';
import TabsLayout from './TabsLayout';
import CardLayout from './CardLayout';
import SpaceLayout from './SpaceLayout';
import CollapseLayout from './CollapseLayout';
import TableLayout from './TableLayout'
import CommLayout from './CommLayout';
import { PropType } from 'vue';
import { onEnd } from './ControlInsertionPlugin';
import './index.less';

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
                                    <TypeComponent {...element.componentProps} />
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
                        return (<CommLayout index={_index} path={_path} key={element.key} data={element} parent={props.data}></CommLayout>)
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
