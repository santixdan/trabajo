<template>
  <div align="center" id="superContainer" style="margin: 0px">
    <q-card style="margin: 0px" class="my-card">
      <q-card-actions class="cardContent" align="center">
        <div class="column items-center q-mt-md">
          <img
            style="height: 100px; width: 100px"
            src="./../assets/images/Claro-rojo 1.svg"
          />
        </div>
        <div class="q-pa-md" style="max-width: 300px">
          <q-form @submit="authenticateUser()" class="q-gutter-md">
            <q-input
              type="email"
              v-model="email"
              label="Correo"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Por favor, dígite el correo',
              ]"
            />
            <q-input
              :type="isPwd ? 'password' : 'text'"
              v-model="password"
              label="Contraseña"
              lazy-rules
              @paste.prevent
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Por favor, dígite la contraseña',
              ]"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <q-btn
              unelevated
              rounded
              no-caps
              label="Iniciar sesión"
              class="btn text-bold"
              color="primary"
              type="submit"
              :loading="loading"
            />
            <div>
              <q-btn
                unelevated
                rounded
                no-caps
                label="Olvidé mi contraseña"
                color="grey-9"
                flat
                class="q-ml-sm"
                @click="modalForget = true"
              />
            </div>
          </q-form>
        </div>
      </q-card-actions>
    </q-card>
    <!-- <div class="q-pa-md q-gutter-sm">
            <q-dialog v-model="modalForget">
                <q-card>
                    <q-card-section class="bg-primary row items-center">
                        <div class="text-h6 text-white">Cambiar contraseña</div>
                        <q-space />
                    </q-card-section>

                    <q-card-section>
                        <div class="q-pa-md" style="max-width: 400px">
                            <q-form class="q-gutter-md">
                                <q-input type="email" style="max-width: 250px; min-width: 200px;" v-model="email2"
                                    label="Correo" lazy-rules
                                    :rules="[val => (val && val.length > 0) || 'Por favor, dígite el correo']" />
                                <div>
                                    <q-btn unelevated rounded :loading="loading" label="Enviar" type="submit"
                                        color="primary" />
                                </div>
                            </q-form>
                        </div>
                    </q-card-section>
                </q-card>
            </q-dialog>
        </div> -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "./../stores/useAuth.js";
import {
  notifyErrorRequest,
  notifySuccessRequest,
} from "./../composables/notify.js";
import { postLogin } from "./../services/APIClient.js";

const router = useRouter();
const authStore = useAuthStore();
let email = ref("");
let password = ref("");
let isPwd = ref(true);
let modalForget = ref(false);
let loading = ref(false);

async function authenticateUser() {
  loading.value = true;
  try {
    let data = await postLogin("/logIn", {
      USR_EMAIL: email.value.trim(),
      USR_PASSWORD: password.value.trim(),
    });
    notifySuccessRequest("Inicio de sesión exitoso.");
    authStore.constructor(data.token, data.user._id, data.user.USR_NAME);
    router.replace("/home");
    onReset();
    console.log(data);
  } catch (error) {
    console.log(error);
    notifyErrorRequest(
      error?.response?.data?.errors?.[0]?.msg || "Error desconocido"
    );
  } finally {
    loading.value = false;
  }
}

function onReset() {
  email.value = "";
  password.value = "";
}
</script>
<style>
.my-card {
  width: 100%;
  max-width: 300px;
}

body {
  position: relative;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  z-index: 0;
}

body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("https://img.lalr.co/cms/2017/07/07201512/CLARO-.jpg?size=xl&ratio=r40_21");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.7;
  z-index: -1;
}

#hr2 {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}

#superContainer {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  height: 100vh !important;
}

#logintxt {
  margin-top: 15px;
}

.cardContent {
  display: flex;
  flex-direction: column;
}
</style>