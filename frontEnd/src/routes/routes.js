import Home from "./../views/Home.vue"
import Users from "./../views/Users.vue"
import Login from "./../views/LogIn.vue"
import Forget from "./../views/ForgetPass.vue"
import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    { path: "/", component: Login },
    { path: "/recuperar/:token", component: Forget },
    { path: "/home", component: Home, children: [
            { path: "/users", component: Users }
        ]
    }]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})