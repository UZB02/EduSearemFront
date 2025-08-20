<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    header="Oylik to'lov holatlari"
    modal
    :closable="true"
    :style="{ width: '550px' }"
    :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
  >
    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-200 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-3 py-2 text-left">Oy</th>
            <th class="px-3 py-2 text-left">Kurs to'lovi</th>
            <th class="px-3 py-2 text-left">Holat</th>
            <th class="px-3 py-2 text-left">To'langan</th>
            <th class="px-3 py-2 text-left">Qolgan</th>
            <th class="px-3 py-2 text-left">Ortiqcha</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(month, index) in student.paymentStatus?.months || []"
            :key="index"
            :class="{
              'bg-green-100': month.message === 'To\'langan' || month.message === 'Haqdor',
              'bg-red-100': month.message === 'Qarzdor',
            }"
            class="border-t border-gray-200"
          >
            <td class="px-3 py-2">{{ month.month }}</td>
            <td class="px-3 py-2">{{ formatCurrency(month.kursFee) }}</td>
            <td class="px-3 py-2">{{ month.message }}</td>
            <td class="px-3 py-2">{{ formatCurrency(month.totalPaid) }}</td>
            <td class="px-3 py-2">{{ formatCurrency(month.remainingAmount) }}</td>
            <td class="px-3 py-2">{{ formatCurrency(month.overpaidAmount) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'

const props = defineProps({
  visible: Boolean,
  student: Object
})

const emit = defineEmits(['update:visible'])

const formatCurrency = (value) => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
  }).format(value ?? 0)
}
</script>
