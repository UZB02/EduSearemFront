<template>
  <div class="p-4 shadow-md">
    <h2 class="text-xl font-bold mb-4">Progress kiritish</h2>

    <div class="flex flex-col gap-4">
      <Dropdown
        v-model="studentId"
        :options="students"
        option-label="label"
        option-value="value"
        placeholder="O‘quvchi tanlang"
      />

      <InputNumber v-model="attendanceRate" :min="0" :max="100" placeholder="Attendance Rate (%)" />
      <InputNumber v-model="averageScore" :min="0" :max="100" placeholder="Average Score" />
      <InputNumber v-model="teacherFeedback" :min="1" :max="5" placeholder="Teacher Feedback (1-5)" />

      <Button label="Saqlash" @click="submitProgress" class="mt-2 w-full" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

const students = ref([]);
const studentId = ref(null);
const attendanceRate = ref(0);
const averageScore = ref(0);
const teacherFeedback = ref(3);

const admin = JSON.parse(sessionStorage.getItem("admin"));

// Studentlarni olish
onMounted(async () => {
  try {
    const res = await axios.get(`/students/${admin.id}`);
    // res.data array ekanligini tekshirish
    if (Array.isArray(res.data)) {
      students.value = res.data.map((s) => ({
        label: `${s.name} ${s.lastname}`,
        value: s._id,
      }));
    } else {
      console.warn("Students data is not an array:", res.data);
      students.value = [];
    }
  } catch (err) {
    console.error("Students fetch error:", err);
    students.value = [];
  }
});

// Progress saqlash
const submitProgress = async () => {
  if (!studentId.value) return alert("O‘quvchi tanlanmagan");

  try {
    const res = await axios.post("/progress", {
      studentId: studentId.value,
      attendanceRate: attendanceRate.value,
      averageScore: averageScore.value,
      teacherFeedback: teacherFeedback.value,
    });
    alert("Progress saqlandi ✅");
    console.log(res.data);
    // agar kerak bo'lsa, progressList yangilash event emit qilish mumkin
  } catch (err) {
    console.error("Progress save error:", err);
    alert("Xatolik yuz berdi ❌");
  }
};
</script>

<style scoped>
/* Qo‘shimcha styling kerak bo‘lsa */
</style>
