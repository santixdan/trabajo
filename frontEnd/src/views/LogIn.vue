<template>
  <div class="background-wrapper">
    <div align="center" id="mainContainer" style="margin: 0px">
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
                label="Email"
                placeholder="example@claro.com.co"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please, type your email',
                ]"
              />
              <q-input
                :type="isPwd ? 'password' : 'text'"
                v-model="password"
                label="Password"
                placeholder="xxxxxxxx"
                lazy-rules
                @paste.prevent
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Please, type your password',
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
                label="Log in"
                class="btn text-bold"
                color="primary"
                type="submit"
                :loading="loadingBtnLogIn"
              />
              <div>
                <q-btn
                  unelevated
                  rounded
                  no-caps
                  label="Forgot your password?"
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
    </div>
    <div>
      <q-dialog v-model="modalForget">
        <q-card>
          <q-card-section class="bg-primary row items-center">
            <div class="text-h6 text-white">Recover password</div>
            <q-space />
          </q-card-section>

          <q-card-section>
            <div class="q-pa-md" style="max-width: 400px">
              <q-form @submit="sendEmail()" class="q-gutter-md">
                <q-input
                  type="email"
                  style="max-width: 250px; min-width: 200px"
                  v-model="resetEmail"
                  label="Email"
                  placeholder="example@claro.com.co"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'Please, type your email',
                  ]"
                />
                <div>
                  <q-btn
                    unelevated
                    rounded
                    no-caps
                    :loading="loadingBtnSend"
                    label="Send"
                    type="submit"
                    color="primary"
                  />
                </div>
              </q-form>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
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
import { postLogin, postData } from "./../services/APIClient.js";

const router = useRouter();
const authStore = useAuthStore();
let email = ref("");
let resetEmail = ref("");
let password = ref("");
let isPwd = ref(true);
let modalForget = ref(false);
let loadingBtnLogIn = ref(false);
let loadingBtnSend = ref(false);

async function authenticateUser() {
  loadingBtnLogIn.value = true;
  try {
    let data = await postLogin("/logIn", {
      USR_EMAIL: email.value.trim(),
      USR_PASSWORD: password.value.trim(),
    });
    router.replace("/home");
    notifySuccessRequest("Log in successfully");
    authStore.constructor(data.token, data.user._id, data.user.USR_USERNAME);
    onReset();
    console.log(data);
  } catch (error) {
    console.log(error);
    notifyErrorRequest(
      error?.response?.data?.errors?.[0]?.msg || "Unknown error"
    );
  } finally {
    loadingBtnLogIn.value = false;
  }
}

async function sendEmail() {
  loadingBtnSend.value = true;
  try {
    let data = await postData("/sendEmail", {
      USR_EMAIL: resetEmail.value,
    });
    notifySuccessRequest("Email sent successfully");
    modalForget.value = false;
    resetEmail.value = "";
  } catch (error) {
    console.log(error);
    notifyErrorRequest(
      error?.response?.data?.errors?.[0]?.msg || "Unknown error"
    );
  } finally {
    loadingBtnSend.value = false;
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

.background-wrapper {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.background-wrapper::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("./../assets/images/CLARO-Background.jpg");
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

@media screen and (max-width: 425px) and (min-width: 320px) {
  .background-wrapper {
    height: 90vh;
  }
  #mainContainer {
    height: 85vh !important;
  }
}
</style>