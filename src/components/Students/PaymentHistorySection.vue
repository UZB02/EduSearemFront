<template>
  <div class="rounded-2xl overflow-hidden">
    <div class="flex justify-between py-6 border-gray-200">
      <h2 class="text-xl font-semibold text-gray-800 flex items-center">
        <i class="pi pi-credit-card text-indigo-600 mr-2"></i>
        To'lov tarixi
      </h2>
      <button
        @click="$emit('add-payment')"
        class="inline-flex items-center cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <i class="pi pi-plus mr-2"></i>
        To'lov qo'shish
      </button>
    </div>
    <div class="">
      <StudentPaymentTable ref="paymentTableRef" :studentId="studentId"  />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import StudentPaymentTable from "./StudentPaymentTable.vue"

defineProps({ studentId: String })
defineEmits(["add-payment"])

const paymentTableRef = ref(null)

// ⚡️ asosiy parent chaqira olishi uchun ochib beramiz
defineExpose({
  refreshPayments: (id) => paymentTableRef.value.getPaymentsByStudentId(id)
})
</script>