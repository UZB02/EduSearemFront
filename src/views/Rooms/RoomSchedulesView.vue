<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <HeaderSection 
      :filter-type="filterType" 
      @update-filter="filterType = $event"
      @open-dialog="openDialog"
    />

    <TimelineTable 
      :rooms="rooms" 
      :days="filteredDays" 
      :schedules="schedules"
    />

    <AssignGroupDialog 
      v-model:visible="dialogVisible" 
      :rooms="rooms" 
      :groups="groups" 
      :form="form" 
      :saving="saving"
      @save="saveSchedule" 
      @close="closeDialog"
    />
  </div>
 <Toast />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Toast from 'primevue/toast'
import { useToast } from "primevue/usetoast";
import api from "../../utils/api.js";

import HeaderSection from "../../components/Rooms/HeaderSection.vue";
import TimelineTable from "../../components/Rooms/TimelineTable.vue";
import AssignGroupDialog from "../../components/Rooms/AssignGroupDialog.vue";

const toast = useToast();
const admin = JSON.parse(sessionStorage.getItem("admin"));

const rooms = ref([]);
const groups = ref([]);
const schedules = ref([]);
const filterType = ref("all");
const dialogVisible = ref(false);
const saving = ref(false);

const form = ref({ roomId: null, groupId: null, userId: admin.id });

const days = [
  { label: "Dushanba", value: "Monday" },
  { label: "Seshanba", value: "Tuesday" },
  { label: "Chorshanba", value: "Wednesday" },
  { label: "Payshanba", value: "Thursday" },
  { label: "Juma", value: "Friday" },
  { label: "Shanba", value: "Saturday" },
  { label: "Yakshanba", value: "Sunday" },
];

const filteredDays = computed(() => {
  if (filterType.value === "all") return days;
  if (filterType.value === "odd") return days.filter((_, i) => i % 2 === 0);
  if (filterType.value === "even") return days.filter((_, i) => i % 2 !== 0);
  return days;
});

// API fetch
const fetchRoomsAndSchedules = async () => {
  try {
    const [roomsRes, schedulesRes] = await Promise.all([
      api.get("/rooms", { params: { adminId: admin.id } }),
      api.get("/room-schedules", { params: { userId: admin.id } }),
    ]);
    rooms.value = roomsRes.data;
    schedules.value = schedulesRes.data;
    console.log(rooms.value);
    console.log(schedules.value,555);
  } catch (err) {
    toast.add({ severity: "error", summary: "Xatolik", detail: "Ma'lumotlarni yuklashda xatolik", life: 3000 });
  }
};

const fetchGroups = async () => {
  try {
    const res = await api.get("/groups", { params: { adminId: admin.id } });
    groups.value = res.data;
    console.log(groups.value);
  } catch (err) {
    console.error(err);
  }
};

// Dialog functions
const openDialog = () => {
  form.value = { roomId: null, groupId: null, userId: admin.id };
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
  saving.value = false;
};

// Save schedule
const saveSchedule = async () => {
  if (!form.value.roomId || !form.value.groupId) {
    toast.add({ severity: "warn", summary: "Diqqat", detail: "Xona va guruh tanlanishi shart", life: 3000 });
    return;
  }

  saving.value = true;

  try {
    await api.post("/room-schedules/assign", form.value);
    toast.add({ severity: "success", summary: "Muvaffaqiyat", detail: "Jadval muvaffaqiyatli saqlandi", life: 3000 });
    closeDialog();
    fetchRoomsAndSchedules();
  } catch (err) {
    toast.add({ severity: "error", summary: "Xatolik", detail: err.response?.data?.message || "Jadval saqlashda xatolik yuz berdi", life: 4000 });
    console.log(err);
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchRoomsAndSchedules();
  fetchGroups();
});
</script>
