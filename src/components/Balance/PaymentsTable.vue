<template>
  <Card class="shadow-md border-0">
    <template #title>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800">To'lovlar</h2>
        <Button 
          icon="pi pi-refresh" 
          text 
          @click="$emit('refresh')" 
          :loading="isLoading"
          v-tooltip="'Yangilash'" 
        />
      </div>
    </template>

    <template #content>
      <DataTable
        :value="payments"
        :loading="isLoading"
        paginator
        :rows="10"
        stripedRows
        responsiveLayout="scroll"
        emptyMessage="Hozircha to'lovlar yo'q"
      >
     <Column header="O'quvchi" sortable>
  <template #body="{ data }">
    {{ data.studentId?.name 
        ? data.studentId.name + ' ' + data.studentId.lastname 
        : "O'quvchi o'chirilgan" }}
  </template>
</Column>

        <Column field="amount" header="Miqdor" sortable />
        <Column field="method" header="To'lov usuli" sortable />
        <Column field="paidAt" header="Sana" sortable>
  <template #body="{ data }">
    {{ data.paidAt ? formatDate(data.paidAt) : "—" }}
  </template>
</Column>

      </DataTable>
    </template>
  </Card>
</template>

<script setup>
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";

const props = defineProps({
  payments: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  formatDate: { type: Function, required: true }
});
</script>
