<template>
  <div class="p-6 shadow-md bg-white rounded-md">
    <h2 class="text-2xl font-bold mb-4">Guruh Statistikasi</h2>

    <!-- Filterlar: PrimeVue Input va Dropdown -->
    <div class="flex flex-wrap gap-4 mb-6 items-end">
      <div class="flex flex-col w-60">
        <label class="mb-1 text-sm font-medium">Guruh ID</label>
        <InputText v-model="groupId" placeholder="Guruh ID kiriting" />
      </div>

      <div class="flex flex-col w-60">
        <label class="mb-1 text-sm font-medium">Statistika turi</label>
        <Dropdown v-model="type" :options="typeOptions" optionLabel="label" optionValue="value" />
      </div>

      <div class="flex flex-col w-60" v-if="type !== 'weekly'">
        <label class="mb-1 text-sm font-medium">Yil</label>
        <InputNumber v-model="year" :min="2000" :max="2100" showButtons />
      </div>

      <div class="flex flex-col w-60" v-if="type === 'monthly'">
        <label class="mb-1 text-sm font-medium">Oy</label>
        <InputNumber v-model="month" :min="1" :max="12" showButtons />
      </div>
    </div>

    <!-- Diagramma -->
    <Chart v-if="chartData" :type="'bar'" :data="chartData" :options="chartOptions" class="mb-6" />
    <p v-else class="text-gray-500">Ma'lumot mavjud emas</p>

    <!-- DataTable -->
    <DataTable v-if="statsList.length" :value="statsList" :paginator="true" :rows="10" class="mt-4">
      <Column field="name" header="O‘quvchi" />
      <Column field="attendanceScore" header="Davomat balli" />
      <Column field="teacherFeedback" header="O‘qituvchi bahosi" />
      <Column field="totalScore" header="Yig‘indisi" />
      <Column field="level" header="Daraja" />
    </DataTable>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import axios from "axios";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Chart from "primevue/chart";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";

// Filterlar
const groupId = ref("68a6de9bbacaf2ae7020afba");
const type = ref("weekly"); // weekly, monthly, yearly
const year = ref(new Date().getFullYear());
const month = ref(new Date().getMonth() + 1);

const typeOptions = [
  { label: "Haftalik", value: "weekly" },
  { label: "Oylik", value: "monthly" },
  { label: "Yillik", value: "yearly" },
];

// Ma'lumotlar
const statsList = ref([]);
const chartData = ref(null);

// Statistika olish
const loadStats = async () => {
  if (!groupId.value) return;

  try {
    const res = await axios.get("/progress/group/stats", {
      params: { groupId: groupId.value, type: type.value, year: year.value, month: month.value },
    });
    console.log(res.data);
    statsList.value = res.data;

    chartData.value = {
      labels: res.data.map(s => s.studentName),
      datasets: [
        { label: "Davomat balli", data: res.data.map(s => s.attendanceScore), backgroundColor: "#42A5F5" },
        { label: "O‘qituvchi bahosi", data: res.data.map(s => s.teacherFeedback), backgroundColor: "#FFA726" },
        { label: "Yig‘indisi", data: res.data.map(s => s.totalScore), backgroundColor: "#66BB6A" },
      ],
    };
  } catch (err) {
    console.error("Statistika olishda xatolik:", err);
    statsList.value = [];
    chartData.value = null;
  }
};

// Chart options
const chartOptions = {
  responsive: true,
  plugins: { legend: { position: "top" }, tooltip: { mode: "index", intersect: false } },
  scales: { x: { stacked: false }, y: { stacked: false, beginAtZero: true, max: 100 } },
};

// Avtomatik yuklash har safar filter o'zgarganda
watch([groupId, type, year, month], loadStats, { immediate: true });
</script>

<style scoped>
/* Qo‘shimcha Tailwind stylinglar shu yerda qo‘shilishi mumkin */
</style>
