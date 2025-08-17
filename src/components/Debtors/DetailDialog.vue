<template>
  <Dialog 
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :style="{width: '500px'}" 
    header="To'lov tafsilotlari" 
    :modal="true"
    :closable="true"
    :draggable="false"
  >
    <div v-if="selectedRecord" class="space-y-4">
      <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <Avatar 
          :label="getInitials(selectedRecord.student)"
          shape="circle"
          size="xlarge"
          :style="{ backgroundColor: getAvatarColor(selectedRecord.student?.name) }"
        />
        <div>
          <h3 class="text-xl font-semibold text-gray-800 m-0">
            {{ selectedRecord.student?.name }} {{ selectedRecord.student?.lastname }}
          </h3>
          <p class="text-sm text-gray-500 m-0">
            <i class="pi pi-users mr-1"></i> {{ selectedRecord.group?.name }}
          </p>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="p-3 bg-red-50 rounded-lg" v-if="selectedRecord.paymentStatus?.remainingAmount > 0">
          <p class="text-sm text-red-600 font-medium m-0">Qarz miqdori</p>
          <p class="text-xl font-bold text-red-700 m-0 mt-1">
            {{ formatCurrency(selectedRecord.paymentStatus.remainingAmount) }}
          </p>
        </div>
        
        <div class="p-3 bg-green-50 rounded-lg" v-if="selectedRecord.paymentStatus?.overpaidAmount > 0">
          <p class="text-sm text-green-600 font-medium m-0">Haqdorlik miqdori</p>
          <p class="text-xl font-bold text-green-700 m-0 mt-1">
            {{ formatCurrency(selectedRecord.paymentStatus.overpaidAmount) }}
          </p>
        </div>
        
        <div class="p-3 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-600 font-medium m-0">To'langan summa</p>
          <p class="text-xl font-bold text-blue-700 m-0 mt-1">
            {{ formatCurrency(selectedRecord.paymentStatus?.totalPaid || 0) }}
          </p>
        </div>
        
        <div class="p-3 bg-purple-50 rounded-lg">
          <p class="text-sm text-purple-600 font-medium m-0">Umumiy summa</p>
          <p class="text-xl font-bold text-purple-700 m-0 mt-1">
            {{ formatCurrency(selectedRecord.paymentStatus?.totalAmount || 0) }}
          </p>
        </div>
      </div>
      
      <div class="flex justify-end gap-2 pt-4">
        <Button 
          label="Yopish" 
          class="p-button-text" 
          @click="$emit('update:visible', false)"
        />
        <Button 
          label="To'lov qabul qilish" 
          icon="pi pi-money-bill"
          class="p-button-success"
          @click="$emit('accept-payment', selectedRecord)"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';

defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  selectedRecord: {
    type: Object,
    default: null
  }
});

defineEmits(['update:visible', 'accept-payment']);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getInitials = (student) => {
  if (!student) return '';
  return (student.name?.charAt(0) || '') + (student.lastname?.charAt(0) || '');
};

const getAvatarColor = (name) => {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];
  
  if (!name) return colors[0];
  const index = name.length % colors.length;
  return colors[index];
};
</script>
