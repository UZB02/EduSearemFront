<template>
  <div>
    <DataTable
      :value="group.students"
      ref="dt"
      :filters="filters"
      filterDisplay="menu"
      tableStyle="min-width: 50rem"
    >
      <template #header>
        <div class="flex justify-between items-center pb-4">
          <span class="p-input-icon-left  flex ">
              <InputText
              v-model="filters.global.value"
              placeholder="Qidirish"
              class="w-full"
              />
          </span>
          <Button icon="pi pi-download" label="Yuklab olish" @click="exportoExell()" />
        </div>
      </template>

      <!-- Tartib raqam (ID) -->
      <Column header="ID">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>

      <!-- Student ma'lumotlari -->
      <Column field="name" header="Ism" exportHeader="Ism" />
      <Column field="lastname" header="Familiya" exportHeader="Familiya" />
      
      <!-- Telefon raqam -->
      <Column header="Telefon" exportHeader="Telefon">
        <template #body="slotProps">
          <a :href="`tel:${slotProps.data.phone}`" class="text-blue-500" v-tooltip.top="'Qo\'ng\'iroq qilish'">
            {{ slotProps.data.phone }}
          </a>
        </template>
      </Column>

      <Column field="location" header="Yashash joyi" exportHeader="Yashash joyi" />

      <!-- Amallar -->
      <Column header="Amallar">
        <template #body="slotProps">
          <div class="flex items-center text-gray-500 gap-2">
            <i class="pi pi-pencil cursor-pointer" v-tooltip.top="'Tahrirlash'"></i>
            <i class="pi pi-trash cursor-pointer text-red-500" v-tooltip.top="'Oʻchirish'"></i>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

// 🔁 Excelga eksport qilish funksiyasini import qilish
import { exportToExcel } from '@/utils/formatToExcel'

const dt = ref()

const filters = ref({
  global: { value: null, matchMode: 'contains' },
})

const props = defineProps({
  group: Object
})

// 📦 Eksport qilish tugmasi uchun funksiya
const exportoExell = () => {
  const exportData = props.group.students.map((student, index) => ({
    ID: index + 1,
    Ism: student.name,
    Familiya: student.lastname,
    Telefon: student.phone,
    'Yashash joyi': student.location
  }))

  const groupName = props.group.name.replace(/\s+/g, '_') // bo‘sh joylarni _ bilan almashtirish
  const fileName = `${groupName}_${getTodayDate()}.xlsx`

  exportToExcel(exportData, fileName)
}
function getTodayDate() {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}` // Misol: 2025-07-22
}
</script>

