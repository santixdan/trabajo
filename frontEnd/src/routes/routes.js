import Home from "./../views/Home.vue"
import Users from "./../views/Users.vue"
import Login from "./../views/LogIn.vue"
import ResetPass from "./../views/ResetPass.vue"
import { createRouter, createWebHashHistory } from "vue-router"
import { useAuthStore } from "../stores/useAuth"
import { ref } from "vue"
ref

function auth(to,from,next) {
    const authStore = useAuthStore();
    const token = authStore.getToken()
    if (token) {
        next()
    } else {
        return next("/")
    }
};

const routes = [
    { path: "/", component: Login },
    { path: "/resetPass/:token", component: ResetPass },
    { path: "/home",  name: "home", component: Home, meta: { breadcrumb: 'Home', icon: 'home' }, beforeEnter:auth , children: [
            { path: "users", name: "users", component: Users, meta: { breadcrumb: 'Users', icon: 'people' }, beforeEnter:auth  }
        ]
    }]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.path === "/") {
        authStore.deleteUser();
    }

    if (to.path.startsWith("/home")) {
        const newToken = localStorage.getItem("token"); 
        if (newToken) {
            authStore.setToken(newToken); 
        }
    }

    next();
});