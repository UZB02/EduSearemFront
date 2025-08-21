<template>
  <Card class="shadow-xl border-0">
    <template #header>
      <div class="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 border-b border-purple-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
            <i class="pi pi-chart-bar text-white text-lg"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-800 m-0">Natijalar diagrammasi</h3>
            <p class="text-sm text-gray-500 m-0 mt-1">O'quvchilar ko'rsatkichlari taqqoslash</p>
          </div>
        </div>
      </div>
    </template>

    <template #content>
      <div class="">
        <div v-if="loading" class="flex justify-center items-center py-12">
          <ProgressSpinner style="width:50px;height:50px" strokeWidth="4" class="text-purple-500" />
        </div>
        <Chart v-else-if="chartData" type="bar" :data="chartData" :options="chartOptions" class="w-full h-96" />
        <div v-else class="text-center py-12">
          <i class="pi pi-chart-bar text-gray-400 text-3xl mb-4"></i>
          <p class="text-gray-600">Ma'lumot mavjud emas</p>
        </div>
      </div>
    </template>
</Card>
</template>

<script setup>
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import ProgressSpinner from 'primevue/progressspinner';

const props = defineProps({
  loading: Boolean,
  chartData: Object,
  chartOptions: Object
});
</script>
