import {computed, defineComponent} from 'vue'
import {Modal, Drawer, Button, Space} from 'jetlinks-ui-components'
import {request as axiosRequest} from '@jetlinks-web/core'
import PagePreview from "@LowCode/components/PageDesigner/preview.vue";
import FormPreview from "@LowCode/components/FormDesigner/preview.vue";
import {useTool} from "@LowCode/components/PageDesigner/hooks";

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
        const {modalType, type, code, title, data, mountedCode, okCode} = props?.data
        const {isEditModel} = useTool()
        const route = useRoute()
        const formRef = ref()
        const pageRef = ref()
        const value = ref()

        const config = computed(() => {
            return JSON.parse(code || '{}')
        })
        const onMountedFn = (code?: string) => {
            if (code && !isEditModel.value) {
                const fn = new Function('record', 'axios', 'route', 'refs', code)
                fn(data || {}, axiosRequest, route, { formRef })
            }
        }

        onMounted(() => {
            onMountedFn(mountedCode)
        })

        const renderChildren = () => {
            if (type === 'page') {
                return <PagePreview ref={pageRef.value} data={config.value}/>
            }
            return <FormPreview
                value={value.value}
                mode={'edit'}
                data={config.value}
                type={'low-code'}
                ref={formRef.value}
            />
        }

        const setValue = (val: any) => {
            value.value = val
        }

        const onSave = async () => {
            if (!okCode) return
            const handleResultFn = new Function('axios', 'route', 'refs', okCode)
            const _refs = type === 'page' ? { pageRef, setValue } : { formRef, setValue }
            const resp = await handleResultFn(axiosRequest, route,  _refs)
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
                    width={700}
                    onOk={onSave}
                    onCancel={onCancel}
                >
                    {renderChildren()}
                </Modal>
            } else {
                return <Drawer
                    visible
                    title={title}
                    footer={footerContent()}
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
