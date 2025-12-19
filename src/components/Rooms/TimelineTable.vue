<template>
  <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-6 py-4">
      <h2 class="text-xl font-bold text-white flex items-center gap-2">
        <i class="pi pi-calendar text-white/90"></i>
        Dars jadvali (Gorizontal)
      </h2>
    </div>

    <!-- Filter section -->
    <ScheduleFilters
      v-model:groupName="groupNameFilter"
      v-model:teacherName="teacherNameFilter"
      v-model:room="roomFilter"
      :count="filteredSchedulesCount"
      @clear="clearFilters"
    />

    <!-- Gorizontal Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse">
        <thead>
          <tr class="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
            <th class="px-4 py-4 text-left font-semibold text-gray-800 border-r border-gray-200 sticky left-0 z-10 bg-white shadow-sm">
              <div class="flex items-center gap-2">
                <i class="pi pi-calendar text-indigo-600"></i>
                Kun
              </div>
            </th>
            <th
              v-for="room in rooms"
              :key="room._id"
              class="px-4 py-4 text-center font-semibold text-gray-700 border-r border-gray-200 last:border-r-0 min-w-40"
            >
              <div class="flex flex-col items-center gap-1">
                <span class="text-sm font-medium">{{ room.name }}</span>
                <div class="w-8 h-0.5 bg-indigo-400 rounded-full"></div>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(day, index) in days"
            :key="day.value"
            :class="index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'"
            class="hover:bg-indigo-50/30 transition-colors duration-200"
          >
            <td class="px-6 py-4 font-semibold text-gray-900 border-r border-gray-200 bg-white sticky left-0 z-10 shadow-sm">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <span>{{ day.label }}</span>
              </div>
            </td>

            <td
              v-for="room in rooms"
              :key="room._id"
              class="border-r border-gray-200 last:border-r-0 relative p-2 align-top h-40"
            >
              <ScheduleCell
                :room="room"
                :day="day"
                :schedules="props.schedules"
                :groupNameFilter="groupNameFilter"
                :teacherNameFilter="teacherNameFilter"
                :roomFilter="roomFilter"
                @openDialog="openDialog"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Dialog -->
    <ScheduleDialog
      v-if="selectedSchedule"
      v-model:visible="dialogVisible"
      :schedule="selectedSchedule"
      @remove="removeFromRoom"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import ScheduleFilters from "./Schedule/ScheduleFilters.vue";
import ScheduleDialog from "./Schedule/ScheduleDialog.vue";
import ScheduleCell from "./Schedule/ScheduleCell.vue";
import api from "../../utils/api.js";

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

// ✅ Teachers bo‘yicha filter ishlashi
const filteredSchedulesCount = computed(() => {
  return props.schedules.filter((schedule) => {
    const groupNameMatch = !groupNameFilter.value ||
      (schedule.groupId?.name || "").toLowerCase().includes(groupNameFilter.value.toLowerCase());

    const teacherFullName = schedule.groupId?.teachers
      ? schedule.groupId.teachers.map(t => `${t.name} ${t.lastname}`).join(" ").toLowerCase()
      : "";
    const teacherNameMatch = !teacherNameFilter.value || teacherFullName.includes(teacherNameFilter.value.toLowerCase());

    const roomNameMatch = !roomFilter.value ||
      (schedule.roomId?.name || "").toLowerCase().includes(roomFilter.value.toLowerCase());

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

const removeFromRoom = async (schedule) => {
  try {
    await api.delete(`/room-schedules/${schedule.roomId._id}/group/${schedule.groupId._id}`);
    const updated = props.schedules.filter(
      (s) => !(s.roomId._id === schedule.roomId._id && s.groupId._id === schedule.groupId._id)
    );
    props.schedules.splice(0, props.schedules.length, ...updated);
    dialogVisible.value = false;
  } catch (err) {
    console.error("O‘chirishda xatolik:", err);
  }
};
</script>
