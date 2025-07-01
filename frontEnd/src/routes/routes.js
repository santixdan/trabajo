import Home from "./../views/Home.vue"
import Users from "./../views/Users.vue"
import Login from "./../views/LogIn.vue"
import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    { path: "/", component: Login },
    { path: "/home",  name: "home", component: Home, meta: { breadcrumb: 'Inicio', icon: 'home' }, children: [
            { path: "users", name: "users", component: Users, meta: { breadcrumb: 'Usuarios', icon: 'people' } }
        ]
    }]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})