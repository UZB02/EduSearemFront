<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Xonalar boshqaruvi</h1>

    <!-- Add Room Button -->
    <Button label="Yangi xona qo‘shish" icon="pi pi-plus" class="mb-4" @click="openDialog()" />
    <Button label="Xonalar jadvali" icon="pi pi-calendar" class="mb-4 ml-2" @click="router.push('/rooms/roomschedules')" />

    <!-- Rooms Table -->
    <DataTable :value="rooms" class="shadow-lg rounded-xl overflow-hidden">
      <Column field="name" header="Xona nomi"></Column>
      <Column field="capacity" header="Sig‘imi"></Column>
      <Column field="description" header="Izoh"></Column>
      <Column header="Amallar" bodyClass="text-center">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning mr-2" @click="editRoom(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteRoom(slotProps.data._id)" />
        </template>
      </Column>
    </DataTable>

    <!-- Add/Edit Dialog -->
    <Dialog v-model:visible="dialogVisible" header="Xona ma’lumotlari" :modal="true" :style="{ width: '400px' }">
      <div class="flex flex-col gap-4">
        <InputText v-model="form.name" placeholder="Xona nomi" />
        <InputNumber v-model="form.capacity" placeholder="Sig‘imi" :min="1" />
        <Textarea v-model="form.description" placeholder="Izoh" rows="3" />
      </div>
      <template #footer>
        <Button label="Bekor qilish" class="p-button-text" @click="dialogVisible = false" />
        <Button label="Saqlash" icon="pi pi-check" @click="saveRoom" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import { useRouter } from 'vue-router'
import api from "../../utils/api.js"

const admin = JSON.parse(sessionStorage.getItem('admin')) 

const router = useRouter()

const rooms = ref([]);
const dialogVisible = ref(false);
const form = ref({ name: "", capacity: 0, description: "", userId: admin.id });

// 🔹 AdminId bilan xonalarni olish
const fetchRooms = async () => {
  try {
    const res = await api.get(`/rooms?adminId=${admin.id}`);
    rooms.value = res.data;
  } catch (err) {
    console.error("Xonalarni olishda xato:", err);
  }
};

const openDialog = () => {
  form.value = { name: "", capacity: 0, description: "", userId: admin.id };
  dialogVisible.value = true;
};

const editRoom = (room) => {
  form.value = { ...room, userId: admin.id }; // userId qo‘shib yuboramiz
  dialogVisible.value = true;
};

const saveRoom = async () => {
  try {
    if (form.value._id) {
      await api.put(`/rooms/${form.value._id}`, form.value);
    } else {
      await api.post("/rooms", form.value);
    }
    dialogVisible.value = false;
    fetchRooms();
  } catch (err) {
    console.error("Xona saqlashda xato:", err);
  }
};

const deleteRoom = async (id) => {
  if (confirm("Xonani o‘chirmoqchimisiz?")) {
    try {
      await api.delete(`/rooms/${id}`);
      fetchRooms();
    } catch (err) {
      console.error("Xona o‘chirishda xato:", err);
    }
  }
};

onMounted(fetchRooms);
</script>
