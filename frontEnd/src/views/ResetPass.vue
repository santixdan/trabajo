<template>
  <div align="center" id="mainContainer" class="background-wrapper" style="margin: 0px">
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
              :type="isPwd1 ? 'password' : 'text'"
              v-model="new_password"
              label="Nueva contraseña"
              lazy-rules
              @paste.prevent
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Please, type your password',
              ]"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd1 ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd1 = !isPwd1"
                />
              </template>
            </q-input>
            <q-input
              :type="isPwd2 ? 'password' : 'text'"
              v-model="conf_password"
              label="Confirmar contraseña"
              lazy-rules
              @paste.prevent
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Please, check the password',
              ]"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd2 ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd2 = !isPwd2"
                />
              </template>
            </q-input>
            <q-btn
              unelevated
              rounded
              no-caps
              label="Guardar"
              class="btn text-bold"
              color="primary"
              type="submit"
              :loading="loadingBtn"
            />
            <div></div>
          </q-form>
        </div>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  notifyErrorRequest,
  notifySuccessRequest,
} from "./../composables/notify.js";
import { putData } from "./../services/APIClient.js";

const router = useRouter();
let new_password = ref("");
let conf_password = ref("");
let isPwd1 = ref(true);
let isPwd2 = ref(true);
let loadingBtn = ref(false);
let token = router.currentRoute.value.params.token;

async function authenticateUser() {
  loadingBtn.value = true;
  try {
    if (new_password.value === conf_password.value) {
      let data = await putData("/updatePass", {
        token: token,
        CONF_PASS: conf_password.value,
        NEW_PASS: new_password.value,
      });
      notifySuccessRequest("Password updated successfully");
      router.replace("/");
      onReset();
    } else {
      notifyErrorRequest("Passwords do not match");
    }
  } catch (error) {
    console.log(error);
    notifyErrorRequest(
      error?.response?.data?.errors?.[0]?.msg || "Unknown error"
    );
  } finally {
    loadingBtn.value = false;
  }
}

function onReset() {
  conf_password.value = "";
  new_password.value = "";
}
</script>
<style scoped>
.my-card {
  width: 100%;
  max-width: 300px;
}

#hr2 {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}

#mainContainer {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  height: 100vh !important;
}

.cardContent {
  display: flex;
  flex-direction: column;
}
</style>