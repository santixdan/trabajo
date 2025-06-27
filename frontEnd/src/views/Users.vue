<template>
  <div class="todo">
    <div class="q-mx-xl q-pt-lg">
      <q-table
        :rows="filteredRows"
        :columns="columns"
        row-key="name"
        :loading="loading"
      >
        <template v-slot:top>
          <div class="row items-center justify-between q-pa-sm full-width">
            <div class="text-h6 text-bold">Usuarios</div>
            <div class="row items-center justify-center q-gutter-md">
              <q-input v-model="inpSearch" label="Buscar">
                <template v-slot:append>
                  <q-btn icon="search" round dense unelevated />
                </template>
              </q-input>
              <q-btn
                unelevated
                round
                icon="add"
                color="primary"
                @click="(icon = true), (change = false)"
                size="md"
              >
                <q-tooltip> Crear usuario </q-tooltip>
              </q-btn>
            </div>
          </div>
        </template>
        <template v-slot:body-cell-options="props">
          <q-td :props="props">
            <q-btn
              @click="
                (isDialogOpen = true),
                  (isCreating = true),
                  bringId(props.row._id)
              "
              unelevated
              round
              ><q-icon name="edit_note" size="xs" />
              <q-tooltip> Editar a {{ props.row.nombre }} </q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.estado == 0"
              @click="toggleStatus(props.row._id)"
              :loading="loadingButtons[props.row._id]"
              unelevated
              round
              color="green-6"
              size="xs"
              ><q-icon 
              name="check" 
              /><q-tooltip> Activar a {{ props.row.nombre }} </q-tooltip>
            </q-btn>
            <q-btn
              v-else
              @click="toggleStatus(props.row._id)"
              :loading="loadingButtons[props.row._id]"
              unelevated
              round
              color="red"
              size="xs"
              ><q-icon
                name="close"
              /><q-tooltip> Desactivar a {{ props.row.nombre }} </q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <span style="color: green" v-if="props.row.estado == 1"
              ><strong>Activo</strong></span
            >
            <span style="color: red" v-else><strong>Inactivo</strong></span>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <input type="checkbox" name="select" id="" />
          </q-td>
        </template>
      </q-table>
    </div>

    <div>
      <q-dialog v-model="isDialogOpen" persistent>
        <q-card>
          <q-card-section class="bg-primary row items-center">
            <div class="text-h6 text-white" v-if="isCreating == false">
              Crear Usuario
            </div>
            <div class="text-h6 text-white" v-else>Editar Usuario</div>
            <q-space />
            <q-btn
              class="text-white"
              icon="close"
              flat
              round
              dense
              v-close-popup
              @click="onReset()"
            />
          </q-card-section>

          <q-card-section>
            <div class="q-pa-md" style="max-width: 400px">
              <q-form @submit="crear()" @reset="onReset()" class="q-gutter-md">
                <q-input
                  style="max-width: 250px; min-width: 200px"
                  v-model="name"
                  label="Nombre"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Por favor, dígite el nombre del usuario',
                  ]"
                />
                <q-input
                  style="max-width: 250px; min-width: 200px"
                  v-model="username"
                  label="Usuario"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Por favor, dígite el usuario único',
                  ]"
                />
                <q-input
                  style="max-width: 250px; min-width: 200px"
                  v-model="identification"
                  type="number"
                  label="Documento"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Por favor, dígite el documento del usuario',
                  ]"
                />
                <q-input
                  style="max-width: 250px; min-width: 200px"
                  v-model="email"
                  type="email"
                  label="Correo"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Por favor, dígite el correo del usuario',
                  ]"
                />
                <q-input
                  style="max-width: 250px; min-width: 200px"
                  v-model="phone"
                  type="tel"
                  label="Celular"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Por favor, dígite el celular del usuario ',
                  ]"
                />
                <q-input type="password" v-model="pass" />
                <div>
                  <q-btn
                    unelevated
                    rounded
                    :loading="useUsuario.loading"
                    label="Guardar"
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
import { onBeforeMount, ref, computed } from "vue";
import { useAuthStore } from "./../stores/useAuth.js";
import {
  notifyErrorRequest,
  notifySuccessRequest,
} from "./../composables/notify.js";
import { getData, postData, putData } from "./../services/APIClient.js";

const authStore = useAuthStore();
let email = ref("");
let name = ref("");
let username = ref("");
let identification = ref("");
let phone = ref("");
let pass = ref("");
let isDialogOpen = ref(false);
let isCreating = ref(); // false: modificar, true: crear
let inpSearch = ref();
let loadingButtons = ref(false);
let loading = ref(false);
let idUserToEdit = ref()
let rows = ref([]);
let columns = ref([
  {
    name: "actions",
    label: "Seleccionar",
    align: "center",
    field: "select",
  },
  {
    name: "usr_identification",
    label: "Identificación",
    align: "center",
    field: "USR_IDENTIFICATION",
  },
  {
    name: "usr_name",
    label: "Nombre",
    align: "center",
    field: "USR_NAME",
    sortable: true,
  },
  {
    name: "usr_username",
    label: "Usuario",
    align: "center",
    field: "USR_USERNAME",
  },
  {
    name: "usr_email",
    align: "center",
    label: "Correo electrónico",
    field: "USR_EMAIL",
  },
  {
    name: "usr_phone",
    align: "center",
    label: "Teléfono",
    field: "USR_PHONE",
  },
  {
    name: "usr_status",
    align: "center",
    label: "Estado",
    field: "USR_STATE_USER",
    sortable: true,
  },
  {
    name: "options",
    align: "center",
    label: "Opciones",
  },
]);

onBeforeMount(() => {
  getUsers();
});

const filteredRows = computed(() => {
  if (!inpSearch.value) return rows.value;

  const filter = inpSearch.value.toLowerCase();
  return rows.value.filter((user) =>
    user.USR_NAME?.toLowerCase().includes(filter)
  );
});

async function getUsers() {
  try {
    let data = await getData("/listAllUsers");
    console.log(data);
    rows.value = data;
  } catch (error) {
    console.log(error);
    notifyErrorRequest("Error al traer datos");
  }
}

async function toggleStatus(id) {
  try {
    let userIsActive = await getData(`/listUserById/${id}`);
    let url = userIsActive.USR_STATE_USER == 1 ? `/deactive/${id}` : `/active/${id}`;

    let data = await putData(url, {})
  } catch (error) {
    notifyErrorRequest(error?.response?.data?.errors?.[0]?.msg || "Error desconocido")
  }
}

function bringId(id) {
  idUserToEdit.value = id
}

async function crear() {
  try {
    let data;
    let userData = {
      USR_IDENTIFICATION: identification.value.trim(),
      USR_NAME: name.value.trim(),
      USR_USERNAME: username.value.trim(),
      USR_PASSWORD: pass.value.trim(),
      USR_EMAIL: email.value.trim(),
      USR_PHONE: phone.value.trim(),
      USR_ACTION: authStore.getID(),
    }
    if(isCreating.value){
      data = await postData("/create", userData)
      notifySuccessRequest("Usuario creado exitosamente")
    } else {
      data = await putData(`/update/${idUserToEdit.value}`, userData)
      notifySuccessRequest("Usuario actualizado exitosamente")
    }
    getUsers();
    onReset();
    isDialogOpen.value = false
  } catch (error) {
    notifyErrorRequest(error?.response?.data?.errors?.[0]?.msg || "Error desconocido")
    console.log(error);
    
  }
}

function onReset() {
  name.value = "";
  email.value = "";
  identification.value = "";
  phone.value = "";
  pass.value = "";
  idUserToEdit.value = "";
}
</script>