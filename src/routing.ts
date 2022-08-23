import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeVue from './pages/Home.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: HomeVue,
    }
]

export default createRouter({
    history: createWebHashHistory(),
    routes
})