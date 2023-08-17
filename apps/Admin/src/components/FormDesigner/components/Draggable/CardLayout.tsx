import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import { Card } from 'jetlinks-ui-components'
import './index.less'

export default defineComponent({
    name: 'CardLayout',
    inheritAttrs: false,
    customOptions: {},
    props: {
        data: {
            type: Object,
            default: () => { }
        },
        parent: {
            type: Array,
            default: () => []
        },
    },
    setup(props) {
        const list = computed(() => {
            return props.data?.children || []
        })
        return () => {
            return (
                <Selection {...useAttrs()} style={{ padding: '16px' }} hasDrag={true} hasDel={true} hasCopy={true} data={props.data} parent={props.parent}>
                    <Card data-layout-type={'card'} {...props.data.componentProps}>
                        {
                            unref(list).map(element => {
                                return (
                                    <Selection
                                        class={'drag-area'}
                                        data={element}
                                        tag="div"
                                        hasCopy={true}
                                        hasDel={unref(list).length > 1}
                                        parent={unref(list)}
                                    >
                                        <DraggableLayout
                                            data-layout-type={'card-item'}
                                            data={element.children}
                                            parent={element} />
                                    </Selection>
                                )
                            })
                        }
                    </Card>
                </Selection>
            )
        }
    }
})
