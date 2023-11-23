import { defineComponent } from 'vue'
import { Row, Col, SkeletonButton, SkeletonInput } from 'jetlinks-ui-components'
import Selection from '../../Selection/index'
import './style.less'

export default defineComponent({
    name: 'ProTableSkeleton',
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

        const btnClick = () => {

        }

        const tableModelClick = () => {

        }

        const columnsClick = () => {

        }

        const toolClick = () => {

        }

        return () => {
            return (
                <div class={'pro-table-layout'}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Selection
                                tag="div"
                            >
                                <SkeletonButton class={'active'} size="large" />
                            </Selection>
                        </Col>
                        <Col>
                            <Selection>
                                <SkeletonButton class={'active'} size="large" />
                            </Selection>
                        </Col>
                    </Row>
                    <Row gutter={[20, 4]}>
                        <Col span={20}>
                            <SkeletonInput class={'pro-table-layout-item active'} size="large"  />
                            <SkeletonInput class={'pro-table-layout-item'} size="large" />
                            <SkeletonInput class={'pro-table-layout-item'} size="large" />
                        </Col>
                        <Col span={4}>
                            <SkeletonInput class={'pro-table-layout-item active'} size="large"   />
                            <SkeletonInput class={'pro-table-layout-item'} size="large" />
                            <SkeletonInput class={'pro-table-layout-item'} size="large" />
                        </Col>
                    </Row>
                    <Row justify="end">
                        <Col span={8}>
                            <SkeletonInput
                                style={{ width: '100%' }}
                                class={'active'}
                                size="large"
                            />
                        </Col>
                    </Row>
                </div>
            )
        }
    }
})
