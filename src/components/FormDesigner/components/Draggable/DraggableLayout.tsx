
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
import TitleLayout from './TitleLayout';

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
        const designer: any = inject('FormDesigner')
        const platform = navigator.platform.toLowerCase();

        const isEditModel = computed(() => {
            return unref(designer.model) === 'edit'
        })

        const slots = {
            item: ({ element }) => {
                const _path: string[] = cloneDeep(props?.path || []);
                const _index: number = props?.index || 0;

                const _visible = computed(() => {
                    if (!unref(isEditModel) && unref(designer.mode) === 'add') {
                        if (props.visible === false) {
                            return false
                        }
                        return element.componentProps?.visible
                    }
                    return true
                })

                const _editable = computed(() => {
                    if (!unref(isEditModel) && unref(designer.mode) === 'edit') {
                        if (props?.editable === false) {
                            return false
                        }
                        return element.componentProps?.editable
                    }
                    return true
                })

                if (!unref(_visible)) return ''

                switch (element.type) {
                    case 'text':
                        const TypeComponent = componentMap?.[element?.type] || 'div'
                        return (
                            <Selection data={element} parent={props.data} hasCopy={true} hasDel={true} hasDrag={true} hasMask={true}>
                                <TypeComponent {...element.componentProps} />
                            </Selection>
                        )
                    case 'card':
                        return (<CardLayout editable={unref(_editable)} visible={unref(_visible)} index={_index} path={_path} key={element.key} data={element} parent={props.data}></CardLayout>)
                    case 'title':
                        return (<TitleLayout editable={unref(_editable)} visible={unref(_visible)} index={_index} path={_path} key={element.key} data={element} parent={props.data}></TitleLayout>)
                    case 'space':
                        return (<SpaceLayout editable={unref(_editable)} visible={unref(_visible)} index={_index} path={_path} key={element.key} data={element} parent={props.data}></SpaceLayout>)
                    case 'grid':
                        return (<GridLayout editable={unref(_editable)} visible={unref(_visible)} index={_index} path={_path} key={element.key} data={element} parent={props.data}></GridLayout>)
                    case 'tabs':
                        return (<TabsLayout editable={unref(_editable)} visible={unref(_visible)} index={_index} path={_path} key={element.key} data={element} parent={props.data}></TabsLayout>)
                    case 'collapse':
                        return (<CollapseLayout editable={unref(_editable)} visible={unref(_visible)} index={_index} path={_path} key={element.key} data={element} parent={props.data}></CollapseLayout>)
                    case 'table':
                        return (<TableLayout editable={unref(_editable)} visible={unref(_visible)} index={_index} path={_path} key={element.key} data={element} parent={props.data}></TableLayout>)
                    default:
                        return (<CommLayout editable={unref(_editable)} visible={unref(_visible)} index={_index} path={_path} key={element.key} data={element} parent={props.parent}></CommLayout>)
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
            // dragClass, selectedClass
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
