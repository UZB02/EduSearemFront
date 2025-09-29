<template>
  <Dialog
    :visible="visible"
    :modal="true"
    :closable="false"
    :draggable="true"
    class="custom-dialog"
    :style="{ width: '500px' }"
    :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
  >
    <template #header>
      <div class="flex items-center gap-3 w-full">
        <div
          class="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center"
        >
          <i class="pi pi-wallet w-5 h-5 text-white"></i>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-800 m-0">To‘lov qilish</h2>
          <p class="text-sm text-gray-500 m-0">To‘lov ma'lumotlarini kiriting</p>
        </div>
      </div>
    </template>

    <div class="space-y-6 p-1">
      <div class="bg-gray-50 rounded-lg p-4 space-y-4">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700 flex items-center gap-1">
            To‘lov summasi <span class="text-red-500">*</span>
          </label>
          <InputNumber
            v-model="payment.amount"
            placeholder="Masalan: 200000"
            inputClass="w-full"
            class="w-full"
            :class="{ 'p-invalid': !payment.amount && showValidation }"
          />
          <small v-if="!payment.amount && showValidation" class="text-red-500">
            To‘lov summasi majburiy
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700 flex items-center gap-1">
            To‘lov turi <span class="text-red-500">*</span>
          </label>
          <Dropdown
            v-model="payment.method"
            :options="paymentMethods"
            optionLabel="label"
            optionValue="value"
            placeholder="Tanlang"
            class="w-full"
            :class="{ 'p-invalid': !payment.method && showValidation }"
          />
          <small v-if="!payment.method && showValidation" class="text-red-500">
            To‘lov turini tanlash majburiy
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Izoh</label>
          <Textarea
            v-model="payment.description"
            placeholder="Ixtiyoriy izoh..."
            class="w-full"
            rows="3"
            autoResize
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center w-full pt-4 border-t border-gray-200">
        <div class="text-sm text-gray-500">
          <span class="text-red-500">*</span> Majburiy maydonlar
        </div>
        <div class="flex gap-3">
          <Button
            label="Bekor qilish"
            icon="pi pi-times"
            severity="secondary"
            @click="$emit('cancel')"
            class="px-4 py-2"
          />
          <Button
            label="To‘lovni saqlash"
            icon="pi pi-check"
            @click="handleSave"
            :loading="loading"
            class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 border-green-500 hover:from-green-600 hover:to-green-700"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'

const props = defineProps({
  visible: Boolean,
  student: Object,
  loading: Boolean
})

const emit = defineEmits(['cancel', 'save'])

const showValidation = ref(false)
const payment = ref({
  amount: null,
  method: null,
  description: '',
})


watch(() => props.student, (newVal) => {
  payment.value.amount = newVal?.paymentStatus?.remainingAmount || 0
}, { immediate: true })
const paymentMethods = [
  { label: 'Naqd', value: 'cash' },
  { label: 'Karta orqali', value: 'card' },
  { label: 'Bank o‘tkazmasi', value: 'bank' },
]

const handleSave = () => {
  showValidation.value = true

  if (!payment.value.amount || !payment.value.method) {
    return
  }

  emit('save', payment.value)
}
</script>