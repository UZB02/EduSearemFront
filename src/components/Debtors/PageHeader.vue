<template>
  <Card class="mb-6 border-0 overflow-hidden">
    <template #content>
      <div class="">
        <div class="flex flex-col items-center justify-center lg:flex-row lg:items-center lg:justify-between gap-6">
          <!-- Title -->
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <i class="pi pi-wallet text-white text-xl"></i>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-600 m-0">
                Moliyaviy hisobot
              </h1>
              <p class="text-gray-600 dark:text-gray-300 text-sm m-0 mt-1">
                Qarzdorlar va haqdorlar ro'yxati
              </p>
            </div>
          </div>
          <!-- Search and Actions -->
          <div class="flex flex-col items-center justify-center sm:flex-row gap-3 w-full md:w-auto">
            <span class="p-input-icon-right md:w-auto flex-1 sm:flex-none flex items-center justify-center gap-2">
              <InputText 
                :model-value="search"
                @update:model-value="$emit('update:search', $event)"
                placeholder="Ism yoki guruh bo'yicha qidirish..." 
                class=" w-10/12 sm:w-64 md:w-80"
              />
               <Button 
              icon="pi pi-refresh" 
              class="p-button-rounded p-button-outlined  sm:w-auto"
              @click="$emit('refresh')"
              v-tooltip.bottom="'Yangilash'"
            />
            </span>
           <div class="flex items-center justify-center gap-2">
             <Button 
              icon="pi pi-download" 
              label="Eksport"
              class="p-button-outlined sm:w-auto"
              @click="$emit('export')"
            />
           </div>
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
