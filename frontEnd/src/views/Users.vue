<template>
  <div>
    <div>
      <q-table
        :rows="filteredRows"
        :columns="columns"
        row-key="_id"
        :loading="loadingTable"
        separator="vertical"
        :visible-columns="[
          'usr_username',
          'options',
          'actions',
          ...visibleColumns,
        ]"
        dense
        color="primary"
        class="my-sticky-header-table my-sticky-column-table"
        :pagination="pagination"
        virtual-scroll
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>

        <template v-slot:top>
          <div
            class="row items-center justify-between full-width"
            align="center"
          >
            <div class="text-h4 text-bold">Users</div>
            <div class="row items-center justify-center q-gutter-md">
              <q-input
                v-model="inpSearch"
                label="Search"
                dense
                style="min-width: 150px"
                clearable
              />

              <q-select
                v-model="visibleColumns"
                multiple
                dense
                :display-value="$q.lang.table.columns"
                emit-value
                map-options
                :options="columns"
                option-value="name"
                options-cover
                style="min-width: 150px"
                label="Columns selected"
              >
                <template v-slot:option="scope">
                  <q-item
                    v-bind="scope.itemProps"
                    :class="[
                      {
                        'text-white bg-primary': scope.selected,
                        'text-black': !scope.selected,
                      },
                      scope.opt.disableSelect ? 'no-disable-style' : '',
                    ]"
                  >
                    <q-item-section>
                      {{ scope.opt.label }}
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-btn
                unelevated
                round
                dense
                icon="add"
                color="primary"
                @click="(isDialogOpen = true), (isCreating = true)"
              >
                <q-tooltip> Create user </q-tooltip>
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
              size="sm"
              ><q-icon name="edit" size="sm" />
              <q-tooltip> Update {{ props.row.USR_NAME }} </q-tooltip>
            </q-btn>
            <q-btn
              v-show="[2, 3, 4, 5].includes(props.row.USR_STATE_USER)"
              :loading="loadingStatus[props.row._id]"
              @click="toggleStatus(props.row._id, 1)"
              unelevated
              round
              color="positive"
              size="sm"
              ><q-icon name="check" size="sm" /><q-tooltip>
                Activate {{ props.row.USR_NAME }}
              </q-tooltip>
            </q-btn>
            <q-btn
              v-show="props.row.USR_STATE_USER == 1"
              :loading="loadingStatus[props.row._id]"
              @click="toggleStatus(props.row._id, 2)"
              unelevated
              round
              color="negative"
              size="sm"
              ><q-icon name="close" size="sm" /><q-tooltip>
                Deactivate {{ props.row.USR_NAME }}
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-usr_status="props">
          <q-td :props="props">
            <span v-show="props.row.USR_STATE_USER == 1">Active</span>
            <span v-show="props.row.USR_STATE_USER == 2">Inactive</span>
            <span v-show="props.row.USR_STATE_USER == 3">Account blocked</span>
            <span v-show="props.row.USR_STATE_USER == 4">Password expired</span>
            <span v-show="props.row.USR_STATE_USER == 5">Account disabled</span>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-checkbox
              v-model="selectedUsersSet"
              :val="props.row._id"
              :disable="
                (selectionMode === 'active' &&
                  [2, 3, 4, 5].includes(props.row.USR_STATE_USER)) ||
                (selectionMode === 'inactive' && props.row.USR_STATE_USER === 1)
              "
            />
          </q-td>
        </template>
      </q-table>
    </div>
    <div>
      <q-dialog v-model="isDialogOpen" persistent>
        <q-card>
          <q-card-section class="bg-primary row items-center">
            <div class="text-h6 text-white" v-if="isCreating == true">
              Create user
            </div>
            <div class="text-h6 text-white" v-else>Update user</div>
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
            <div class="q-pa-md">
              <q-form @submit="saveUser()" @reset="onReset()">
                <div class="formGrid q-gutter-md q-mb-md">
                  <q-input
                    style="max-width: 250px; min-width: 200px"
                    v-model="identification"
                    type="number"
                    label="Identification"
                    placeholder="123456"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) ||
                        'Please, type your identification number',
                    ]"
                  />
                  <q-input
                    style="max-width: 250px; min-width: 200px"
                    v-model="name"
                    label="Name"
                    placeholder="Pepito Pérez Pinto"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Please, type your name',
                    ]"
                  />
                  <q-input
                    style="max-width: 250px; min-width: 200px"
                    v-model="username"
                    label="Username"
                    placeholder="123456"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Please, type your username',
                    ]"
                  />
                  <q-input
                    style="max-width: 250px; min-width: 200px"
                    v-model="email"
                    type="email"
                    label="Email"
                    placeholder="example@claro.com.co"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Please, type your email',
                    ]"
                  />
                  <q-input
                    style="max-width: 250px; min-width: 200px"
                    v-model="phone"
                    type="tel"
                    label="Phone"
                    placeholder="123456"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Please, type your phone',
                    ]"
                  />
                  <!-- <q-input
                    v-model="pass"
                    @paste.prevent
                    v-if="isCreating == true"
                    :type="isPwd ? 'password' : 'text'"
                    label="Password"
                    style="max-width: 250px; min-width: 200px"
                    lazy-rules
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
                  </q-input> -->
                  <q-select
                    v-model="state_usr"
                    v-if="isCreating != true"
                    :options="optionsStatus"
                    label="User status"
                    emit-value
                    map-options
                  />
                  <q-select
                    v-model="state_pass"
                    v-if="isCreating != true"
                    :options="optionsStatus"
                    label="Password status"
                    emit-value
                    map-options
                  />
                </div>
                <div>
                  <q-btn
                    unelevated
                    rounded
                    no-caps
                    :loading="loadingButton"
                    label="Save"
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
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]"
            >Activate all</q-tooltip
          >
        </q-btn>
        <q-btn
          round
          icon="group_off"
          color="negative"
          unelevated
          v-show="selectedUsers.size != 0 && selectionMode === 'active'"
          @click="bulkToggleUsers('deactivate')"
        >
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]"
            >Deactivate all</q-tooltip
          ></q-btn
        >
        <q-btn
          round
          icon="cancel"
          color="grey-7"
          unelevated
          v-show="selectedUsers.size != 0"
          @click="clearSelection()"
        >
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]"
            >Cancel</q-tooltip
          >
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
import { formatDate } from "../utils/formatDate.js";

