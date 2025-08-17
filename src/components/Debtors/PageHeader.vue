<template>
  <Card class="mb-6 shadow-xl border-0 overflow-hidden">
    <template #content>
      <div class="p-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <i class="pi pi-wallet text-white text-xl"></i>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 m-0">
                Moliyaviy hisobot
              </h1>
              <p class="text-gray-600 dark:text-gray-300 text-sm m-0 mt-1">
                Qarzdorlar va haqdorlar ro'yxati
              </p>
            </div>
          </div>
          
          <!-- Search and Actions -->
          <div class="flex flex-col sm:flex-row gap-3">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText 
                :model-value="search"
                @update:model-value="$emit('update:search', $event)"
                placeholder="Ism yoki guruh bo'yicha qidirish..." 
                class="w-full sm:w-80"
              />
            </span>
            <Button 
              icon="pi pi-download" 
              label="Eksport"
              class="p-button-outlined"
              @click="$emit('export')"
            />
            <Button 
              icon="pi pi-refresh" 
              class="p-button-rounded p-button-outlined"
              @click="$emit('refresh')"
              v-tooltip.bottom="'Yangilash'"
            />
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

defineProps({
  search: {
    type: String,
    required: true
  }
});

defineEmits(['update:search', 'export', 'refresh']);
</script>
