<template>
  <div class="relative w-full bg-gray-50/30 rounded-lg border border-gray-100 overflow-x-auto">
    <div class="flex gap-3 px-3 py-2 min-w-max">
      <div
        v-for="s in filtered"
        :key="s._id"
        :class="[
          'text-white text-xs px-4 py-3 rounded-xl shadow-md cursor-pointer group border border-white/20 w-60 flex-shrink-0 transition-all duration-300',
          s.isActive
            ? 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400'
            : 'bg-gradient-to-r from-rose-500 via-red-600 to-pink-600 hover:from-rose-400'
        ]"
        @click="$emit('openDialog', s)"
      >
        <!-- Guruh nomi -->
        <div class="font-semibold truncate text-sm">{{ s.groupId.name }}</div>

        <!-- Dars vaqti -->
        <div class="text-xs opacity-90 truncate flex items-center gap-1">
          <i class="pi pi-clock text-xs"></i>
          {{ s.groupId.startTime }} - {{ s.groupId.endTime }}
        </div>

        <!-- O'qituvchi nomi -->
        <div class="text-xs opacity-90 mt-1 truncate">
          <i class="pi pi-user text-xs"></i>
          <span v-if="s.groupId.teachers && s.groupId.teachers.length">
            {{ s.groupId.teachers.map(t => t.name + ' ' + t.lastname).join(', ') }}
          </span>
          <span v-else>-</span>
        </div>
      </div>

      <!-- Agar hech narsa bo'lmasa -->
      <div
        v-if="filtered.length === 0"
        class="flex flex-col items-center justify-center text-gray-400 text-sm py-8 px-10"
      >
        <i class="pi pi-calendar-plus text-2xl opacity-30 mb-2"></i>
        <span class="text-xs opacity-60">Bo'sh</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  room: Object,
  day: Object,
  schedules: Array,
  groupNameFilter: String,
  teacherNameFilter: String,
  roomFilter: String,
});

// ✅ Teachers bo‘yicha filterlangan jadval
const filtered = computed(() =>
  props.schedules.filter((s) => {
    // Xonaga va kunga mosligini tekshirish
    const match = s.roomId?._id === props.room._id && s.dayOfWeek === props.day.value;
    if (!match) return false;

    // Guruhdagi barcha o'qituvchilar nomlarini birlashtirish
    const teacherNames = s.groupId?.teachers
      ? s.groupId.teachers.map(t => `${t.name} ${t.lastname}`).join(" ").toLowerCase()
      : "";

    // Filterlarni qo'llash
    return (
      (!props.groupNameFilter ||
        s.groupId?.name?.toLowerCase().includes(props.groupNameFilter.toLowerCase())) &&
      (!props.teacherNameFilter ||
        teacherNames.includes(props.teacherNameFilter.toLowerCase())) &&
      (!props.roomFilter ||
        s.roomId?.name?.toLowerCase().includes(props.roomFilter.toLowerCase()))
    );
  })
);
</script>
