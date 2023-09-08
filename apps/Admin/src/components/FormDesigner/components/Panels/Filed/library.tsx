
import { filedData } from '../../../utils/defaultData'
import DragGableWrap from '../../Draggable/DragGableWrap'
import './index.less';
import { Card, AIcon } from 'jetlinks-ui-components';
// import { onEnd, onMove } from '@/components/FormDesigner/components/Draggable/ControlInsertionPlugin';
import generatorData from '@/components/FormDesigner/utils/generatorData';
import { cloneDeep, omit } from 'lodash-es';

const Library = defineComponent({
    name: 'Library',
    inheritAttrs: false,
    setup() {
        // const designer: any = inject('FormDesigner')

        const handleClone = (element) => {
            const item = { ...generatorData(omit(element, ['icon'])) }
            return cloneDeep(item)
        }

        const slots = {
            item: ({ element }) => {
                return (
                    <div class="filed-item-card">
                        <Card hoverable>
                            <div class="filed-item-card-item">
                                <AIcon type={element.icon} style={{ fontSize: '25px' }} />
                                <span>{element.name}</span>
                            </div>
                        </Card>
                    </div>
                )
            }
        }

        const options = {
            animation: 150,
            direction: 'horizontal',
            scroll: false,
            sort: false,
            group: { name: "j-canvas", pull: 'clone', put: false },
            ghostClass: 'ghost',
            clone: handleClone
        }

        return () => {
            return (
                <div class="filed-container">
                    {filedData.map((element) => {
                        return (
                            <div key={element.id} class="filed-item">
                                <div class="filed-item-title">{element.name}</div>
                                {
                                    element.children?.length && (
                                        <DragGableWrap
                                            list={element?.children || []}
                                            {...options}
                                            class={"filed-item-children"}
                                            tag={'div'}
                                            v-slots={slots}
                                            item-key="type"
                                            data-layout-type={'filed-item'}
                                        ></DragGableWrap>
                                    )
                                }
                            </div>
                        )
                    })}
                </div>
            )
        };
    },
});

export default Library;