
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)

// element-plus 引入配置文件
import { getEle } from "./plugins/element/";
getEle(app);


app.use(store).use(router).mount('#app')
