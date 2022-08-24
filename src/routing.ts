import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeVue from './pages/Home.vue'
import ImageVue from './pages/Image.vue'
import AboutVue from './pages/About.vue'
import ConfigVue from './pages/Config.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: HomeVue,
    },
    {
        path: '/image',
        component: ImageVue
    },
    {
        path: '/config',
        component: ConfigVue
    },
    {
        path: '/about',
        component: AboutVue
    }
]

export default createRouter({
    history: createWebHashHistory(),
    routes
})