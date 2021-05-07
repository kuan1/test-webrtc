import './styles/index.less'

import { createApp } from 'vue'
import App from './App.vue'
import rotuer from '@/router'

import '@/utils/ws'

createApp(App).use(rotuer).mount('#app')
