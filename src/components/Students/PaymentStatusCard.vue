<template>
  <div class="bg-white rounded-lg shadow-sm p-4">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div class="flex-1">
        <!-- Umumiy holat -->
        <p class="text-gray-500 text-sm">Umumiy to'lov holati</p>
        <h3
          class="text-xl font-bold mt-1"
          :class="student.paymentStatus?.isPaid ? 'text-green-600' : 'text-red-600'"
        >
          {{ student.paymentStatus?.overallMessage || 'Nomaʼlum' }}
        </h3>
        <p class="text-sm text-gray-600 mt-1">
          To'langan: {{ formatCurrency(student.paymentStatus?.totalPaid || 0) }}
        </p>
        <p class="text-sm text-gray-600">
          Qolgan: {{ formatCurrency(student.paymentStatus?.remainingAmount || 0) }}
        </p>
        <p class="text-sm text-gray-600">
          Ortiqcha: {{ formatCurrency(student.paymentStatus?.overpaidAmount || 0) }}
        </p>

        <!-- Tugma Dialogni ochish uchun -->
        <button
          class="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-5"
          @click="$emit('show-monthly')"
        >
          <i class="pi pi-chart-line text-sm"></i>
          Oylik holatni ko'rsatish
        </button>
      </div>
      <!-- Icon -->
      <i
        class="pi pi-info-circle text-3xl mt-3 md:mt-0"
        :class="student.paymentStatus?.isPaid ? 'text-green-500' : 'text-red-500'"
      ></i>
    </div>
  </div>
</template>

<script setup>
defineProps({
  student: Object
})

defineEmits(['show-monthly'])

const formatCurrency = (value) => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
  }).format(value)
}
</script>