import { defineStore } from "pinia"
import { ref } from "vue"

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || null);
    const userID = ref(localStorage.getItem('ID') || null);
    const name = ref(localStorage.getItem('name') || null);

    function constructor(newToken, newUserID, newName) {
        token.value = newToken;
        userID.value = newUserID;
        name.value = newName;
        localStorage.setItem('token', newToken);
        localStorage.setItem('ID', newUserID);
        localStorage.setItem('name', newName);
    }

    function getToken() {
        return token.value;
    }

    function getID() {
        return userID.value;
    }

    function getName() {
        return name.value;
    }

    function deleteUser() {
        token.value = ""
        userID.value = ""
        name.value = ""
        localStorage.removeItem('ID');
        localStorage.removeItem('token');
        localStorage.removeItem('name');
    }

    return {
        constructor, getToken, getID, getName, deleteUser
    }
})