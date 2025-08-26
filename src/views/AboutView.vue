<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header with tabs -->
    <div class="bg-white rounded-lg shadow-sm mb-6">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Schedule Grid -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <!-- Time header -->
      <div class="grid grid-cols-[120px_repeat(16,1fr)] border-b border-gray-200 bg-gray-50">
        <div class="p-3 font-medium text-gray-700 border-r border-gray-200">
          Xonalar / Soat
        </div>
        <div
          v-for="time in timeSlots"
          :key="time"
          class="p-2 text-center text-xs font-medium text-gray-600 border-r border-gray-200 last:border-r-0"
        >
          {{ time }}
        </div>
      </div>

      <!-- Room rows -->
      <div class="relative">
        <div
          v-for="(room, roomIndex) in rooms"
          :key="room._id"
          class="grid grid-cols-[120px_repeat(16,1fr)] border-b border-gray-200 last:border-b-0 relative"
          style="height: 60px;"
        >
          <!-- Room name -->
          <div class="p-3 font-medium text-gray-700 border-r border-gray-200 bg-gray-50 flex items-center">
            {{ room.name }}
          </div>
          
          <!-- Time slots grid -->
          <div
            v-for="(time, timeIndex) in timeSlots"
            :key="`${room._id}-${time}`"
            class="border-r border-gray-200 last:border-r-0 relative"
          ></div>

          <!-- Scheduled classes overlay -->
          <div
            v-for="schedule in getSchedulesForRoom(room._id)"
            :key="schedule._id"
            :class="[
              'absolute top-1 bottom-1 rounded-md flex items-center justify-center text-white text-xs font-medium cursor-pointer transition-all hover:shadow-md',
              getScheduleColor(schedule.type)
            ]"
            :style="getSchedulePosition(schedule)"
            @click="editSchedule(schedule)"
            :title="`${schedule.subject} - ${schedule.teacher} (${schedule.startTime} - ${schedule.endTime})`"
          >
            <div class="text-center px-2">
              <div class="font-semibold">{{ schedule.startTime }} - {{ schedule.endTime }}</div>
              <div class="text-xs opacity-90">{{ schedule.subject }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Schedule Button -->
    <div class="mt-6 flex justify-end">
      <Button
        label="Yangi dars qo'shish"
        icon="pi pi-plus"
        class="p-button-success"
        @click="openDialog"
      />
    </div>

    <!-- Add/Edit Schedule Dialog -->
    <Dialog
      v-model:visible="showAddDialog"
      header="Dars jadvali qo'shish"
      modal
      class="w-96"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Xona</label>
          <Dropdown
            v-model="scheduleForm.roomId"
            :options="rooms"
            optionLabel="name"
            optionValue="_id"
            placeholder="Xona tanlang"
            class="w-full"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fan</label>
          <InputText
            v-model="scheduleForm.subject"
            placeholder="Fan nomi"
            class="w-full"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">O'qituvchi</label>
          <InputText
            v-model="scheduleForm.teacher"
            placeholder="O'qituvchi ismi"
            class="w-full"
          />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Boshlanish vaqti</label>
            <InputText
              v-model="scheduleForm.startTime"
              placeholder="08:00"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tugash vaqti</label>
            <InputText
              v-model="scheduleForm.endTime"
              placeholder="10:00"
              class="w-full"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Turi</label>
          <Dropdown
            v-model="scheduleForm.type"
            :options="scheduleTypes"
            optionLabel="label"
            optionValue="value"
            placeholder="Dars turini tanlang"
            class="w-full"
          />
        </div>
      </div>
      
      <template #footer>
        <Button
          label="Bekor qilish"
          text
          @click="showAddDialog = false"
        />
        <Button
          label="Saqlash"
          @click="saveSchedule"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import api from "../utils/api.js";

const toast = useToast();
const admin = JSON.parse(sessionStorage.getItem("admin"));

// Reactive state
const schedules = ref([]);
const rooms = ref([]);
const groups = ref([]);
const showAddDialog = ref(false);
const scheduleTypes = [
  { label: "Lecture", value: "lecture" },
  { label: "Seminar", value: "seminar" },
  { label: "Practice", value: "practice" },
  { label: "Language", value: "language" },
];

// Form for adding/editing schedule
const scheduleForm = ref({
  roomId: null,
  subject: "",
  teacher: "",
  startTime: "",
  endTime: "",
  type: "lecture",
});

// Tabs (even/odd/other)
const tabs = [
  { key: "even", label: "JUFT KUNLAR" },
  { key: "odd", label: "TOQ KUNLAR" },
  { key: "other", label: "BOSHQA" },
];
const activeTab = ref("even");

// Time slots for timeline (06:00 - 14:30)
const timeSlots = [
  "06:00","06:30","07:00","07:30","08:00","08:30",
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30"
];

// Fetch rooms and groups
const fetchRoomsAndGroups = async () => {
  try {
    const [roomsRes, groupsRes] = await Promise.all([
      api.get("/rooms", { params: { adminId: admin.id } }),
      api.get("/groups", { params: { adminId: admin.id } }),
    ]);
    rooms.value = roomsRes.data;
    groups.value = groupsRes.data;
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Xona yoki guruhlarni olishda xato",
      detail: err.response?.data?.message || err.message,
      life: 3000,
    });
  }
};

