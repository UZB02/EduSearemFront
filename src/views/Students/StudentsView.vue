<template>
  <div class="p-4 min-h-screen">
    <h1 class="text-2xl font-bold mb-6">Barcha Studentlar</h1>

    <!-- Search -->
    <div class="mb-4 flex items-center gap-2">
      <InputText
        v-model="searchQuery"
        placeholder="Student izlash..."
        class="w-64"
        @input="onSearch"
      />
      <Button label="Tozalash" icon="pi pi-times" @click="clearSearch" />
    </div>

    <!-- Table -->
    <div class="mb-6">
      <DataTable
        :value="students"
        :paginator="true"
        :rows="limit"
        :totalRecords="total"
        :lazy="true"
        @page="onPageChange"
        class="w-full"
        :loading="loading"
      >
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
        <Column header="Guruh">
          <template #body="slotProps">
            {{ slotProps.data.groupId?.name || "—" }}
          </template>
        </Column>
        <Column header="To'lov holati">
          <template #body="slotProps">
            <span
              :class="{
                'text-green-600 font-semibold': slotProps.data.paymentStatus?.isPaid,
                'text-red-600 font-semibold': !slotProps.data.paymentStatus?.isPaid,
              }"
            >
              {{ slotProps.data.paymentStatus?.message || "Ma'lumot yo'q" }}
            </span>
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
import  DataTable  from "primevue/datatable";
import  Column  from "primevue/column";
import  Card  from "primevue/card";
import  InputText  from "primevue/inputtext";
import  Button  from "primevue/button";

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
    // Search filtr
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      data = data.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.lastname.toLowerCase().includes(q) ||
          s.phone?.includes(q)
      );
    }
    students.value = data;
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
  page.value = 1; // search qilganda sahifa 1 ga qaytadi
  fetchStudents();
};

const clearSearch = () => {
  searchQuery.value = "";
  fetchStudents();
};

// Sana formatlash
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

onMounted(() => {
  fetchStudents();
});

// Agar searchQuery o'zgarsa avtomatik filter
watch(searchQuery, (newVal, oldVal) => {
  if (newVal === "") fetchStudents();
});
</script>

<style scoped>
/* Tailwind bilan maxsus o'zgarishlar qilinishi mumkin */
</style>