const authStore = useAuthStore();
const selectedUsers = ref(new Set());
let email = ref("");
let name = ref("");
let username = ref("");
let identification = ref("");
let phone = ref("");
let pass = ref("");
let state_usr = ref("");
let state_pass = ref("");
let isDialogOpen = ref(false);
let isCreating = ref(); // false: modificar, true: crear
let inpSearch = ref();
let isPwd = ref(true);
let loadingButton = ref(false);
let loadingStatus = ref({});
let pagination = ref({ rowsPerPage: 0 });
let loadingTable = ref(false);
let idUserToEdit = ref();
let rows = ref([]);
let columns = ref([
  {
    name: "actions",
    label: "Select",
    align: "center",
    field: "select",
    disableSelect: true,
  },
  {
    name: "usr_identification",
    label: "Identification",
    align: "center",
    field: "USR_IDENTIFICATION",
  },
  {
    name: "usr_name",
    label: "Name",
    align: "center",
    field: "USR_NAME",
    sortable: true,
  },
  {
    name: "usr_username",
    label: "Username",
    align: "center",
    field: "USR_USERNAME",
    disableSelect: true,
  },
  {
    name: "usr_email",
    align: "center",
    label: "Email",
    field: "USR_EMAIL",
  },
  {
    name: "usr_phone",
    align: "center",
    label: "Phone",
    field: "USR_PHONE",
  },
  {
    name: "usr_created_at",
    align: "center",
    label: "Created at",
    field: "USR_CREATED_AT",
  },
  {
    name: "usr_updated_at",
    align: "center",
    label: "Updated at",
    field: "USR_UPDATED_AT",
  },
  {
    name: "usr_last_login",
    align: "center",
    label: "Last log in",
    field: "USR_LAST_LOGIN",
  },
  {
    name: "usr_created_by_user",
    align: "center",
    label: "Created by user",
    field: "USR_CREATED_BY_USER",
  },
  {
    name: "usr_updated_by_user",
    align: "center",
    label: "Updated by user",
    field: "USR_UPDATED_BY_USER",
  },
  {
    name: "usr_created_by_pass",
    align: "center",
    label: "Created by password",
    field: "USR_CREATED_BY_PASS",
  },
  {
    name: "usr_updated_by_pass",
    align: "center",
    label: "Updated by password",
    field: "USR_UPDATED_BY_PASS",
  },
  {
    name: "usr_pass_created_at",
    align: "center",
    label: "Created password at",
    field: "USR_PASS_CREATED_AT",
  },
  {
    name: "usr_pass_updated_at",
    align: "center",
    label: "Updated password at",
    field: "USR_PASS_UPDATED_AT",
  },
  {
    name: "usr_status",
    align: "center",
    label: "User status",
    field: "USR_STATE_USER",
  },
  {
    name: "options",
    align: "center",
    label: "Options",
    disableSelect: true,
  },
]);
let visibleColumns = ref(columns.value.map((col) => col.name));
let optionsStatus = ref([
  {
    label: "Active",
    value: 1,
  },
  {
    label: "Inactive",
    value: 2,
  },
  {
    label: "Account blocked",
    value: 3,
  },
  {
    label: "Password expired",
    value: 4,
  },
  {
    label: "Account disabled",
    value: 5,
  },
]);

