<template>
  <div class="p-4 max-w-5xl mx-auto">
    <h1 class="text-2xl font-semibold mb-4">Davomat (Attendance)</h1>

    <div class="mb-4 flex items-center gap-3">
      <label class="text-sm">Sana:</label>
      <input v-model="dateString" type="date" class="border rounded p-2" />

      <Button label="Yuklash" icon="pi pi-refresh" @click="loadStudents" />
      <Button label="Saqlash" severity="success" icon="pi pi-save" @click="saveAttendance" />
    </div>

    <div v-for="group in groups" :key="group._id" class="mb-6">
      <Card>
        <template #title>
          <div class="flex items-center justify-between">
            <div>
              Guruh: <span class="font-medium">{{ group.name }}</span>
            </div>
            <div class="text-sm text-gray-500">
              O'qituvchi: {{ group.teacherName || "-" }}
            </div>
          </div>
        </template>

       <table border="1">
  <thead>
    <tr>
      <th>Ism</th>
      <th>Familiya</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ali</td>
      <td>Vali</td>
    </tr>
  </tbody>
</table>

<pre>{{ group }}</pre> <!-- Debug uchun -->



        
      </Card>
    </div>

    <Toast ref="toast" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import Toast from "primevue/toast";
import axios from "axios";

const toast = ref(null);
const groups = ref([]);
const dateString = ref(new Date().toISOString().slice(0, 10));
const statuses = ref({});
const statusOptions = [
  { label: "Kelgan", value: "present" },
  { label: "Kelmagan", value: "absent" },
  { label: "Kechikkan", value: "late" },
];

onMounted(() => {
  loadStudents();
});

async function loadStudents() {
  try {
    const token =
      localStorage.getItem("token") ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODIzYmQ2NjcwNGI4ZDZhNTFkNzRhZCIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzU0OTM3MDg4LCJleHAiOjE3NTU1NDE4ODh9.WguE3LBaHZJ2X1blBJn73zlpPldGBr6AWE70kUpC4bM";

    const res = await axios.get("/attendance/my-students", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Har bir student obyektini toza klonga aylantiramiz
    groups.value = (res.data || []).map(group => ({
      ...group,
      students: (group.students || []).map(s => ({ ...s }))
    }));

    console.log("Loaded groups:", groups.value);

    // Statuslar
    statuses.value = {};
    groups.value.forEach(group => {
      statuses.value[group._id] = {};
      (group.students || []).forEach(student => {
        statuses.value[group._id][student._id] = "present";
      });
    });

    toast.value.add({
      severity: "success",
      summary: "OK",
      detail: "Oʻquvchilar yuklandi"
    });
  } catch (err) {
    console.error(err);
    toast.value.add({
      severity: "error",
      summary: "Xato",
      detail: err.response?.data?.message || err.message
    });
  }
}

async function saveAttendance() {
  try {
    const token = localStorage.getItem("token");

    const payload = {
      date: dateString.value,
      records: [],
    };

    groups.value.forEach(group => {
      (group.students || []).forEach(student => {
        payload.records.push({
          studentId: student._id,
          status: statuses.value[group._id][student._id] || "present",
        });
      });
    });

    const res = await axios.post("/attendance/mark", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.value.add({
      severity: "success",
      summary: "Saqlandi",
      detail: `${res.data.length || 0} yozuv saqlandi`,
    });
  } catch (err) {
    console.error(err);
    toast.value.add({
      severity: "error",
      summary: "Xato",
      detail: err.response?.data?.message || err.message,
    });
  }
}
</script>
