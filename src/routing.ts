import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeVue from './pages/Home.vue'
import AboutVue from './pages/About.vue'
import ConfigVue from './pages/Config.vue'
import PostVue from './pages/Post.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: HomeVue,
    },
    {
        path: '/post',
        component: PostVue
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