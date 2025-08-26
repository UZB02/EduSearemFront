<template>
  <div
    class="absolute text-white text-xs px-3 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden border-2 border-white/20"
    :class="schedule.isActive
      ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:via-emerald-500 hover:to-teal-500'
      : 'bg-gradient-to-br from-red-500 via-red-600 to-rose-600 hover:from-red-400 hover:via-red-500 hover:to-rose-500'"
    :style="blockStyle"
    :title="`${schedule.groupId.name} (${schedule.groupId.startTime}-${schedule.groupId.endTime})`"
    @click="$emit('click')"
  >
    <div class="font-semibold truncate max-w-full mb-1">{{ schedule.groupId.name }}</div>
    <div class="text-xs opacity-90 truncate flex items-center gap-1">
      <i class="pi pi-clock text-xs"></i> {{ schedule.groupId.startTime }} - {{ schedule.groupId.endTime }}
    </div>
    <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  schedule: Object
});

const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const blockStyle = computed(() => {
  const { startTime, endTime } = props.schedule.groupId;
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);

  const startInMinutes = sh * 60 + sm;
  const endInMinutes = eh * 60 + em;

  const dayStart = 8 * 60;
  const dayEnd = 20 * 60;
  const totalMinutes = dayEnd - dayStart;

  const topPercent = ((startInMinutes - dayStart) / totalMinutes) * 90;
  const heightPercent = ((endInMinutes - startInMinutes) / totalMinutes) * 85;

  return {
    top: `${topPercent}%`,
    height: `${Math.max(heightPercent, 8)}%`,
    left: "8px",
    right: "8px",
    position: "absolute",
    minHeight: "32px",
    zIndex: 10
  };
});
</script>
