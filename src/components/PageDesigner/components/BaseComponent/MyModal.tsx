import {computed, defineComponent} from 'vue'
import {Modal, Drawer, Button, Space} from 'jetlinks-ui-components'
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
        type: {
            type: String,
            default: ''
        }
    },
    emits: ['save', 'close'],
    setup(props, {emit}) {
        const {modalType, pageType, code, title, data, createdCode, okCode, width, footerVisible, cancelCode} = props?.data
        const {isEditModel, paramsUtil, _global} = useTool()
        const formRef = ref()
        const pageRef = ref()
        const myValue = ref()

        const config = computed(() => {
            return JSON.parse(code || '{}')
        })

        const onCreatedFn = (code?: string) => {
            if (code && !isEditModel.value) {
                const _refs = pageType === 'page' ? {pageRef, myValue} : {formRef, myValue}
                if(props.type === 'table'){
                    const fn = new Function('record', 'refs', 'util', 'global', code)
                    fn(data || {}, _refs, paramsUtil, _global)
                } else {
                    const fn = new Function('refs', 'util', 'global', code)
                    fn(_refs, paramsUtil, _global)
                }
            }
        }

        onCreatedFn(createdCode)

        const renderChildren = () => {
            if (pageType === 'page') {
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
            const handleResultFn = new Function('refs', 'util', 'global', okCode)
            const _refs = pageType === 'page' ? {pageRef, myValue} : {formRef, myValue}
            const resp = await handleResultFn(_refs, paramsUtil, _global)
            if (resp) {
                props.type === 'table' ? emit('save', true) : emit('save')
            }
        }

        const onCancel = async () => {
            if (!cancelCode) return
            const handleResultFn = new Function('refs', 'util', 'global', okCode)
            const _refs = pageType === 'page' ? {pageRef, myValue} : {formRef, myValue}
            const resp = await handleResultFn(_refs, paramsUtil, _global)
            if (resp) {
                emit('close')
            }
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
