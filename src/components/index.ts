import type { App } from 'vue'
import TitleComponent from './TitleComponent/index.vue'
import ImageUpload from "./Upload/Image/ImageUpload.vue";
import ListPage from './ListPage/index.vue';
import { FormPreview } from './FormDesigner/index';

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
import CardBox from './CardBox/index.vue'
import CheckSpin from './CheckSpin/index.vue'
import CheckButton from './CheckButton/index.vue'
import PageDesigner from './PageDesigner/index.vue'

export {
    TitleComponent,
    ImageUpload,
    FormPreview,
    QuickEditTable,
    Search,
    DragBox,
    DragContent,
    Card,
    BadgeStatus,
    ProImage,
    EditorModal,
    ListPage,
    CRUD,
    Menu,
    Project,
    EmptySelect,
    BooleanSelect,
    SQLCode,
    FunctionCode,
    OppositeSelect,
    CardBox,
    CheckSpin,
    CheckButton,
    PageDesigner
}