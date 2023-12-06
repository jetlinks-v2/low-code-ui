import {computed, defineComponent} from 'vue'
import {Modal, Drawer, Button, Space} from 'jetlinks-ui-components'
import {request as axiosRequest} from '@jetlinks-web/core'
import PagePreview from "@LowCode/components/PageDesigner/preview.vue";
import FormPreview from "@LowCode/components/FormDesigner/preview.vue";
import {useTool} from "@LowCode/components/PageDesigner/hooks";
import {useRouter} from "vue-router";

export default defineComponent({
    name: 'ProTableModal',
    inheritAttrs: false,
    customOptions: {},
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
    },
    emits: ['save', 'close'],
    setup(props, {emit}) {
        const {modalType, type, code, title, data, createdCode, okCode, width, footerVisible} = props?.data
        const {isEditModel, paramsUtil} = useTool()
        const route = useRoute()
        const router = useRouter()
        const formRef = ref()
        const pageRef = ref()
        const myValue = ref()

        const config = computed(() => {
            return JSON.parse(code || '{}')
        })

        const onCreatedFn = (code?: string) => {
            if (code && !isEditModel.value) {
                const _refs = type === 'page' ? { pageRef, myValue } : { formRef, myValue }
                const fn = new Function('record', 'refs', 'util', code)
                fn(data || {}, _refs, paramsUtil)
            }
        }

        onCreatedFn(createdCode)

        const renderChildren = () => {
            if (type === 'page') {
                return <PagePreview ref={pageRef.value} data={config.value} pageValue={myValue.value}/>
            }
            return <FormPreview
                value={myValue.value}
                mode={'edit'}
                data={config.value}
                type={'low-code'}
                ref={formRef}
            />
        }

        const onSave = async () => {
            if (!okCode) return
            const handleResultFn = new Function('refs', 'util', okCode)
            const _refs = type === 'page' ? { pageRef, myValue } : { formRef, myValue }
            const resp = await handleResultFn(_refs, paramsUtil)
            if (resp) {
                emit('save', true)
            }
        }

        const onCancel = () => {
            emit('close')
        }

        const footerContent = () => {
            return <Space>
                <Button onClick={onCancel}>取消</Button>
                <Button type='primary' onClick={onSave}>确认</Button>
            </Space>
        }
        const renderContent = () => {
            if (modalType === 'modal') {
                return <Modal
                    visible
                    title={title}
                    width={width}
                    onOk={onSave}
                    onCancel={onCancel}
                >
                    {renderChildren()}
                </Modal>
            } else {
                return <Drawer
                    visible
                    title={title}
                    width={width}
                    footer={footerVisible && footerContent()}
                    onClose={onCancel}
                >
                    {renderChildren()}
                </Drawer>
            }
        }

        return () => {
            return renderContent()
        }
    }
})
