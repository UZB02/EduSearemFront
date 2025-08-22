<template>
  <div class="">
    <!-- Ortga tugma -->
    <button
      @click="router.back()"
      class="inline-flex items-center cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
    >
      <i class="pi pi-arrow-left mr-2"></i>
      Ortga
    </button>

    <!-- Header -->
    <div
      class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-2xl p-4 mb-8 mt-4 text-white "
    >
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="relative z-10">
        <h1 class="text-4xl font-bold mb-3 tracking-tight">O'quvchi yillik progressi</h1>
        <p class="text-blue-100 text-lg font-medium">Davomat va o'qituvchi baholarining tahlili</p>
      </div>
    </div>

    <!-- Statistikalar -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
      <div class="lg:col-span-1">
        <div
          class="bg-white rounded-2xl p-6 border border-slate-200   transition-all duration-300"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg
                class="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
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
          />
        </div>
      </div>

      <!-- Cards -->
      <div class="lg:col-span-3">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <!-- Attendance Card -->
          <div
            class="group bg-white rounded-2xl p-6 border border-slate-200   transition-all duration-300 hover:-translate-y-1"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-slate-500 text-sm font-medium mb-1">Umumiy davomat</p>
                <p class="text-3xl font-bold text-slate-800 mb-1">{{ totalAttendance }}%</p>
              </div>
            </div>
          </div>

          <!-- Average Rating Card -->
          <div
            class="group bg-white rounded-2xl p-6 border border-slate-200 transition-all duration-300 hover:-translate-y-1"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-slate-500 text-sm font-medium mb-1">O'rtacha baho</p>
                <p class="text-3xl font-bold text-slate-800 mb-1">{{ averageFeedback }}/5</p>
              </div>
            </div>
          </div>

          <!-- Active Months Card -->
          <div
            class="group bg-white rounded-2xl p-6 border border-slate-200 transition-all duration-300 hover:-translate-y-1"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-slate-500 text-sm font-medium mb-1">Faol oylar</p>
                <p class="text-3xl font-bold text-slate-800 mb-1">{{ activeMonths }}/12</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div
      class="bg-white rounded-2xl p-8 border border-slate-200 mb-8"
    >
      <Chart
        v-if="chartData"
        type="bar"
        :data="chartData"
        :options="chartOptions"
        class="h-96 w-full"
      />
    </div>

    <!-- Progress jadvali (quyida) -->
    <ProgressTable :studentId="studentId" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Chart from "primevue/chart";
import Calendar from "primevue/calendar";
import ProgressTable from "@/components/Students/StudentProgress/ProgressTable.vue"; // 👈 qo‘shildi

const router = useRouter();
const studentId = ref(router.currentRoute.value.params.id);

const selectedYear = ref(new Date());
const monthlyProgress = ref([]);
const isLoading = ref(false);

const loadProgress = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get(`/progress/${studentId.value}/yearly`, {
      params: { year: selectedYear.value.getFullYear() },
    });
    console.log(res.data);
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
  return monthlyProgress.value.filter((m) => m.totalAttendance > 0 || m.totalFeedback > 0).length;
});

const chartData = computed(() => {
  if (!monthlyProgress.value.length) return null;
  const months = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
  return {
    labels: monthlyProgress.value.map((m) => months[m.month - 1] || `Oy ${m.month}`),
    datasets: [
      {
        label: "Davomat yig'indisi",
        data: monthlyProgress.value.map((m) => m.totalAttendance || 0),
        backgroundColor: "rgba(52, 211, 153, 0.8)",
      },
      {
        label: "O'qituvchi bahosi yig'indisi",
        data: monthlyProgress.value.map((m) => m.totalFeedback || 0),
        backgroundColor: "rgba(251, 191, 36, 0.8)",
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>
