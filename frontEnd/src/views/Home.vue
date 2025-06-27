<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="custom-toolbar-title">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <router-link to="/home">
            <q-avatar class="cursor-pointer" size="55px">
              <img src="./../assets/images/Claro-blanco 1.svg" />
            </q-avatar>
          </router-link>
        </q-toolbar-title>
        <h6 style="margin: 0px;"><q-icon name="person" />{{ name }}</h6>
        <q-space />
        <q-btn icon="logout" flat round unelevated :ripple="false" @click="alert = true"/>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" side="left" overlay bordered>
      <q-list padding>
        <div class="q-pa-md q-gutter-sm column">
          <q-btn unelevated rounded to="/users" label="Usuarios" color="primary" class="full-width q-mb-sm" />
        </div>
      </q-list>


    </q-drawer>
    <q-page-container>
      <div v-if="$route.path === '/home'" class="q-pa-md row justify-center items-center q-gutter-md">
        <q-card class="my-card text-white">
          <q-card-section class="bg-primary">
            <div class="text-h6" align="center">Usuarios</div>
          </q-card-section>
          <q-separator dark />
          <q-card-section id="imgSection">
            <img id="imgCards" src="https://media-public.canva.com/ZD6iE/MAEpzcZD6iE/1/t.png" alt="usersIcon">
          </q-card-section>
          <q-separator />
          <q-card-actions id="btnSection">
            <q-btn unelevated rounded to="/users" color="primary">BUSCAR</q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <router-view></router-view>
    </q-page-container>
    <q-footer class="text-black" style="background-color: #525252;">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-h6 text-subtitle2 text-grey-4">Todos los derechos reservados, Claro 2025</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="alert" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6">Cerrar sesión</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            ¿Seguro que deseas cerrar sesión?
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Sí" to="/" color="red-9" v-close-popup @click="logOut()" />
            <q-btn flat label="No" color="grey-9" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from "./../stores/useAuth.js";

const authStore = useAuthStore();
const leftDrawerOpen = ref(false);
let name = authStore.getName();
let alert = ref(false);

function logOut() {
  authStore.deleteUser()
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style>
#imgCards {
  height: 150px;
}

#imgSection,
#btnSection {
  display: flex;
  justify-content: center;
}

.my-card {
  width: 100%;
  max-width: 400px
}
</style>
