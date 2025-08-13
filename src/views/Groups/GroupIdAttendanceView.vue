<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <div class="container mx-auto px-4 py-6 max-w-7xl">

      <GroupHeader 
        :groupInfo="groupInfo" 
        :totalLessons="totalLessons"
        @back="goBack"
      />

      <div v-if="loading" class="flex justify-center items-center py-12">
        <ProgressSpinner size="50" strokeWidth="4" />
      </div>

      <!-- <ErrorCard v-else-if="error" :error="error" @retry="retryFetch" /> -->

      <AttendanceStatsCards 
        v-else
        :totalStudents="totalStudents"
        :todayAttendance="todayAttendance"
        :lateStudents="lateStudents"
        :absentStudents="absentStudents"
      />

      <AttendanceHistory 
        :history="filteredAttendanceHistory" 
        :loading="loading"
        @refresh="fetchAttendanceHistory"
      />

      <!-- <EmptyStateCard 
        v-if="!loading && !error && attendanceHistory.length === 0"
        @addAttendance="addAttendance"
      /> -->

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/utils/api.js";

import GroupHeader from "@/components/Groups/Attendance/AttendanceGroupHeader.vue";
import AttendanceStatsCards from "@/components/Groups/Attendance/AttendanceStatsCards.vue";
import AttendanceHistory from "@/components/Groups/Attendance/AttendanceHistoryTable.vue";
// import ErrorCard from "@/components/UI/ErrorCard.vue";
// import EmptyStateCard from "@/components/Groups/Attendance/CardItem.vue/";
import ProgressSpinner from 'primevue/progressspinner';

const route = useRoute();
const router = useRouter();
const groupId = route.params.slug;

const loading = ref(true);
const error = ref("");
const attendanceHistory = ref([]);
const groupInfo = ref(null);
const dateRange = ref(null);
const admin = JSON.parse(sessionStorage.getItem('admin') || "{}");

// Computed
const totalStudents = computed(() => groupInfo.value?.students?.length || 0);
const totalLessons = computed(() => {
  const uniqueDates = new Set(attendanceHistory.value.map(r => new Date(r.date).toDateString()));
  return uniqueDates.size;
});

const getTodayStr = () => new Date().toISOString().split("T")[0];

const todayAttendance = computed(() => {
  const todayRecords = attendanceHistory.value.filter(r => new Date(r.date).toISOString().split("T")[0] === getTodayStr());
  if (!todayRecords.length) return 0;
  const presentCount = todayRecords.filter(r => r.status === 'present').length;
  return Math.round((presentCount / todayRecords.length) * 100);
});

const lateStudents = computed(() => attendanceHistory.value.filter(r => new Date(r.date).toISOString().split("T")[0] === getTodayStr() && r.status === 'late').length);
const absentStudents = computed(() => attendanceHistory.value.filter(r => new Date(r.date).toISOString().split("T")[0] === getTodayStr() && r.status === 'absent').length);

const filteredAttendanceHistory = computed(() => {
  if (!dateRange.value || !dateRange.value[0] || !dateRange.value[1]) return attendanceHistory.value;
  const [startDate, endDate] = dateRange.value;
  return attendanceHistory.value.filter(r => {
    const d = new Date(r.date);
    return d >= startDate && d <= endDate;
  });
});

// Methods
const fetchAttendanceHistory = async () => {
  try {
    loading.value = true;
    error.value = "";
    const res = await api.get(`/attendance/public-history/${groupId}`);
    attendanceHistory.value = res.data;
  } catch (e) {
    error.value = e.response?.data?.message || "Davomat tarixini olishda xatolik yuz berdi";
  } finally {
    loading.value = false;
  }
};

const getGroupById = async () => {
  try {
    const res = await api.get(`/groups/${groupId}`, { params: { adminId: admin.id } });
    groupInfo.value = res.data;
  } catch (err) {
    error.value = "Guruh ma'lumotlarini olishda xatolik yuz berdi";
  }
};

const goBack = () => router.back();
const retryFetch = () => Promise.all([getGroupById(), fetchAttendanceHistory()]);
const addAttendance = () => router.push(`/groups/${groupId}/attendance/add`);

onMounted(() => {
  getGroupById();
  fetchAttendanceHistory();
});
</script>
