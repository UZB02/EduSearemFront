<template>
  <div class="">
    <div class="container">
      <!-- Header Section -->
      <PageHeader 
        :search="search"
        @update:search="search = $event"
        @export="exportData"
        @refresh="fetchDebtors"
      />

      <!-- Summary Cards -->
      <SummaryCards 
        :total-debtors="totalDebtors"
        :total-debt-amount="totalDebtAmount"
        :total-haqdors="totalHaqdors"
        :total-haqdor-amount="totalHaqdorAmount"
      />

      <!-- Loading State -->
      <LoadingSpinner v-if="loading" />

      <!-- Content Tabs -->
      <DebtorsTabs 
        v-else
        :filtered-debtors="filteredDebtors"
        :filtered-haqdor="filteredHaqdor"
        :loading="loading"
        @view-details="viewDetails"
        @send-message="sendMessage"
        @accept-payment="acceptPayment"
        @refund-payment="refundPayment"
      />

      <!-- Detail Dialog -->
      <DetailDialog 
        v-model:visible="detailsVisible"
        :selected-record="selectedRecord"
        @accept-payment="acceptPayment"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import PageHeader from "@/components/Debtors/PageHeader.vue";
import SummaryCards from "@/components/Debtors/SummaryCards.vue";
import LoadingSpinner from "@/components/Debtors/LoadingSpinner.vue";
import DebtorsTabs from "@/components/Debtors/DebtorsTabs.vue";
import DetailDialog from "@/components/Debtors/DetailDialog.vue";
import api from "../../utils/api.js";

// State
const debtors = ref([]);
const loading = ref(true);
const search = ref("");
const detailsVisible = ref(false);
const selectedRecord = ref(null);

// Methods
const fetchDebtors = async () => {
  loading.value = true;
  try {
    const res = await api.get("/debtors/total");
    debtors.value = res.data;
  } catch (err) {
    console.error("Qarzdorlarni olishda xatolik:", err);
  } finally {
    loading.value = false;
  }
};

// Computed properties
const filteredDebtors = computed(() => {
  const term = search.value.toLowerCase();
  return debtors.value
    .filter(d => d.paymentStatus?.overallMessage === "Qarzdor")
    .filter(d => {
      const studentName = d.student ? `${d.student.name} ${d.student.lastname || ""}`.toLowerCase() : "";
      const groupName = d.group?.name?.toLowerCase() || "";
      return studentName.includes(term) || groupName.includes(term);
    });
});

const filteredHaqdor = computed(() => {
  const term = search.value.toLowerCase();
  return debtors.value
    .filter(d => d.paymentStatus?.overallMessage === "Haqdor")
    .filter(d => {
      const studentName = d.student ? `${d.student.name} ${d.student.lastname || ""}`.toLowerCase() : "";
      const groupName = d.group?.name?.toLowerCase() || "";
      return studentName.includes(term) || groupName.includes(term);
    });
});

const totalDebtors = computed(() => filteredDebtors.value.length);
const totalHaqdors = computed(() => filteredHaqdor.value.length);

const totalDebtAmount = computed(() => {
  return filteredDebtors.value.reduce((sum, debtor) => {
    return sum + (debtor.paymentStatus?.remainingAmount || 0);
  }, 0);
});

const totalHaqdorAmount = computed(() => {
  return filteredHaqdor.value.reduce((sum, haqdor) => {
    return sum + (haqdor.paymentStatus?.overpaidAmount || 0);
  }, 0);
});

// Action methods
const viewDetails = (record) => {
  selectedRecord.value = record;
  detailsVisible.value = true;
};

const sendMessage = (record) => {
  console.log('Xabar yuborish:', record);
  // Implement message sending logic
};

const acceptPayment = (record) => {
  console.log('To\'lov qabul qilish:', record);
  // Implement payment acceptance logic
};

const refundPayment = (record) => {
  console.log('To\'lovni qaytarish:', record);
  // Implement refund logic
};

const exportData = () => {
  console.log('Ma\'lumotlarni eksport qilish');
  // Implement export logic
};

// Lifecycle
onMounted(fetchDebtors);
</script>
