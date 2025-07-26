<template>
  <Card>
    <template #title>
      <div class="flex items-center space-x-2">
        <i class="pi pi-cog text-gray-500"></i>
        <span>Amallar</span>
      </div>
    </template>
    <template #content>
      <div class="space-y-2">
        <Button label="Maosh to'lash" icon="pi pi-plus" class="w-full p-button-success" size="small" @click="showAddSalaryDialog = true" />
        <!-- Qo‘shimcha tugmalar -->
      </div>
    </template>
  </Card>

  <!-- Maosh qo‘shish Dialog -->
  <Dialog v-model:visible="showAddSalaryDialog" header="Maosh qo‘shish" :modal="true" class="w-full max-w-md">
    <div class="space-y-4">
      <div class="flex flex-col">
        <label class="text-sm text-gray-600">Miqdor (UZS)</label>
        <InputNumber v-model="salaryForm.amount" inputClass="w-full" mode="currency" currency="UZS" locale="uz-UZ" />
      </div>
      <div>
        <label class="text-sm text-gray-600">Oy (masalan: 2025-07)</label>
        <InputText v-model="salaryForm.month" class="w-full" placeholder="YYYY-MM" />
      </div>
      <div>
        <label class="text-sm text-gray-600">Izoh (ixtiyoriy)</label>
        <InputText v-model="salaryForm.description" class="w-full" />
      </div>
    </div>

    <template #footer>
      <Button label="Bekor qilish" icon="pi pi-times" class="p-button-text" @click="showAddSalaryDialog = false" />
      <Button label="Saqlash" icon="pi pi-check" class="p-button-primary" @click="submitSalary" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'

const props = defineProps({
  teacherId: String,
  userId: String
})

const emit = defineEmits(['salary-added']) // ✅ SHU YERDA

const toast = useToast()
const showAddSalaryDialog = ref(false)

const salaryForm = ref({
  amount: null,
  month: '',
  description: ''
})

const submitSalary = async () => {
  try {
    if (!salaryForm.value.amount || !salaryForm.value.month) {
      toast.add({ severity: 'warn', summary: 'Ogohlantirish', detail: 'Miqdor va oy kiritilishi kerak', life: 3000 })
      return
    }

    await axios.post('/salaries', {
      teacherId: props.teacherId,
      userId: props.userId,
      amount: salaryForm.value.amount,
      month: salaryForm.value.month,
      description: salaryForm.value.description
    })

    toast.add({ severity: 'success', summary: 'Bajarildi', detail: 'Maosh qo‘shildi', life: 3000 })
    emit('salary-added') // ✅ emit qilish
    showAddSalaryDialog.value = false
    salaryForm.value = { amount: null, month: '', description: '' }

  } catch (err) {
    toast.add({ severity: 'error', summary: 'Xatolik', detail: err.response?.data?.message || 'Server xatoligi', life: 3000 })
  }
}
</script>

