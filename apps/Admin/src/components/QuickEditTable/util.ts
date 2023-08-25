import { randomString } from '@jetlinks/utils'
export const dataAddID = (data: any[], rowHeight: number) => {
  return data.map((item, index ) => {
    item.offetTop = (index) * rowHeight
    item.index = index + 1

    if (!item._quick_id) {
      item._quick_id = randomString(32)
    }
    return item
  })
}
