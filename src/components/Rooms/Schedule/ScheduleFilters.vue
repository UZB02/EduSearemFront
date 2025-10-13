<template>
  <div class="bg-gray-50 border-b border-gray-200 px-6 py-4">
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div class="flex flex-col sm:flex-row gap-3 flex-1">
        <div class="flex items-center gap-2">
          <i class="pi pi-search text-indigo-600"></i>
          <input
            v-model="groupName"
            type="text"
            placeholder="Guruh nomi bo'yicha qidirish..."
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div class="flex items-center gap-2">
          <i class="pi pi-user text-indigo-600"></i>
          <input
            v-model="teacherName"
            type="text"
            placeholder="O'qituvchi nomi bo'yicha qidirish..."
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div class="flex items-center gap-2">
          <i class="pi pi-home text-indigo-600"></i>
          <input
            v-model="room"
            type="text"
            placeholder="Xona bo'yicha qidirish..."
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-600">{{ count }} ta dars topildi</span>
        <button
          v-if="groupName || teacherName || room"
          @click="$emit('clear')"
          class="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm flex items-center gap-1"
        >
          <i class="pi pi-times text-xs"></i>
          Tozalash
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: Number,
  modelValue: Object
});
const groupName = defineModel('groupName');
const teacherName = defineModel('teacherName');
const room = defineModel('room');
</script>