onBeforeMount(() => {
  getUsers();
});

const selectionMode = computed(() => {
  const selected = Array.from(selectedUsers.value);
  const selectedStates = selected.map((id) => {
    const user = rows.value.find((u) => u._id === id);
    return user ? user.USR_STATE_USER : null;
  });

  const hasActive = selectedStates.includes(1);
  const hasInactive = selectedStates.some((s) => [2, 3, 4, 5].includes(s));

  if (hasActive && !hasInactive) return "active";
  if (!hasActive && hasInactive) return "inactive";
  return null;
});

const selectedUsersSet = computed({
  get: () => Array.from(selectedUsers.value),
  set: (val) => (selectedUsers.value = new Set(val)),
});

async function bulkToggleUsers(action) {
  const actionValue = action === "activate" ? 1 : 2;
  try {
    console.log(actionValue);
    loadingTable.value = true;
    for (const id of selectedUsers.value) {
      await putData(`/changeStatus/${id}`, { status: actionValue });
    }
    clearSelection();
    notifySuccessRequest(
      `Users successfully ${
        action === "activate" ? "activated" : "deactivated"
      }`
    );
    await getUsers();
  } catch (error) {
    notifyErrorRequest("Error al aplicar cambios masivos.");
    console.error(error);
  } finally {
    loadingTable.value = false;
  }
}

function clearSelection() {
  selectedUsers.value.clear();
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
      user.USR_PHONE?.toString().includes(filter) ||
      user.USR_LAST_LOGIN?.toString().includes(filter) ||
      user.USR_CREATED_BY_USER?.toString().includes(filter) ||
      user.USR_UPDATED_BY_USER?.toString().includes(filter) ||
      user.USR_CREATED_AT?.toString().includes(filter) ||
      user.USR_UPDATED_AT?.toString().includes(filter) ||
      user.USR_CREATED_BY_PASS?.toString().includes(filter) ||
      user.USR_UPDATED_BY_PASS?.toString().includes(filter) ||
      user.USR_PASS_CREATED_AT?.toString().includes(filter) ||
      user.USR_PASS_UPDATED_AT?.toString().includes(filter)
  );
});

