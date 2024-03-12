import {ref} from 'vue'
import type {Ref} from 'vue'
import {difference} from "lodash-es";

export const useMouseEvent = (El: Ref<HTMLDivElement>, enabled, pScale, offset) => {
  // 缩放
  const scale = ref<number>(pScale ?? 1)

  // 拖拽
  const isDragging = ref<boolean>(false)

  const diff = {
    x: offset.x || 0,
    y: offset.y || 0
  }

  const lastPointermove = {
    x: 0,
    y: 0
  }
  const rootPointer = {
    x: 0,
    y: 0
  }

  /**
   * 获取鼠标点击时，鼠标位于dom的位置
   * @param e
   */
  const handlePointerdown = (e) => {
    if (!El.value) return
    const rootEl = El.value.querySelector('._root') as HTMLDivElement
    if (rootEl) {
      isDragging.value = true

      rootPointer.x = rootEl.dataset.x ? Number(rootEl.dataset.x) : 0
      rootPointer.y = rootEl.dataset.y ? Number(rootEl.dataset.y) : 0

      lastPointermove.x = e.clientX
      lastPointermove.y = e.clientY
      El.value.classList.add('_root-dragging')
    }
    // 处理鼠标拖拽过程抬起仍旧处于拖拽状态问题
    El.value.ondragstart = function (e) {
      e.preventDefault()
    }
    El.value.ondragend = function (e) {
      e.preventDefault()
    }
  }

  const handlePointermove = (e) => {
    if (!El.value) return
    if (isDragging.value) {
      const rootEl = El.value.querySelector('._root') as HTMLDivElement
      if (rootEl) {
        const styles = El.value.getBoundingClientRect()

        // difference 用于缩小时，拖动会变慢，需要乘以（1 + 相差倍数）
        // const difference = 1 + (1 - scale.value)

        diff.x = (e.clientX - lastPointermove.x + rootPointer.x)
        diff.y = (e.clientY - lastPointermove.y + rootPointer.y)

        // if (styles.height >= Math.abs(diff.y) && styles.width >= Math.abs(diff.x)) { // 不能超过父级宽高
          // 保存移动多少距离
          rootEl.dataset.x = String(diff.x)
          rootEl.dataset.y = String(diff.y)
          rootEl.style.transform = `scale(${scale.value}) translate3d(${diff.x}px, ${diff.y}px, 0)`
        // }
      }
    }
  }

  const handlePointerup = (e) => {
    isDragging.value = false
    if (!El.value) return
    El.value.classList.remove('_root-dragging')
  }

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const deltaY = e.deltaY
    deltaY < 0 ? enlarge() :zoomOut()
  }

  const TransformRender = () => {
    const rootEl = El.value.querySelector('._root') as HTMLDivElement
    if (rootEl) {
      rootEl.style.transform = `scale(${scale.value}) translate3d(${diff.x}px, ${diff.y}px, 0)`
    }
  }

  /**
   * 放大
   */
  const enlarge = () => {
    let oldValue = scale.value
    oldValue += 0.1
    scale.value = oldValue >= 1.25 ? 1.25 : oldValue
    TransformRender()
  }

  /**
   * 缩小
   */
  const zoomOut = () => {
    let oldValue = scale.value
    oldValue -= 0.1
    scale.value = oldValue <= 0.5 ? 0.5 : oldValue
    TransformRender()
  }

  const bindEventListener = () => {
    El.value?.addEventListener('pointerdown', handlePointerdown, { passive: true })
    El.value?.addEventListener('pointermove', handlePointermove, { passive: true });
    El.value?.addEventListener('pointerup', handlePointerup, { passive: true });
    El.value?.addEventListener('wheel', handleWheel, { passive: true })
    document.addEventListener('pointerup', handlePointerup, { passive: true });
  }

  const removeEventListener = () => {
    El.value?.removeEventListener('pointerdown', handlePointerdown)
    El.value?.removeEventListener('pointermove', handlePointermove);
    El.value?.removeEventListener('pointerup', handlePointerup);
    El.value?.removeEventListener('wheel', handleWheel)
    document.removeEventListener('pointerup', handlePointerup);
    if (El.value) {
      El.value.ondragstart = null
      El.value.ondragend = null
    }
  }

  nextTick(() => {
    if (enabled) {
      bindEventListener()
    }
  })

  onUnmounted(() => {
    removeEventListener()
  })

  onMounted(() => {
    TransformRender()
  })

  return {
    enlarge, zoomOut, scale
  }
}
