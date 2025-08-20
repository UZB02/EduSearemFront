<template>
  <Card class="shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <template #content>
      <div class="relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full -translate-y-8 translate-x-8"></div>
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-4">
            <div class="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <i class="pi pi-arrow-down-left text-white text-xl"></i>
            </div>
            <Tag 
              :value="`+${growth}%`" 
              severity="success" 
              class="text-xs font-semibold"
              icon="pi pi-arrow-up"
            />
          </div>
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-700 mb-1">Kirimlar</h3>
            <p class="text-sm text-gray-500">Umumiy to'lovlar</p>
            <div class="mt-3">
              <span class="text-3xl font-bold text-gray-800">{{ formatNumber(income) }}</span>
              <span class="text-lg text-gray-500 ml-2">so'm</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from "primevue/card";
import Tag from "primevue/tag";

defineProps({
  income: Number,
  growth: Number
});

const formatNumber = (num) => new Intl.NumberFormat("uz-UZ").format(num);
</script>
