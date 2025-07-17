<template>
  <div class=" bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <div class="p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ group.name }}</h2>
      <p class="text-gray-600 text-sm mb-4">{{ group.description }}</p>

      <div class="flex justify-between items-center text-sm text-gray-500">
        <span>📅 {{ formatDate(group.createdAt) }}</span>
        <span>👥 {{ group.applications.length }} a'zo</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '../../utils/FormatDate.js';
defineProps({
  group: {
    type: Object,
    required: true,
    default: () => ({
      name: 'Frontend Guruh',
      description: 'Vue 3 va Tailwind o‘rganuvchilar uchun guruh',
      createdAt: '2025-07-17',
      membersCount: 42
    })
  }
})
</script>

<style scoped>
</style>
