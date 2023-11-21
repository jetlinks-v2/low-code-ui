
import { isEmpty } from 'lodash-es';
import DraggableWrap from './DragGableWrap'
import Selection from '../Selection'
import './index.less';
import componentMap from '../../utils/componentMap';
import StepsLayout from './StepsLayout';
import InfoLayout from './InfoLayout';
import Info from './copy_InfoLayout'

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
    },
    setup(props) {
        const designer: any = inject('FormDesigner')

        const slots = {
            item: ({ element }) => {
                const TypeComponent = componentMap?.[element?.type] || 'div'
                switch (element.type) {
                    case 'steps':
                        return (<StepsLayout data={element} parent={props.data}></StepsLayout>)
                    case 'info':
                        return (<Info data={element} parent={props.data}></Info>)
                    // case 'info':
                    //     return (<InfoLayout data={element} parent={props.data}></InfoLayout>)
                    default:
                        return <Selection data={element} parent={props.data} hasCopy={true} hasDel={true} hasDrag={true} hasMask={true}>
                            <TypeComponent {...element.componentProps} />
                        </Selection>

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
            group: { name: "j-canvas" }
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
