import Home from "./../views/Home.vue"
import Users from "./../views/Users.vue"
import Login from "./../views/LogIn.vue"
import ResetPass from "./../views/ResetPass.vue"
import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    { path: "/", component: Login },
    { path: "/resetPass/:token", component: ResetPass },
    { path: "/home",  name: "home", component: Home, meta: { breadcrumb: 'Home', icon: 'home' }, children: [
            { path: "users", name: "users", component: Users, meta: { breadcrumb: 'Users', icon: 'people' } }
        ]
    }]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})