<template>
  <div class="mx-auto max-w-5xl p-4 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">O‘quvchi Progressi</h1>
      <button @click="goBack" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
        <i class="pi pi-arrow-left mr-2"></i> Ortga
      </button>
    </div>

    <!-- Student Info -->
    <StudentInfoCard v-if="student" :student="student" />
    <div v-else class="text-gray-500">Ma'lumotlar yuklanmoqda...</div>

    <!-- Progress Form (Har dars progressini kiritish) -->
    <ProgressForm :studentId="studentId" @progress-saved="fetchProgressList" />

    <!-- Barcha progresslar jadvali -->
    <ProgressList :progressList="progressList" />

    <!-- Oylik progress -->
    <MonthlyProgress :studentId="studentId" />

    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useToast } from "primevue/usetoast";

// Komponentlar
import StudentInfoCard from "@/components/Students/StudentInfoCard.vue";
import ProgressForm from "@/components/Progress/ProgressForm.vue";
import ProgressList from "@/components/Progress/ProgressList.vue";
import MonthlyProgress from "@/components/Progress/MonthlyProgress.vue";

const toast = useToast();
const route = useRoute();
const router = useRouter();

const studentId = ref(route.params.id || "68a6dec7bacaf2ae7020afe3");
const student = ref(null);
const progressList = ref([]);

// Student ma'lumotini olish
const getStudentById = async () => {
  try {
    const res = await axios.get(`/students/byId/${studentId.value}`);
    student.value = res.data; // backend object qaytarsin
  } catch (err) {
    toast.add({ severity: "error", summary: "Xatolik", detail: "Student ma'lumotlarini yuklab bo‘lmadi", life: 3000 });
  }
};

// Progresslarni olish
const fetchProgressList = async () => {
  try {
    const res = await axios.get(`/progress/${studentId.value}`);
    progressList.value = Array.isArray(res.data) ? res.data : [];
    console.log(progressList.value);
  } catch (err) {
    toast.add({ severity: "error", summary: "Xatolik", detail: "Progresslarni yuklab bo‘lmadi", life: 3000 });
  }
};

// Ortga qaytish
const goBack = () => router.back();

onMounted(() => {
  getStudentById();
  fetchProgressList();
});
</script>
