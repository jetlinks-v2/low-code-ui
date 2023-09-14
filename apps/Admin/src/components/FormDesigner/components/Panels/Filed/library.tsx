
import { filedData } from '../../../utils/defaultData'
import DragGableWrap from '../../Draggable/DragGableWrap'
import './index.less';
import { Card, AIcon } from 'jetlinks-ui-components';
import { onEnd } from '@/components/FormDesigner/components/Draggable/ControlInsertionPlugin';
import generatorData from '@/components/FormDesigner/utils/generatorData';
import { cloneDeep, omit } from 'lodash-es';

const Library = defineComponent({
    name: 'Library',
    inheritAttrs: false,
    setup() {
        const designer: any = inject('FormDesigner')

        const handleClone = (element) => {
            const item = { ...generatorData(omit(element, ['icon'])) }
            return cloneDeep(item)
        }

        const slots = {
            item: ({ element }) => {
                return (
                    <div class="filed-item-card">
                        <div class="filed-item-card-icon">
                            <AIcon type={element.icon} style={{ fontSize: '25px' }} />
                        </div>
                        <div class="filed-item-card-text">{element.name}</div>
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
                                            onEnd={(e) => {
                                                onEnd(e, designer)
                                            }}
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