<template>
  <DataTable 
    :value="data" 
    :loading="loading"
    stripedRows 
    paginator 
    :rows="10"
    :rowsPerPageOptions="[5, 10, 25, 50]"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    class="p-datatable-sm"
    responsiveLayout="scroll"
    :globalFilterFields="['student.name', 'student.lastname', 'group.name']"
    dataKey="id"
    :rowHover="true"
    :scrollable="true"
    scrollHeight="500px"
  >
    <template #empty>
      <EmptyState :type="type" />
    </template>

    <Column field="student" header="O'quvchi" sortable style="min-width: 250px">
      <template #body="slotProps">
        <StudentInfo :student="slotProps.data.student" />
      </template>
    </Column>

    <Column field="group.name" header="Guruh" sortable style="min-width: 150px">
      <template #body="slotProps">
        <GroupInfo :group="slotProps.data.group" />
      </template>
    </Column>

    <Column 
      :field="type === 'debtors' ? 'paymentStatus.remainingAmount' : 'paymentStatus.overpaidAmount'" 
      :header="type === 'debtors' ? 'Qarz miqdori' : 'Haqdorlik miqdori'" 
      sortable 
      style="min-width: 150px"
    >
      <template #body="slotProps">
        <AmountDisplay 
          :amount="type === 'debtors' ? slotProps.data.paymentStatus?.remainingAmount : slotProps.data.paymentStatus?.overpaidAmount"
          :type="type"
        />
      </template>
    </Column>

    <Column field="lastPaymentDate" header="Oxirgi to'lov" style="min-width: 150px">
      <template #body="slotProps">
        <PaymentDate :date="slotProps.data.lastPaymentDate" />
      </template>
    </Column>

    <Column header="Amallar" style="min-width: 120px; width: 120px">
      <template #body="slotProps">
        <ActionButtons 
          :type="type"
          @view-details="$emit('view-details', slotProps.data)"
          @send-message="$emit('send-message', slotProps.data)"
          @accept-payment="$emit('accept-payment', slotProps.data)"
          @refund-payment="$emit('refund-payment', slotProps.data)"
        />
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import EmptyState from './EmptyState.vue';
import StudentInfo from './StudentInfo.vue';
import GroupInfo from './GroupInfo.vue';
import AmountDisplay from './AmountDisplay.vue';
import PaymentDate from './PaymentDate.vue';
import ActionButtons from './ActionButtons.vue';

defineProps({
  data: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['debtors', 'haqdors'].includes(value)
  }
});

defineEmits(['view-details', 'send-message', 'accept-payment', 'refund-payment']);
</script>
