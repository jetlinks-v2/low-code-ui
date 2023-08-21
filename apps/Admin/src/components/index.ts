import type { App } from 'vue'
import TitleComponent from './TitleComponent/index.vue'
import ImageUpload from "./Upload/Image/ImageUpload.vue";
import QuickEditTable from './QuickEditTable/index.vue'
import Search from './Search'
import DragBox from "./DragBox";
import Card from "./Card";
import BadgeStatus from "./BadgeStatus";
import ProImage from './Image/index.vue'
import EditorModal from './EditorModal'
import CRUD from './Database'
export default  {
    install(app: App) {
        app.component('TitleComponent', TitleComponent)
          .component('ImageUpload', ImageUpload)
          .component('QuickEditTable', QuickEditTable)
          .component('ProSearch', Search)
          .component('DragBox', DragBox)
          .component('Card', Card)
          .component('BadgeStatus', BadgeStatus)
          .component('ProImage', ProImage)
          .component('EditorModal', EditorModal)
          .component('CRUD', CRUD)
    }
}
