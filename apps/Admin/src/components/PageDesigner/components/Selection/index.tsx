import { isHTMLTag } from '@vue/shared'
import { withModifiers } from 'vue'
import './index.less'
import { AIcon } from 'jetlinks-ui-components'

const Selection = defineComponent({
  name: 'Selection',
  inheritAttrs: false,
  customOptions: {},
  props: {
    data: {
      type: Object,
      default: () => { }
    },
    tag: {
      type: String,
      default: 'div'
    },
    parent: {
      type: [Array, Object],
      default: () => []
    },
    hasMask: {
      type: Boolean,
      default: false
    },
    hasDrag: {
      type: Boolean,
      default: true
    },
    hasDel: {
      type: Boolean,
      default: false
    },
    hasCopy: {
      type: Boolean,
      default: false
    },
  },
  setup(props, { slots }) {
    const designer: any = inject('FormDesigner')

    const Selected = computed(() => {
      return props?.data?.key !== undefined && designer.selected?.value?.key === props?.data?.key
    })

    const isEditModel = computed(() => {
      return unref(designer?.model) === 'edit'
    })

    const handleClick = () => {
      if (unref(isEditModel)) {
        designer.setSelection(props.data)
      }
    }

    const TagComponent = isHTMLTag(props.tag as string) ? props.tag : resolveComponent(props.tag as string)

    const _hasDrag = computed(() => { return props.hasDrag })


    return () => {
      return (
        <TagComponent
          // data-id={props.data?.key}
          class={[
            'selectElement',
            unref(isEditModel) && unref(_hasDrag) && 'handle',
            unref(isEditModel) && Selected.value && 'Selected',
            unref(isEditModel) && 'edit-hover',
          ]}
          {...useAttrs()}
          onClick={withModifiers(handleClick, ['stop'])}
        >
          {slots?.default()}
          {
            unref(isEditModel) && Selected.value && (
              <div class="bottomRight">
                {
                  props.hasCopy && (
                    <div
                      class="action"
                      onClick={withModifiers(() => {

                      }, ['stop'])}
                    >
                      <AIcon type="CopyOutlined" />
                    </div>
                  )
                }
                {
                  props.hasDel && (
                    <div
                      class="action"
                      onClick={withModifiers(() => { }, ['stop'])}
                    >
                      <AIcon type="DeleteOutlined" />
                    </div>
                  )
                }
              </div>
            )
          }
          {props.hasMask && <div class={['mask']}></div>}
        </TagComponent>
      )
    }
  }
})

export default Selection