async function getUsers() {
  loadingTable.value = true;
  try {
    let data = await getData("/listAllUsers");
    console.log(data);
    rows.value = await Promise.all(
      data.users.map(async (user) => {
        return {
          ...user,
          USR_LAST_LOGIN: formatDate(user.USR_LAST_LOGIN),
          USR_CREATED_AT: formatDate(user.USR_CREATED_AT),
          USR_UPDATED_AT: formatDate(user.USR_UPDATED_AT),
          USR_PASS_CREATED_AT: formatDate(user.USR_PASS_CREATED_AT),
          USR_PASS_UPDATED_AT: formatDate(user.USR_PASS_UPDATED_AT),
          USR_CREATED_BY_USER: await usernameById(user.USR_CREATED_BY_USER),
          USR_UPDATED_BY_USER: await usernameById(user.USR_UPDATED_BY_USER),
          USR_CREATED_BY_PASS: await usernameById(user.USR_CREATED_BY_PASS),
          USR_UPDATED_BY_PASS: await usernameById(user.USR_UPDATED_BY_PASS),
        };
      })
    );
  } catch (error) {
    console.log(error);
    notifyErrorRequest("Error when fetching data");
  } finally {
    loadingTable.value = false;
  }
}

async function usernameById(id) {
  try {
    let data = await getData(`/listUserById/${id}`);
    return data.user.USR_USERNAME;
  } catch (error) {
    console.log(error);
  }
}

async function toggleStatus(id, status) {
  try {
    let data = await putData(`/changeStatus/${id}`, { status });
    getUsers();
  } catch (error) {
    notifyErrorRequest(
      error?.response?.data?.errors?.[0]?.msg || "Unknown error"
    );
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
    state_usr.value = data.user.USR_STATE_USER;
    state_pass.value = data.user.USR_STATE_PASS;
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
      USR_UPDATED_BY_USER: authStore.getID(),
      USR_CREATED_BY_USER: authStore.getID(),
      status: state_usr.value,
      status_pass: state_pass.value,
    };
    if (isCreating.value) {
      data = await postData("/create", userData);
      notifySuccessRequest("User created successfully");
    } else {
      data = await putData(`/update/${idUserToEdit.value}`, userData);
      notifySuccessRequest("User updated successfully");
    }
    getUsers();
    onReset();
    isDialogOpen.value = false;
  } catch (error) {
    notifyErrorRequest(
      error?.response?.data?.errors?.[0]?.msg || "Unknown error"
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
<style scoped>
.formGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

td {
  padding: 0px !important;
}

.q-td {
  padding: 2px 4px !important;
  font-size: 12px;
}

.q-table thead th {
  padding: 0px 0px !important;
  font-size: 13px;
}

.no-disable-style {
  opacity: 1 !important;
  color: white !important;
  background-color: #ee2323 !important;
  pointer-events: none;
}

@media screen and (max-width: 534px) and (min-width: 300px) {
  .formGrid {
    display: block;
    color: rgb(165, 165, 165);
  }
}
@media screen and (max-width: 425px) and (min-width: 320px) {
  .my-sticky-header-table {
    height: 79.5vh;
  }
}
</style>

<style lang="sass">
.my-sticky-header-table
  height: 88vh

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    background-color: white

  thead tr th
    position: sticky
    z-index: 1

  &.q-table--loading thead tr:last-child th
    top: 48px

  tbody
    scroll-margin-top: 48px

.my-sticky-column-table
  width: auto

  thead tr:last-child   th:last-child
    background-color: white

  thead tr:last-child   th:first-child
    background-color: white

  td:last-child, td:first-child
    background-color: white

  th:last-child ,
  td:last-child
    position: sticky
    right: 0
    z-index: 1

  td:first-child
    position: sticky
    left: 0
    z-index: 1

  th:first-child
    position: sticky
    left: 0
    z-index: 2
</style>