<template>
  <div class="p-6 space-y-6">
    <SummaryCards :admin-id="adminId" />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ApplicationsChart :admin-id="adminId" />
      <PaymentsChart :admin-id="adminId" />
      <ExpensesChart :admin-id="adminId" />
      <BalanceChart :admin-id="adminId" />
    </div>
    <RecentActivity :admin-id="adminId" />
  </div>
</template>

<script setup>
import SummaryCards from '@/components/dashboard/SummaryCards.vue'
import ApplicationsChart from '@/components/dashboard/ApplicationsChart.vue'
import PaymentsChart from '@/components/dashboard/PaymentsChart.vue'
import ExpensesChart from '@/components/dashboard/ExpensesChart.vue'
import BalanceChart from '@/components/dashboard/BalanceChart.vue'
import RecentActivity from '@/components/dashboard/RecentActivity.vue'

// Admin ID ni lokal yoki auth contextdan olingan deb faraz qilamiz
const adminId =JSON.parse(sessionStorage.getItem('admin')).id // auth context orqali olingan bo'lishi kerak
</script>
