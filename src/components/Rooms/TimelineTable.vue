<template>
  <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-6 py-4">
      <h2 class="text-xl font-bold text-white flex items-center gap-2">
        <i class="pi pi-calendar text-white/90"></i>
        Dars jadvali
      </h2>
    </div>

    <!-- Filter section -->
    <div class="bg-gray-50 border-b border-gray-200 px-6 py-4">
      <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div class="flex flex-col sm:flex-row gap-3 flex-1">
          <!-- Group name filter -->
          <div class="flex items-center gap-2">
            <i class="pi pi-search text-indigo-600"></i>
            <input
              v-model="groupNameFilter"
              type="text"
              placeholder="Guruh nomi bo'yicha qidirish..."
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          <!-- Teacher name filter -->
          <div class="flex items-center gap-2">
            <i class="pi pi-user text-indigo-600"></i>
            <input
              v-model="teacherNameFilter"
              type="text"
              placeholder="O'qituvchi nomi bo'yicha qidirish..."
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          <!-- Room filter -->
          <div class="flex items-center gap-2">
            <i class="pi pi-home text-indigo-600"></i>
            <input
              v-model="roomFilter"
              type="text"
              placeholder="Xona bo'yicha qidirish..."
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-600">
            {{ filteredSchedulesCount }} ta dars topildi
          </span>
          <button
            v-if="groupNameFilter || teacherNameFilter || roomFilter"
            @click="clearFilters"
            class="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm transition-colors duration-200 flex items-center gap-1"
          >
            <i class="pi pi-times text-xs"></i>
            Tozalash
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr class="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
            <th class="px-4 py-4 text-left font-semibold text-gray-800 border-r border-gray-200 sticky left-0 z-10 bg-white shadow-sm">
              <div class="flex items-center gap-2">
                <i class="pi pi-home text-indigo-600"></i>
                Xona
              </div>
            </th>
            <th
              v-for="day in days"
              :key="day.value"
              class="px-4 py-4 text-center font-semibold text-gray-700 border-r border-gray-200 last:border-r-0 min-w-36"
            >
              <div class="flex flex-col items-center gap-1">
                <span class="text-sm font-medium">{{ day.label }}</span>
                <div class="w-8 h-0.5 bg-indigo-400 rounded-full"></div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(room, index) in rooms"
            :key="room._id"
            :class="index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'"
            class="hover:bg-indigo-50/30 transition-colors duration-200"
          >
            <td class="px-6 py-4 font-semibold text-gray-900 border-r border-gray-200 bg-white sticky left-0 z-10 shadow-sm">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <span>{{ room.name }}</span>
              </div>
            </td>
            <td
              v-for="day in days"
              :key="day.value"
              class="border-r border-gray-200 last:border-r-0 relative h-96 p-3"
            >
              <div class="relative h-full bg-gray-50/30 rounded-lg border border-gray-100">

                <!-- Schedule blocks -->
                <div
                  v-for="s in filteredSchedulesForRoomAndDay(room._id, day.value)"
                  :key="s._id"
                  :class="[ 
                    'absolute text-white text-xs px-3 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden border-2 border-white/20',
                    s.isActive
                      ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:via-emerald-500 hover:to-teal-500'
                      : 'bg-gradient-to-br from-red-500 via-red-600 to-rose-600 hover:from-red-400 hover:via-red-500 hover:to-rose-500'
                  ]"
                  :style="computeBlockStyle(s.groupId.startTime, s.groupId.endTime)"
                  :title="`${s.groupId.name} (${s.groupId.startTime}-${s.groupId.endTime})`"
                  @click="openDialog(s)"
                >
                  <div class="font-semibold truncate max-w-full mb-1">{{ s.groupId.name }}</div>
                  <div class="text-xs opacity-90 truncate flex items-center gap-1">
                    <i class="pi pi-clock text-xs"></i>
                    {{ s.groupId.startTime }} - {{ s.groupId.endTime }}
                  </div>
                  <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </div>

                <!-- Empty state -->
                <div
                  v-if="filteredSchedulesForRoomAndDay(room._id, day.value).length === 0"
                  class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-sm"
                >
                  <i class="pi pi-calendar-plus text-2xl opacity-30 mb-2"></i>
                  <span class="text-xs opacity-60">Bo'sh</span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Dialog -->
    <Dialog
      v-model:visible="dialogVisible"
      modal
      class="w-[600px]"
      :pt="{
        root: 'rounded-2xl overflow-hidden',
        header: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4',
        content: 'p-0'
      }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <i class="pi pi-info-circle text-xl"></i>
          <span class="text-lg font-semibold">Guruh ma'lumotlari</span>
        </div>
      </template>

      <div v-if="selectedSchedule" class="p-6">
        <!-- Status Badge -->
        <div class="flex justify-between items-start mb-6">
          <div class="flex items-center gap-3">
            <div :class="['w-4 h-4 rounded-full', selectedSchedule.isActive ? 'bg-emerald-500' : 'bg-red-500']"></div>
            <h3 class="text-xl font-bold text-gray-800">{{ selectedSchedule.groupId.name }}</h3>
          </div>
          <span :class="['px-3 py-1 rounded-full text-sm font-medium', selectedSchedule.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700']">
            {{ selectedSchedule.isActive ? 'Aktiv' : 'Arxiv' }}
          </span>
        </div>

        <!-- Info Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-50 rounded-xl p-4 space-y-3">
            <div class="flex items-center gap-2 text-gray-700">
              <i class="pi pi-bookmark text-indigo-600"></i>
              <span class="font-medium">Ta'rif:</span>
            </div>
            <p class="text-gray-600 text-sm">{{ selectedSchedule.groupId.description }}</p>
          </div>

          <div class="bg-gray-50 rounded-xl p-4 space-y-3">
            <div class="flex items-center gap-2 text-gray-700">
              <i class="pi pi-user text-indigo-600"></i>
              <span class="font-medium">O'qituvchi:</span>
            </div>
            <p class="text-gray-800 font-medium">
              {{ selectedSchedule.groupId.teacher.name }} {{ selectedSchedule.groupId.teacher.lastname }}
            </p>
            <p class="text-gray-600 text-sm flex items-center gap-1">
              <i class="pi pi-phone text-xs"></i>
              {{ selectedSchedule.groupId.teacher.phone }}
            </p>
          </div>

          <div class="bg-gray-50 rounded-xl p-4 space-y-3">
            <div class="flex items-center gap-2 text-gray-700">
              <i class="pi pi-calendar text-indigo-600"></i>
              <span class="font-medium">Dars vaqti:</span>
            </div>
            <p class="text-gray-800 font-medium">{{ selectedSchedule.groupId.startTime }} - {{ selectedSchedule.groupId.endTime }}</p>
            <p class="text-gray-600 text-sm">{{ selectedSchedule.groupId.days?.join(", ") }}</p>
          </div>

          <div class="bg-gray-50 rounded-xl p-4 space-y-3">
            <div class="flex items-center gap-2 text-gray-700">
              <i class="pi pi-home text-indigo-600"></i>
              <span class="font-medium">Xona:</span>
            </div>
            <p class="text-gray-800 font-medium">{{ selectedSchedule.roomId.name }}</p>
            <p class="text-gray-600 text-sm">{{ selectedSchedule.roomId.capacity }} o'rin</p>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="bg-indigo-50 rounded-xl p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center gap-2">
              <i class="pi pi-money-bill text-indigo-600"></i>
              <span class="font-medium text-gray-700">Oylik to'lov:</span>
              <span class="font-bold text-indigo-700">{{ selectedSchedule.groupId.monthlyFee?.toLocaleString() }} so'm</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-calendar-plus text-indigo-600"></i>
              <span class="font-medium text-gray-700">Yaratilgan:</span>
              <span class="text-gray-600">{{ new Date(selectedSchedule.groupId.createdAt).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between items-center pt-4 border-t border-gray-200">
          <Button label="Xonadan olib tashlash" severity="danger" icon="pi pi-trash"
            class="px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            @click="removeFromRoom(selectedSchedule)" />
          <Button label="Yopish" severity="secondary" icon="pi pi-times"
            class="px-6 py-3 rounded-xl" @click="dialogVisible = false" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import api from "../../utils/api.js"

const props = defineProps({
  rooms: Array,
  days: Array,
  schedules: Array
});

const dialogVisible = ref(false);
const selectedSchedule = ref(null);

const groupNameFilter = ref('');
const teacherNameFilter = ref('');
const roomFilter = ref('');

const filteredSchedulesCount = computed(() => {
  return props.schedules.filter(schedule => {
    const groupNameMatch = !groupNameFilter.value ||
      schedule.groupId.name.toLowerCase().includes(groupNameFilter.value.toLowerCase());

    const teacherFullName = `${schedule.groupId.teacher.name} ${schedule.groupId.teacher.lastname}`.toLowerCase();
    const teacherNameMatch = !teacherNameFilter.value ||
      teacherFullName.includes(teacherNameFilter.value.toLowerCase());

    const roomNameMatch = !roomFilter.value ||
      schedule.roomId.name.toLowerCase().includes(roomFilter.value.toLowerCase());

    return groupNameMatch && teacherNameMatch && roomNameMatch;
  }).length;
});

const clearFilters = () => {
  groupNameFilter.value = '';
  teacherNameFilter.value = '';
  roomFilter.value = '';
};

const openDialog = (schedule) => {
  selectedSchedule.value = schedule;
  dialogVisible.value = true;
};

const filteredSchedulesForRoomAndDay = (roomId, day) => {
  return props.schedules.filter((s) => {
    const roomDayMatch = s.roomId._id === roomId && s.dayOfWeek === day;
    if (!roomDayMatch) return false;

    const groupNameMatch = !groupNameFilter.value ||
      s.groupId.name.toLowerCase().includes(groupNameFilter.value.toLowerCase());

    const teacherFullName = `${s.groupId.teacher.name} ${s.groupId.teacher.lastname}`.toLowerCase();
    const teacherNameMatch = !teacherNameFilter.value ||
      teacherFullName.includes(teacherNameFilter.value.toLowerCase());

    const roomNameMatch = !roomFilter.value ||
      s.roomId.name.toLowerCase().includes(roomFilter.value.toLowerCase());

    return groupNameMatch && teacherNameMatch && roomNameMatch;
  });
};

const computeBlockStyle = (start, end) => {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  const startInMinutes = sh * 60 + sm;
  const endInMinutes = eh * 60 + em;

  const dayStart = 4 * 60;   // 4:00
  const dayEnd = 24 * 60;    // 24:00
  const totalMinutes = dayEnd - dayStart;

  // Top va height foizlarini 100% asosida hisoblash
  const topPercent = ((startInMinutes - dayStart) / totalMinutes) * 100;
  const heightPercent = ((endInMinutes - startInMinutes) / totalMinutes) * 100;

  return {
    position: "absolute",
    top: `${topPercent}%`,
    height: `${Math.max(heightPercent, 15)}%`, // juda kichik bo'lsa 5% minimal
    left: "8px",
    right: "8px",
    zIndex: 10
  };
};


const removeFromRoom = async (schedule) => {
  try {
    await api.delete(`/room-schedules/${schedule.roomId._id}/group/${schedule.groupId._id}`);

    // Frontendni yangilash – barcha kunlar bo‘yicha shu guruhni olib tashlaymiz
    const updated = props.schedules.filter(
      (s) => !(s.roomId._id === schedule.roomId._id && s.groupId._id === schedule.groupId._id)
    );

    // Reaktivlikni saqlash uchun massivni tozalab qayta to‘ldiramiz
    props.schedules.splice(0, props.schedules.length, ...updated);

    dialogVisible.value = false;
  } catch (err) {
    console.error("O‘chirishda xatolik:", err);
  }
};

</script>
