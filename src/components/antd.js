import {
  // ConfigProvider,
  // message,
  // notification,
  // Breadcrumb,
  // Button,
  // Calendar,
  // Card,
  // Collapse,
  // Cascader,
  // Checkbox,
  // Col,
  // DatePicker,
  // Dropdown,
  // Form,
  // Input,
  // InputNumber,
  // Layout,
  // Menu,
  Modal,
  // Pagination,
  // Popconfirm,
  // Popover,
  // Radio,
  // Rate,
  // Row,
  // Select,
  // Steps,
  Switch,
  // Table,
  // Tabs,
  // Tag,
  // TimePicker,
  // Tooltip,
  // PageHeader,
  Avatar,
  Badge,
  Empty,
  // Typography,
  Progress,
  Image,
} from 'ant-design-vue'

// import 'ant-design-vue/lib/config-provider/style/index.css'
// import 'ant-design-vue/lib/message/style/index.css'
// import 'ant-design-vue/lib/notification/style/index.css'
// import 'ant-design-vue/lib/breadcrumb/style/index.css'
import 'ant-design-vue/lib/button/style/index.css'
// import 'ant-design-vue/lib/calendar/style/index.css'
// import 'ant-design-vue/lib/card/style/index.css'
// import 'ant-design-vue/lib/collapse/style/index.css'
// import 'ant-design-vue/lib/cascader/style/index.css'
// import 'ant-design-vue/lib/checkbox/style/index.css'
// import 'ant-design-vue/lib/date-picker/style/index.css'
// import 'ant-design-vue/lib/dropdown/style/index.css'
// import 'ant-design-vue/lib/form/style/index.css'
// import 'ant-design-vue/lib/input/style/index.css'
// import 'ant-design-vue/lib/input-number/style/index.css'
// import 'ant-design-vue/lib/layout/style/index.css'
// import 'ant-design-vue/lib/menu/style/index.css'
import 'ant-design-vue/lib/modal/style/index.css'
// import 'ant-design-vue/lib/pagination/style/index.css'
// import 'ant-design-vue/lib/popover/style/index.css'
// import 'ant-design-vue/lib/radio/style/index.css'
// import 'ant-design-vue/lib/rate/style/index.css'
// import 'ant-design-vue/lib/select/style/index.css'
// import 'ant-design-vue/lib/switch/style/index.css'
// import 'ant-design-vue/lib/table/style/index.css'
// import 'ant-design-vue/lib/tabs/style/index.css'
// import 'ant-design-vue/lib/time-picker/style/index.css'
// import 'ant-design-vue/lib/tooltip/style/index.css'
// import 'ant-design-vue/lib/page-header/style/index.css'
// import 'ant-design-vue/lib/grid/style/index.css'
// import 'ant-design-vue/lib/menu/style/index.less'
// import 'ant-design-vue/lib/avatar/style/index.less'
// import 'ant-design-vue/lib/badge/style/index.less'
// import 'ant-design-vue/lib/empty/style/index.less'
// import 'ant-design-vue/lib/progress/style/index.less'
// import 'ant-design-vue/lib/image/style/index.less'

const components = [
  // ConfigProvider,
  // Breadcrumb,
  // Button,
  // Calendar,
  // Card,
  // Collapse,
  // Cascader,
  // Checkbox,
  // Col,
  // DatePicker,
  // Dropdown,
  // Form,
  // Input,
  // InputNumber,
  // Layout,
  // Menu,
  Modal,
  // Pagination,
  // Popconfirm,
  // Popover,
  // Radio,
  // Rate,
  // Row,
  // Select,
  // Steps,
  Switch,
  // Table,
  // Tabs,
  // Tag,
  // TimePicker,
  // Tooltip,
  // PageHeader,
  // Avatar,
  // Badge,
  // Empty,
  // Typography,
  // Progress,
  // Image,
]

export default (app) => {
  components.forEach((component) => {
    app.use(component)
  })
  // app.config.globalProperties.$message = message
  // app.config.globalProperties.$notification = notification
  app.config.globalProperties.$info = Modal.info
  app.config.globalProperties.$success = Modal.success
  app.config.globalProperties.$error = Modal.error
  app.config.globalProperties.$warning = Modal.warning
  app.config.globalProperties.$confirm = Modal.confirm
  app.config.globalProperties.$destroyAll = Modal.destroyAll
}
