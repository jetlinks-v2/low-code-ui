import type { App } from 'vue'
import TitleComponent from './TitleComponent/index.vue'
import ImageUpload from "./Upload/Image/ImageUpload.vue";
import FormDesigner from './FormDesigner/index.vue';
import ListPage from './ListPage/index.vue';
import {FormPreview} from './FormDesigner/index';

import QuickEditTable from './QuickEditTable/index.vue'
import Search from './Search'
import Menu from './Menu/index.vue'
import Project from './ProJect'
import DragBox, { DragContent } from "./DragBox";
import Card from "./Card";
import BadgeStatus from "./BadgeStatus";
import ProImage from './Image/index.vue'
import EditorModal from './EditorModal'
import CRUD from './Database'
import {BooleanSelect, EmptySelect} from './Select'
import { SQLCode, FunctionCode } from './SQL'
import OppositeSelect from './OppositeSelect/index.vue'

export default  {
    install(app: App) {
        app.component('TitleComponent', TitleComponent)
          .component('ImageUpload', ImageUpload)
          .component('FormPreview', FormPreview)
          .component('QuickEditTable', QuickEditTable)
          .component('ProSearch', Search)
          .component('DragBox', DragBox)
          .component('DragContent', DragContent)
          .component('Card', Card)
          .component('BadgeStatus', BadgeStatus)
          .component('ProImage', ProImage)
          .component('EditorModal', EditorModal)
          .component('ListPage', ListPage)
          .component('CRUD', CRUD)
          .component('Menu', Menu)
          .component('Project',Project)
          .component('EmptySelect',EmptySelect)
          .component('BooleanSelect',BooleanSelect)
          .component('SQLCode', SQLCode)
          .component('FunctionCode', FunctionCode)
          .component('OppositeSelect',OppositeSelect)
    }
}
