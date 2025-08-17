<template>
  <div v-if="date" class="flex items-center gap-2">
    <i class="pi pi-calendar text-gray-400"></i>
    <span class="text-sm text-gray-600">{{ formatDate(date) }}</span>
  </div>
  <span v-else class="text-gray-400 text-sm italic">To'lov yo'q</span>
</template>

<script setup>
defineProps({
  date: {
    type: [String, Date],
    default: null
  }
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>
