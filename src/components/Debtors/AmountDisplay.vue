<template>
  <div class="text-right">
    <p class="text-lg font-bold m-0" :class="amountClass">
      {{ formatCurrency(amount || 0) }}
    </p>
    <p class="text-xs text-gray-500 m-0">so'm</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  amount: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    required: true
  }
});

const amountClass = computed(() => {
  return props.type === 'debtors' ? 'text-red-600' : 'text-green-600';
});

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
</script>
