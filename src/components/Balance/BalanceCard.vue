<template>
  <Card class="shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 md:col-span-2 lg:col-span-1">
    <template #content>
      <div class="relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full -translate-y-8 translate-x-8"></div>
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-4">
            <div class="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <i class="pi pi-wallet text-white text-xl"></i>
            </div>
            <Tag 
              :value="`${changePercent}%`" 
              :severity="balance >= 0 ? 'success' : 'danger'" 
              class="text-xs font-semibold"
              :icon="balance >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
            />
          </div>
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-700 mb-1">Joriy balans</h3>
            <p class="text-sm text-gray-500">Hozirgi holat</p>
            <div class="mt-3">
              <span class="text-3xl font-bold" :class="balance >= 0 ? 'text-gray-800' : 'text-red-600'">
                {{ formatNumber(Math.abs(balance)) }}
              </span>
              <span class="text-lg text-gray-500 ml-2">so'm</span>
            </div>
          </div>
          <div class="flex items-center gap-2 p-3 rounded-lg" :class="statusClass">
            <i :class="statusIcon" class="text-sm"></i>
            <span class="text-sm font-medium">{{ statusText }}</span>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from "vue";
import Card from "primevue/card";
import Tag from "primevue/tag";

const props = defineProps({
  balance: Number,
  changePercent: Number
});

const formatNumber = (num) => new Intl.NumberFormat("uz-UZ").format(num);

const statusClass = computed(() => {
  if (props.balance > 5000000) return 'bg-green-100 text-green-800 border border-green-200';
  if (props.balance > 0) return 'bg-blue-100 text-blue-800 border border-blue-200';
  return 'bg-red-100 text-red-800 border border-red-200';
});

const statusIcon = computed(() => {
  if (props.balance > 5000000) return 'pi pi-check-circle text-green-600';
  if (props.balance > 0) return 'pi pi-info-circle text-blue-600';
  return 'pi pi-exclamation-triangle text-red-600';
});

const statusText = computed(() => {
  if (props.balance > 5000000) return 'Ajoyib holat';
  if (props.balance > 0) return 'Yaxshi holat';
  return 'Diqqat talab';
});
</script>

