import { defineStore } from "pinia"
import { ref } from "vue"

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || null);
    const userID = ref(localStorage.getItem('ID') || null);
    const username = ref(localStorage.getItem('username') || null);

    function constructor(newToken, newUserID, newUsername) {
        token.value = newToken;
        userID.value = newUserID;
        username.value = newUsername;
        localStorage.setItem('token', newToken);
        localStorage.setItem('ID', newUserID);
        localStorage.setItem('username', newUsername);
    }

    function getToken() {
        return token.value;
    }

    function getID() {
        return userID.value;
    }

    function getUsername() {
        return username.value;
    }

    function deleteUser() {
        token.value = ""
        userID.value = ""
        username.value = ""
        localStorage.removeItem('ID');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    }

    return {
        constructor, getToken, getID, getUsername, deleteUser
    }
})