<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <Card class="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
      <template #content>
        <div class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Jami qarzdorlar</p>
              <p class="text-2xl font-bold text-red-600">{{ totalDebtors }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-minus-circle text-red-600 text-xl"></i>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card class="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
      <template #content>
        <div class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Jami qarz</p>
              <p class="text-2xl font-bold text-red-600">{{ formatCurrency(totalDebtAmount) }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-money-bill text-red-600 text-xl"></i>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card class="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
      <template #content>
        <div class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Jami haqdorlar</p>
              <p class="text-2xl font-bold text-green-600">{{ totalHaqdors }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-plus-circle text-green-600 text-xl"></i>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card class="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
      <template #content>
        <div class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Jami haqdorlik</p>
              <p class="text-2xl font-bold text-green-600">{{ formatCurrency(totalHaqdorAmount) }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-wallet text-green-600 text-xl"></i>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card';

defineProps({
  totalDebtors: {
    type: Number,
    required: true
  },
  totalDebtAmount: {
    type: Number,
    required: true
  },
  totalHaqdors: {
    type: Number,
    required: true
  },
  totalHaqdorAmount: {
    type: Number,
    required: true
  }
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
