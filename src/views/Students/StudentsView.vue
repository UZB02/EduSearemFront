<template>
  <div class="p-2 min-h-screen">
    <h1 class="text-2xl font-bold mb-6">Barcha Studentlar</h1>

    <!-- Search -->
   <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
  
  <!-- Search + Clear -->
  <div class="flex flex-col gap-2 w-full md:w-auto sm:flex-row sm:items-center">
    <InputText
      v-model="searchQuery"
      placeholder="Student izlash... (Ism, Familiya, Telefon, To'lov holati)"
      class="w-full sm:w-64"
      @input="onSearch"
    />
    <Button
      label="Tozalash"
      icon="pi pi-times"
      class="w-full sm:w-auto"
      @click="clearSearch"
    />
  </div>

  <!-- Export -->
  <Button
    icon="pi pi-download"
    size="small"
    label="Excel"
    class="w-full sm:w-auto bg-white/20 hover:bg-white/30 border-white/30 text-white"
    @click="exportToExcelHandler"
  />

</div>


    <!-- Table -->
    <div class="mb-6">
      <DataTable
        :value="students"
        :paginator="true"
        :rows="limit"
        :totalRecords="total"
        @page="onPageChange"
        class="w-full"
        :loading="loading"
      >
        <!-- Clickable Name -->
        <Column header="Ism" sortable>
          <template #body="slotProps">
            <span
              class="cursor-pointer text-blue-600 hover:underline"
              @click="$router.push(`/group/${slotProps.data.groupId?._id}/student/${slotProps.data._id}`)"
            >
              {{ slotProps.data.name }}
            </span>
          </template>
        </Column>

        <Column field="lastname" header="Familiya" sortable></Column>
        <Column field="phone" header="Telefon"></Column>

        <!-- Group -->
        <Column header="Guruh">
          <template #body="slotProps">
            {{ slotProps.data.groupId?.name || "—" }}
          </template>
        </Column>

        <!-- Payment Status -->
        <Column header="To'lov holati">
          <template #body="slotProps">
            <span
              v-if="slotProps.data.paymentStatus"
              :class="{
                'text-green-600 font-semibold': slotProps.data.paymentStatus.isPaid,
                'text-red-600 font-semibold': !slotProps.data.paymentStatus.isPaid
              }"
            >
              {{ slotProps.data.paymentStatus.overallMessage }}
            </span>
            <div
              v-if="slotProps.data.paymentStatus && !slotProps.data.paymentStatus.isPaid"
              class="text-sm text-gray-500"
            >
              Qoldiq: {{formatNumber(slotProps.data.paymentStatus.remainingAmount) }} UZS
            </div>
          </template>
        </Column>

        <Column field="createdAt" header="Qo'shilgan sana" sortable>
          <template #body="slotProps">
            {{ formatDate(slotProps.data.createdAt) }}
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import api from "@/utils/api.js";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { exportToExcel } from '@/utils/formatToExcel.js'

const students = ref([]);
const total = ref(0);
const page = ref(1);
const limit = ref(10);
const loading = ref(false);
const searchQuery = ref("");

// AdminId sessionStorage orqali olinadi
const adminId = JSON.parse(sessionStorage.getItem("admin"))?.id;

// API chaqiruv
const fetchStudents = async () => {
  if (!adminId) return console.error("Admin ID topilmadi");
  loading.value = true;
  try {
    const res = await api.get(
      `/students/${adminId}?page=${page.value}&limit=${limit.value}`
    );

    let data = res.data.students;
console.log(data);
    // Search filtr (Name, Lastname, Phone, Payment Status)
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      data = data.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.lastname.toLowerCase().includes(q) ||
          s.phone?.includes(q) ||
          s.paymentStatus?.overallMessage.toLowerCase().includes(q)
      );
    }

    students.value = [...data]; // reactive array
    total.value = res.data.total;
  } catch (error) {
    console.error("Studentlarni olishda xatolik:", error);
  } finally {
    loading.value = false;
  }
};

// Pagination
const onPageChange = (event) => {
  page.value = event.page + 1; // PrimeVue paginator 0-based
  limit.value = event.rows;
  fetchStudents();
};

// Search
const onSearch = () => {
  page.value = 1;
  fetchStudents();
};

const clearSearch = () => {
  searchQuery.value = "";
  fetchStudents();
};
const formatMoney = (value = 0) =>
  Number(value).toLocaleString('uz-UZ') + " so'm";


// Sana formatlash
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

const exportToExcelHandler = () => {
  const exportData = students.value.map((item, index) => ({
    ID: index + 1,
    Ism: item.name,
    Familiya: item.lastname,
    Telefon: item.phone || '—',
    "Ota-ona telefoni": item.parentPhone || '—',
    Hudud: item.location || '—',
    Guruh: item.groupId?.name || '—',
    Tavsif: item.description || '—',

   "To‘langan jami": formatMoney(item.paymentStatus?.totalPaid),
"To‘lanishi kerak": formatMoney(item.paymentStatus?.shouldPayTotal),
"Qolgan qarz": formatMoney(item.paymentStatus?.remainingAmount),
"Ortiqcha to‘lov": formatMoney(item.paymentStatus?.overpaidAmount),


    "To‘lov oylari":
  item.paymentStatus?.months?.length
    ? item.paymentStatus.months
        .map(
          (m) =>
            `${m.month} - ${m.totalPaid.toLocaleString()} so'm (${m.message})`
        )
        .join(', ')
    : 'Yo‘q',


    "Qo‘shilgan sana": formatDate(item.createdAt),
  }))

  const fileName = `Oquvchilar_${getTodayDate()}.xlsx`
  exportToExcel(exportData, fileName)
}


const getTodayDate = () => {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

onMounted(() => {
  fetchStudents();
});

const formatNumber = (num) => new Intl.NumberFormat("uz-UZ").format(num);

// Search query o'zgarsa
watch(searchQuery, (newVal) => {
  if (newVal === "") fetchStudents();
});
</script>

<style scoped>
/* Tailwind bilan maxsus o'zgarishlar qilinishi mumkin */
</style>
