import { storeToRefs } from '@jetlinks/stores'
import OperationBtns from './Btns/index.vue'
import OperationColumns from './Columns/index.vue'
import { useOperationButton } from '@/store/operationButton'
export { OperationBtns, OperationColumns }

const { btnTree, commonUseBtn } = useOperationButton();

const commonUseBtnName = commonUseBtn.map(item => {
  return item.title;
})
/**
 * 操作按钮校验
 */
export const validOperationBtn = async () => {
  let errorNum = 0;
  let errorList = [];
  function valid (data: any[]) {
    data.forEach(item => {
      if(item.type !== 'customer') {
        if(!item.functions) {
          errorNum++;
        }
        if(!item.command) {
          errorNum++;
        }
        if(!item.pages) {
          errorNum++;
        }
      } else {
        if(item.title.length < 2 || item.title.length > 8 || commonUseBtnName.includes(item.title)) {
          errorNum++;
        }
      }
      if(item.children) {
        valid(item.children)
      }
    })
    console.log(errorNum);
    return errorNum;
  }
  valid(btnTree);
}