// Fetch schedules
const fetchSchedules = async () => {
  try {
    const res = await api.get("/room-schedules", { params: { userId: admin.id } });
    schedules.value = res.data;
    console.log(res.data);
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Jadvallarni olishda xato",
      detail: err.response?.data?.message || err.message,
      life: 3000,
    });
  }
};

// Compute position of schedule block in timeline
const getSchedulePosition = (schedule) => {
  const [startHour, startMin] = schedule.startTime.split(":").map(Number);
  const [endHour, endMin] = schedule.endTime.split(":").map(Number);

  const totalStart = startHour + startMin/60;
  const totalEnd = endHour + endMin/60;

  const leftPercent = ((totalStart - 6) / 8.5) * 100;
  const widthPercent = ((totalEnd - totalStart) / 8.5) * 100;

  return { left: `${leftPercent}%`, width: `${widthPercent}%` };
};

// Get schedules for a specific room
const getSchedulesForRoom = (roomId) => {
  return schedules.value.filter(s => s.roomId?._id === roomId);
};

// Schedule colors
const getScheduleColor = (type) => {
  const colors = {
    lecture: "bg-blue-500 hover:bg-blue-600",
    seminar: "bg-red-500 hover:bg-red-600",
    practice: "bg-gray-500 hover:bg-gray-600",
    language: "bg-green-500 hover:bg-green-600",
  };
  return colors[type] || "bg-blue-500 hover:bg-blue-600";
};

// Open add schedule dialog
const openDialog = () => {
  scheduleForm.value = {
    roomId: null,
    subject: "",
    teacher: "",
    startTime: "",
    endTime: "",
    type: "lecture",
  };
  showAddDialog.value = true;
};

// Save schedule via API
const saveSchedule = async () => {
  if (!scheduleForm.value.roomId || !scheduleForm.value.subject) {
    toast.add({ severity: "warn", summary: "Xona va fan nomi shart", life: 2000 });
    return;
  }
  try {
    await api.post("/room-schedules/assign", {
      ...scheduleForm.value,
      userId: admin.id,
    });
    toast.add({ severity: "success", summary: "✅ Jadval saqlandi", life: 2000 });
    showAddDialog.value = false;
    fetchSchedules();
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "❌ Xatolik",
      detail: err.response?.data?.message || err.message,
      life: 3000,
    });
  }
};

// Delete schedule
const deleteSchedule = async (id) => {
  if (!confirm("Jadvalni o‘chirmoqchimisiz?")) return;
  try {
    await api.delete(`/room-schedules/${id}`, { data: { userId: admin.id } });
    toast.add({ severity: "warn", summary: "🗑️ O‘chirildi", life: 2000 });
    fetchSchedules();
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "❌ O‘chirishda xatolik",
      detail: err.response?.data?.message || err.message,
      life: 3000,
    });
  }
};

// Edit schedule
const editSchedule = (schedule) => {
  scheduleForm.value = {
    roomId: schedule.roomId._id,
    subject: schedule.subject,
    teacher: schedule.teacher,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    type: schedule.type,
    _id: schedule._id,
  };
  showAddDialog.value = true;
};

// On mounted
onMounted(() => {
  fetchRoomsAndGroups();
  fetchSchedules();
});
</script>
