import Selection from '../Selection/index'
import './index.less'
import componentMap from '../../utils/componentMap'
import { useProps } from '../../hooks'

export default defineComponent({
    name: 'CommLayout',
    // inheritAttrs: false, 默认情况下父作用域的不被认作 props 的 attribute 绑定 (attribute bindings) 将会“回退”且作为普通的 HTML attribute 应用在子组件的根元素上。
    customOptions: {},
    props: {
        data: {
            type: Object,
            default: () => { }
        },
        parent: {
            type: [Array, Object],
            default: () => []
        },
    },
    setup(props) {
        const TypeComponent = componentMap?.[props?.data?.type] || 'div'
        return () => {
            const _props = useProps(props.data)
            const params = {
                data: props.data,
                parent: props.parent
            }
            return (
                <Selection {...params} hasCopy={true} hasDel={true} hasDrag={true} hasMask={true}>
                    <TypeComponent {..._props.componentProps} />
                </Selection>
            )
        }
    }
})
