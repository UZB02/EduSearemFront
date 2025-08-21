<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ">
    <!-- Enhanced header with better gradient and typography -->
    <div class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-2xl p-4 mb-8 mt-4 text-white shadow-xl">
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="relative z-10">
        <h1 class="text-4xl font-bold mb-3 tracking-tight">O'quvchi yillik progressi</h1>
        <p class="text-blue-100 text-lg font-medium">Davomat va o'qituvchi baholarining tahlili</p>
      </div>
      <!-- Decorative elements -->
      <div class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      <div class="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
      <!-- Enhanced year selector with better styling -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-800">Yil tanlash</h3>
          </div>
          <Calendar 
            v-model="selectedYear" 
            view="year" 
            dateFormat="yy" 
            placeholder="Yilni tanlang" 
            class="w-full"
            :pt="{
              root: 'rounded-xl border-slate-200',
              input: 'rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            }"
          />
        </div>
      </div>

      <!-- Enhanced statistics cards with better animations and styling -->
      <div class="lg:col-span-3">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <!-- Attendance Card -->
          <div class="group bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-slate-500 text-sm font-medium mb-1">Umumiy davomat</p>
                <p class="text-3xl font-bold text-slate-800 mb-1">{{ totalAttendance }}%</p>
                <div class="flex items-center gap-1">
                  <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span class="text-xs text-emerald-600 font-medium">Faol</span>
                </div>
              </div>
              <div class="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Average Rating Card -->
          <div class="group bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-slate-500 text-sm font-medium mb-1">O'rtacha baho</p>
                <p class="text-3xl font-bold text-slate-800 mb-1">{{ averageFeedback }}/5</p>
                <div class="flex items-center gap-1">
                  <div class="flex">
                    <svg v-for="i in 5" :key="i" class="w-3 h-3" :class="i <= Math.round(averageFeedback) ? 'text-amber-400' : 'text-slate-300'" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Active Months Card -->
          <div class="group bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-slate-500 text-sm font-medium mb-1">Faol oylar</p>
                <p class="text-3xl font-bold text-slate-800 mb-1">{{ activeMonths }}/12</p>
                <div class="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000" :style="`width: ${(activeMonths/12)*100}%`"></div>
                </div>
              </div>
              <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced chart container with sophisticated styling -->
    <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 mb-2">Oylik progress tahlili</h2>
          <p class="text-slate-500">{{ selectedYear?.getFullYear() }} yil uchun ma'lumotlar</p>
        </div>
        <div class="flex items-center gap-6 text-sm mt-4 sm:mt-0">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-sm"></div>
            <span class="text-slate-600 font-medium">Davomat</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-sm"></div>
            <span class="text-slate-600 font-medium">O'qituvchi bahosi</span>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="flex items-center justify-center h-96">
        <div class="flex flex-col items-center gap-4 text-slate-500">
          <div class="relative">
            <div class="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div class="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-500 rounded-full animate-spin" style="animation-delay: -0.5s; animation-direction: reverse;"></div>
          </div>
          <div class="text-center">
            <p class="font-medium">Ma'lumotlar yuklanmoqda...</p>
            <p class="text-sm text-slate-400 mt-1">Iltimos, kuting</p>
          </div>
        </div>
      </div>

      <Chart 
        v-else-if="chartData" 
        type="bar" 
        :data="chartData" 
        :options="chartOptions" 
        class="h-96 w-full"
      />
      
      <div v-else class="flex flex-col items-center justify-center h-96 text-slate-400">
        <div class="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <p class="text-xl font-semibold text-slate-600 mb-2">Ma'lumot topilmadi</p>
        <p class="text-slate-500 text-center max-w-md">Tanlangan yil uchun progress ma'lumotlari mavjud emas. Boshqa yilni tanlashga harakat qiling.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import axios from "axios";
import Chart from "primevue/chart";
import Calendar from "primevue/calendar";

const selectedYear = ref(new Date());
const monthlyProgress = ref([]);
const isLoading = ref(false);

const loadProgress = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get(`/progress/68a6dec7bacaf2ae7020afe3/yearly`, {
      params: { year: selectedYear.value.getFullYear() },
    });
    monthlyProgress.value = res.data;
  } catch (err) {
    console.error("Yillik progressni olishda xatolik:", err);
    monthlyProgress.value = [];
  } finally {
    isLoading.value = false;
  }
};

watch(selectedYear, loadProgress, { immediate: true });

const totalAttendance = computed(() => {
  if (!monthlyProgress.value.length) return 0;
  const total = monthlyProgress.value.reduce((sum, m) => sum + (m.totalAttendance || 0), 0);
  return Math.round(total / monthlyProgress.value.length);
});

const averageFeedback = computed(() => {
  if (!monthlyProgress.value.length) return 0;
  const total = monthlyProgress.value.reduce((sum, m) => sum + (m.totalFeedback || 0), 0);
  return (total / monthlyProgress.value.length).toFixed(1);
});

const activeMonths = computed(() => {
  return monthlyProgress.value.filter(m => m.totalAttendance > 0 || m.totalFeedback > 0).length;
});

const chartData = computed(() => {
  if (!monthlyProgress.value.length) return null;

  const months = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
  ];

  return {
    labels: monthlyProgress.value.map(m => months[m.month - 1] || `Oy ${m.month}`),
    datasets: [
      {
        label: "Davomat yig'indisi",
        data: monthlyProgress.value.map(m => m.totalAttendance || 0),
        backgroundColor: "rgba(52, 211, 153, 0.8)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: "O'qituvchi bahosi yig'indisi",
        data: monthlyProgress.value.map(m => m.totalFeedback || 0),
        backgroundColor: "rgba(251, 191, 36, 0.8)",
        borderColor: "rgb(245, 158, 11)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: { 
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      titleColor: '#f8fafc',
      bodyColor: '#e2e8f0',
      borderColor: 'rgba(148, 163, 184, 0.2)',
      borderWidth: 1,
      cornerRadius: 12,
      displayColors: true,
      padding: 12,
      titleFont: {
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        size: 13
      },
      callbacks: {
        title: function(context) {
          return context[0].label;
        },
        label: function(context) {
          return `${context.dataset.label}: ${context.parsed.y}`;
        }
      }
    },
  },
  scales: {
    x: { 
      stacked: false,
      grid: {
        display: false,
      },
      ticks: {
        color: '#64748b',
        font: {
          size: 12,
          weight: '500'
        }
      }
    },
    y: {
      stacked: false,
      beginAtZero: true,
      grid: {
        color: 'rgba(148, 163, 184, 0.1)',
        drawBorder: false,
      },
      ticks: {
        color: '#64748b',
        font: {
          size: 12,
        }
      },
      title: {
        display: true,
        text: "Qiymat / Baholar",
        color: '#475569',
        font: {
          size: 14,
          weight: 'bold',
        }
      },
    },
  },
  animation: {
    duration: 1200,
    easing: 'easeInOutQuart',
  },
};
</script>