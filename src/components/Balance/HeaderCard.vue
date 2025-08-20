<template>
  <Card class="mb-6 shadow-lg border-0">
    <template #content>
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <i class="pi pi-chart-line text-white text-xl"></i>
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Moliyaviy hisobot</h1>
            <p class="text-gray-600 text-sm md:text-base">Joriy moliyaviy holat va statistika</p>
          </div>
        </div>
        <div class="flex gap-2 w-full md:w-auto">
          <Button 
            @click="$emit('refresh')" 
            :loading="loading"
            icon="pi pi-refresh" 
            label="Yangilash"
            class="flex-1 md:flex-none"
            severity="info"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from "primevue/card";
import Button from "primevue/button";

defineProps({
  loading: Boolean
});

defineEmits(["refresh"]);
</script>
