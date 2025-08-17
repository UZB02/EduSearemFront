<template>
  <TabView class="shadow-xl rounded-xl overflow-hidden">
    <!-- Qarzdorlar Tab -->
    <TabPanel>
      <template #header>
        <div class="flex items-center gap-2">
          <i class="pi pi-minus-circle text-red-500"></i>
          <span>Qarzdorlar</span>
          <Badge :value="filteredDebtors.length" severity="danger" />
        </div>
      </template>
      
      <div class="p-6">
        <DebtorsTable 
          :data="filteredDebtors"
          :loading="loading"
          type="debtors"
          @view-details="$emit('view-details', $event)"
          @send-message="$emit('send-message', $event)"
          @accept-payment="$emit('accept-payment', $event)"
        />
      </div>
    </TabPanel>

    <!-- Haqdorlar Tab -->
    <TabPanel>
      <template #header>
        <div class="flex items-center gap-2">
          <i class="pi pi-plus-circle text-green-500"></i>
          <span>Haqdorlar</span>
          <Badge :value="filteredHaqdor.length" severity="success" />
        </div>
      </template>
      
      <div class="p-6">
        <DebtorsTable 
          :data="filteredHaqdor"
          :loading="loading"
          type="haqdors"
          @view-details="$emit('view-details', $event)"
          @send-message="$emit('send-message', $event)"
          @refund-payment="$emit('refund-payment', $event)"
        />
      </div>
    </TabPanel>
  </TabView>
</template>

<script setup>
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Badge from 'primevue/badge';
import DebtorsTable from './DebtorsTable.vue';

defineProps({
  filteredDebtors: {
    type: Array,
    required: true
  },
  filteredHaqdor: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  }
});

defineEmits(['view-details', 'send-message', 'accept-payment', 'refund-payment']);
</script>
