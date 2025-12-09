<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">O‘quvchi yillik progressi</h2>

    <!-- Yil tanlash -->
    <div class="flex items-center gap-4 mb-6">
      <Calendar 
        v-model="selectedYear" 
        view="year" 
        dateFormat="yy" 
        placeholder="Yilni tanlang" 
        class="w-40"
      />
    </div>

    <!-- Diagramma -->
    <Chart v-if="chartData" type="bar" :data="chartData" :options="chartOptions" />
    <p v-else class="text-gray-500">Ma'lumot yo‘q</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import api from "@/utils/api.js";
import Chart from "primevue/chart";
import Calendar from "primevue/calendar";

// Tanlangan yil
const selectedYear = ref(new Date());

// Oylik progress ma'lumotlari
const monthlyProgress = ref([]);

// API orqali ma'lumot olish
const loadProgress = async () => {
  try {
    const res = await api.get(`/progress/68a6dec7bacaf2ae7020afe3/yearly`, {
      params: { year: selectedYear.value.getFullYear() },
    });
    monthlyProgress.value = res.data;
  } catch (err) {
    console.error("Yillik progressni olishda xatolik:", err);
    monthlyProgress.value = [];
  }
};

// Tanlangan yil o‘zgarganda API chaqirish
watch(selectedYear, loadProgress, { immediate: true });

// Chart.js uchun data
const chartData = computed(() => {
  if (!monthlyProgress.value.length) return null;

  return {
    labels: monthlyProgress.value.map(m => `Oy ${m.month}`),
    datasets: [
      {
        label: "Davomat yig‘indisi",
        data: monthlyProgress.value.map(m => m.totalAttendance || 0),
        backgroundColor: "#42A5F5",
      },
      {
        label: "O‘qituvchi bahosi yig‘indisi",
        data: monthlyProgress.value.map(m => m.totalFeedback || 0),
        backgroundColor: "#FFA726",
      },
    ],
  };
});

// Chart options
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  scales: {
    x: { stacked: false },
    y: {
      stacked: false,
      beginAtZero: true,
      title: {
        display: true,
        text: "Qiymat / Baholar",
      },
    },
  },
};
</script>
