<template>
  <div class="todo">
    <div class="q-mx-xl q-pt-lg">
      <q-table
        :rows="filteredRows"
        :columns="columns"
        row-key="name"
        :loading="loadingTable"
        separator="vertical"
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
                @click="(isDialogOpen = true), (isCreating = true)"
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
                  (isCreating = false),
                  bringId(props.row._id)
              "
              unelevated
              round
              ><q-icon name="edit_note" size="md" />
              <q-tooltip> Editar a {{ props.row.USR_NAME }} </q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.USR_STATE_USER == 0"
              :loading="loadingStatus[props.row._id]"
              @click="toggleStatus(props.row._id)"
              unelevated
              round
              color="positive"
              size="sm"
              ><q-icon name="check" size="sm" /><q-tooltip>
                Activar a {{ props.row.USR_NAME }}
              </q-tooltip>
            </q-btn>
            <q-btn
              v-else
              :loading="loadingStatus[props.row._id]"
              @click="toggleStatus(props.row._id)"
              unelevated
              round
              color="negative"
              size="sm"
              ><q-icon name="close" size="sm" /><q-tooltip>
                Desactivar a {{ props.row.USR_NAME }}
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-usr_status="props">
          <q-td :props="props">
            <span style="color: green" v-if="props.row.USR_STATE_USER == 1"
              ><strong>Activo</strong></span
            >
            <span style="color: red" v-else><strong>Inactivo</strong></span>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-checkbox v-model="selectedUsersSet" :val="props.row._id" :disable="selectionMode === 'active' && props.row.USR_STATE_USER === 0 ||
                selectionMode === 'inactive' && props.row.USR_STATE_USER === 1"/>
          </q-td>
        </template>
      </q-table>
    </div>

    <div>
      <q-dialog v-model="isDialogOpen" persistent>
        <q-card>
          <q-card-section class="bg-primary row items-center">
            <div class="text-h6 text-white" v-if="isCreating == true">
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
              <q-form
                @submit="saveUser()"
                @reset="onReset()"
                class="q-gutter-md"
              >
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
                <q-input
                  v-model="pass"
                  @paste.prevent
                  v-if="isCreating == true"
                  :type="isPwd ? 'password' : 'text'"
                  label="Contraseña"
                  style="max-width: 250px; min-width: 200px"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Por favor, dígite la contraseña del usuario',
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
                <div>
                  <q-btn
                    unelevated
                    rounded
                    :loading="loadingButton"
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
    <q-page-sticky position="bottom" :offset="[18, 18]">
      <div class="q-gutter-sm">
        <q-btn
          round
          icon="group_add"
          color="positive"
          unelevated
          v-show="selectedUsers.size != 0 && selectionMode === 'inactive'"
          @click="bulkToggleUsers('activate')"
        >
          <q-tooltip  anchor="top middle" self="bottom middle" :offset="[10, 10]">Activar</q-tooltip>
        </q-btn>
        <q-btn
          round
          icon="group_off"
          color="negative"
          unelevated
          v-show="selectedUsers.size != 0 && selectionMode === 'active'"
          @click="bulkToggleUsers('deactivate')"
        >
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Desctivar</q-tooltip>
        </q-btn>
      </div>
    </q-page-sticky>
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
const selectedUsers = ref(new Set());
let email = ref("");
let name = ref("");
let username = ref("");
let identification = ref("");
let phone = ref("");
let pass = ref("");
let isDialogOpen = ref(false);
let isCreating = ref(); // false: modificar, true: crear
let inpSearch = ref();
let isPwd = ref(true);
let loadingButton = ref(false);
let loadingStatus = ref({});
let loadingTable = ref(false);
let idUserToEdit = ref();
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

const selectionMode = computed(() => {
  const selected = Array.from(selectedUsers.value);
  const selectedStates = selected.map(id => {
    const user = rows.value.find(u => u._id === id);
    return user ? user.USR_STATE_USER : null;
  });

  const hasActive = selectedStates.includes(1);
  const hasInactive = selectedStates.includes(0);

  if (hasActive && !hasInactive) return 'active';
  if (!hasActive && hasInactive) return 'inactive';
  return null; // mezcla o ninguno
});

const selectedUsersSet = computed({
  get: () => Array.from(selectedUsers.value),
  set: (val) => (selectedUsers.value = new Set(val)),
});

async function bulkToggleUsers(action) {
  const actionUrl = action === "activate" ? "/active" : "/deactive";
  try {
    loadingTable.value = true;
    for (const id of selectedUsers.value) {
      await putData(`${actionUrl}/${id}`, {});
    }
    selectedUsers.value.clear();
    notifySuccessRequest(
      `Usuarios ${
        action === "activate" ? "activados" : "desactivados"
      } correctamente.`
    );
    await getUsers();
  } catch (error) {
    notifyErrorRequest("Error al aplicar cambios masivos.");
    console.error(error);
  } finally {
    loadingTable.value = false;
  }
}

const filteredRows = computed(() => {
  if (!inpSearch.value) return rows.value;

  const filter = inpSearch.value.toLowerCase();
  return rows.value.filter(
    (user) =>
      user.USR_NAME?.toLowerCase().includes(filter) ||
      user.USR_EMAIL?.toLowerCase().includes(filter) ||
      user.USR_USERNAME?.toLowerCase().includes(filter) ||
      user.USR_IDENTIFICATION?.toString().includes(filter) ||
      user.USR_PHONE?.toString().includes(filter)
  );
});

async function getUsers() {
  loadingTable.value = true;
  try {
    let data = await getData("/listAllUsers");
    console.log(data);
    rows.value = data.users;
  } catch (error) {
    console.log(error);
    notifyErrorRequest("Error al traer datos");
  } finally {
    loadingTable.value = false;
  }
}

async function toggleStatus(id) {
  loadingStatus.value[id] = true;
  try {
    let userIsActive = await getData(`/listUserById/${id}`);
    let url =
      userIsActive.user.USR_STATE_USER == 1
        ? `/deactive/${id}`
        : `/active/${id}`;

    let data = await putData(url, {});
    getUsers();
  } catch (error) {
    notifyErrorRequest(
      error?.response?.data?.errors?.[0]?.msg || "Error desconocido"
    );
  } finally {
    loadingStatus.value[id] = false;
  }
}

async function bringId(id) {
  idUserToEdit.value = id;
  try {
    let data = await getData(`/listUserById/${id}`);

    identification.value = data.user.USR_IDENTIFICATION;
    name.value = data.user.USR_NAME;
    username.value = data.user.USR_USERNAME;
    email.value = data.user.USR_EMAIL;
    phone.value = data.user.USR_PHONE;
  } catch (error) {
    console.log(error);
  }
}

async function saveUser() {
  loadingButton.value = true;
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
    };
    if (isCreating.value) {
      data = await postData("/create", userData);
      notifySuccessRequest("Usuario creado exitosamente");
    } else {
      data = await putData(`/update/${idUserToEdit.value}`, userData);
      notifySuccessRequest("Usuario actualizado exitosamente");
    }
    getUsers();
    onReset();
    isDialogOpen.value = false;
  } catch (error) {
    notifyErrorRequest(
      error?.response?.data?.errors?.[0]?.msg || "Error desconocido"
    );
    console.log(error);
  } finally {
    loadingButton.value = false;
  }
}

function onReset() {
  name.value = "";
  username.value = "";
  email.value = "";
  identification.value = "";
  phone.value = "";
  pass.value = "";
  idUserToEdit.value = "";
}
</script>