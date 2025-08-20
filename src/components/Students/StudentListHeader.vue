<template>
  <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-xl font-bold text-white flex items-center">
          <i class="pi pi-users mr-2"></i>
          O'quvchilar ro'yxati
        </h2>
        <p class="text-indigo-100 text-sm mt-1">Jami: {{ studentCount }} ta o'quvchi</p>
      </div>
      <div class="flex gap-3">
        <div class="relative">
          <i
            class="pi pi-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          ></i>
          <InputText
            :model-value="searchTerm"
            @update:model-value="$emit('search', $event)"
            placeholder="O'quvchi qidirish..."
            class="pl-10 bg-white/90 border-0 rounded-lg shadow-sm"
          />
        </div>
        <Button
          icon="pi pi-download"
          label="Excel"
          @click="$emit('export')"
          class="bg-white/20 hover:bg-white/30 border-white/30 text-white"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

defineProps({
  studentCount: Number,
  searchTerm: String
})

defineEmits(['search', 'export'])
</script>