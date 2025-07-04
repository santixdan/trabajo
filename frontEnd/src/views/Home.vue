<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <router-link to="/home">
          <img src="./../assets/images/Claro-blanco 1.svg" />
        </router-link>
        <q-space></q-space>
        <h6 style="margin: 0px">{{ username }}</h6>
        <q-btn
          icon="logout"
          flat
          round
          unelevated
          :ripple="false"
          @click="alert = true"
        />
      </q-toolbar>
      <q-breadcrumbs active-color="white" style="font-size: 16px">
        <q-breadcrumbs-el
          v-for="(crumb, index) in breadcrumbLinks"
          :key="index"
          :label="crumb.label"
          :to="crumb.to"
          :icon="crumb.icon"
          :exact="true"
          class="cursor-pointer"
        />
      </q-breadcrumbs>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      behavior="mobile"
      overlay
      bordered
    >
      <q-list padding>
        <div class="q-pa-md q-gutter-sm column">
          <q-btn
            unelevated
            rounded
            no-caps
            to="/home/users"
            label="Users"
            color="primary"
            icon="people"
            class="full-width q-mb-sm"
          />
        </div>
      </q-list>
    </q-drawer>
    <q-page-container>
      <div
        v-if="$route.path === '/home'"
        class="q-pa-md row justify-center items-center q-gutter-md"
      >
        <q-card class="my-card text-white">
          <q-card-section class="bg-primary">
            <div class="text-h6" align="center">Users</div>
          </q-card-section>
          <q-separator dark />
          <q-card-section id="imgSection">
            <img
              id="imgCards"
              src="https://media-public.canva.com/ZD6iE/MAEpzcZD6iE/1/t.png"
              alt="usersIcon"
            />
          </q-card-section>
          <q-separator />
          <q-card-actions id="btnSection">
            <q-btn no-caps unelevated rounded to="/home/users" color="primary"
              >Search</q-btn
            >
          </q-card-actions>
        </q-card>
      </div>
      <router-view></router-view>
    </q-page-container>
    <q-footer class="text-black" style="background-color: #525252; height: 30px; display: flex; align-items: center;" align="center">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-h6 text-subtitle2 text-grey-4">
            Todos los derechos reservados, Claro 2025
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="alert" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6">Log out</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            Are you sure you want to log out?
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Yes"
              to="/"
              color="red-9"
              v-close-popup
              @click="logOut()"
            />
            <q-btn flat label="No" color="grey-9" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "./../stores/useAuth.js";

const authStore = useAuthStore();
const route = useRoute();
const leftDrawerOpen = ref(false);
let username = authStore.getUsername();
let alert = ref(false);

const breadcrumbLinks = computed(() => {
  const matched = route.matched.filter((r) => r.meta && r.meta.breadcrumb);
  return matched.map((r) => ({
    label: r.meta.breadcrumb,
    icon: r.meta.icon,
    to: { name: r.name, params: route.params },
  }));
});

function logOut() {
  authStore.deleteUser();
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
  max-width: 400px;
}
</style>
