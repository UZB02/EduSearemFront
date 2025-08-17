<template>
  <div class="flex justify-center gap-2">
    <Button 
      icon="pi pi-eye" 
      class="p-button-rounded p-button-text p-button-sm"
      v-tooltip.left="'Batafsil'"
      @click="$emit('view-details')"
    />
    <Button 
      icon="pi pi-send" 
      class="p-button-rounded p-button-text p-button-sm"
      v-tooltip.left="'Xabar yuborish'"
      @click="$emit('send-message')"
    />
    <Button 
      v-if="type === 'debtors'"
      icon="pi pi-money-bill" 
      class="p-button-rounded p-button-text p-button-sm p-button-success"
      v-tooltip.left="'To\'lov qabul qilish'"
      @click="$emit('accept-payment')"
    />
    <Button 
      v-else
      icon="pi pi-undo" 
      class="p-button-rounded p-button-text p-button-sm p-button-warning"
      v-tooltip.left="'Qaytarish'"
      @click="$emit('refund-payment')"
    />
  </div>
</template>

<script setup>
import Button from 'primevue/button';

defineProps({
  type: {
    type: String,
    required: true
  }
});

defineEmits(['view-details', 'send-message', 'accept-payment', 'refund-payment']);
</script>
