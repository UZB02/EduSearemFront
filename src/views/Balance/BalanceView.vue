<template>
  <div class="min-h-screen">
    <!-- Header -->
    <HeaderCard :loading="isLoading" @refresh="refreshData" />

    <!-- Filter -->
    <FilterCard @filter-change="onFilterChange" />

    <!-- Balance Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <IncomeCard :income="balanceData.income" :growth="incomeGrowth" />
      <OutcomeCard :outcome="balanceData.outcome" :growth="outcomeGrowth" />
      <BalanceCard :balance="balanceData.balance" :changePercent="balanceChangePercent" />
    </div>

    <!-- Loading -->
    <LoadingOverlay :visible="isLoading" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

// Components
import HeaderCard from "@/components/Balance/HeaderCard.vue";
import FilterCard from "@/components/Balance/FilterCard.vue";
import IncomeCard from "@/components/Balance/IncomeCard.vue";
import OutcomeCard from "@/components/Balance/OutcomeCard.vue";
import BalanceCard from "@/components/Balance/BalanceCard.vue";
import LoadingOverlay from "@/components/Balance/LoadingOverlay.vue";

const balanceData = ref({ income: 0, outcome: 0, balance: 0 });
const admin = JSON.parse(sessionStorage.getItem("admin"));
const isLoading = ref(false);
const incomeGrowth = ref(12.5);
const outcomeGrowth = ref(3.2);
const activeFilter = ref({});

const balanceChangePercent = computed(() => {
  return Math.abs(((balanceData.value.balance / (balanceData.value.income || 1)) * 100).toFixed(1));
});

const fetchBalance = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get("balance/real", { 
      params: { 
        userId: admin.id,
        ...activeFilter.value // filter parametrlari qo'shiladi
      }
    });
    balanceData.value = res.data;
  } catch (err) {
    console.error("Balansni olishda xatolik:", err);
  } finally {
    isLoading.value = false;
  }
};

const refreshData = async () => {
  try {
    await axios.post("/balance/sync", { userId: admin.id });
    await fetchBalance();
  } catch (err) {
    console.error("Balansni sinxronlashtirishda xatolik:", err);
  }
};

const onFilterChange = (filter) => {
  activeFilter.value = filter;
  fetchBalance();
};

onMounted(fetchBalance);
</script>
