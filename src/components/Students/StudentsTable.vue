<template>
  <div class="bg-white rounded-2xl overflow-hidden">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center">
            <i class="pi pi-users mr-2"></i>
            O'quvchilar ro'yxati
          </h2>
          <p class="text-indigo-100 text-sm mt-1">
            Jami: {{ sortedStudents.length }} ta o'quvchi
          </p>
        </div>
        <div class="flex gap-3">
          <div class="relative">
            <i class="pi pi-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <InputText 
              v-model="filters.global.value" 
              placeholder="O'quvchi qidirish..." 
              class="pl-10 bg-white/90 border-0 rounded-lg shadow-sm"
            />
          </div>
          <Button 
            icon="pi pi-download" 
            label="Excel" 
            @click="exportToExcelHandler()"
            class="bg-white/20 hover:bg-white/30 border-white/30 text-white"
          />
        </div>
      </div>
    </div>

    <!-- Skeleton loading -->
    <div v-if="isLoading" class="p-6 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div v-for="n in 6" :key="n" class="rounded-lg border border-gray-200 p-4 animate-pulse space-y-4 bg-white shadow">
        <div class="h-4 w-1/3 bg-gray-300 rounded"></div>
        <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
        <div class="h-3 w-full bg-gray-100 rounded"></div>
        <div class="h-3 w-2/3 bg-gray-100 rounded"></div>
        <div class="h-3 w-1/4 bg-gray-100 rounded"></div>
      </div>
    </div>

    <!-- Student Table -->
    <div v-else class="p-6">
      <DataTable
        :value="sortedStudents"
        ref="dt"
        :filters="filters"
        filterDisplay="menu"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} dan {last} gacha, jami {totalRecords} ta"
        class="custom-table"
        :globalFilterFields="['name', 'lastname', 'phone', 'location']"
        stripedRows
        responsiveLayout="scroll"
      >
        <!-- Empty State -->
        <template #empty>
          <div class="text-center py-12">
            <i class="pi pi-users text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-lg font-medium text-gray-500 mb-2">O'quvchilar topilmadi</h3>
            <p class="text-gray-400">Qidiruv so'zini o'zgartiring yoki yangi o'quvchi qo'shing</p>
          </div>
        </template>

        <!-- ID -->
        <Column header="#" :style="{ width: '60px' }">
          <template #body="slotProps">
            <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span class="text-sm font-semibold text-indigo-600">{{ slotProps.index + 1 }}</span>
            </div>
          </template>
        </Column>

        <!-- Info -->
        <Column header="O'quvchi ma'lumotlari" :style="{ minWidth: '250px' }">
          <template #body="slotProps">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span class="text-white font-semibold text-sm">
                  {{ slotProps.data.name.charAt(0) }}{{ slotProps.data.lastname.charAt(0) }}
                </span>
              </div>
              <div>
                <div class="font-semibold text-gray-800">
                  {{ slotProps.data.name }} {{ slotProps.data.lastname }}
                </div>
                <div class="text-sm text-gray-500 flex items-center">
                  <i class="pi pi-map-marker mr-1"></i>
                  {{ slotProps.data.location }}
                </div>
              </div>
            </div>
          </template>
        </Column>

        <!-- Phone -->
        <Column header="Aloqa" :style="{ minWidth: '180px' }">
          <template #body="slotProps">
            <a :href="`tel:${slotProps.data.phone}`" class="flex items-center text-blue-600 hover:text-blue-800">
              <i class="pi pi-phone mr-2 text-sm"></i>{{ slotProps.data.phone }}
            </a>
          </template>
        </Column>

        <!-- Date -->
        <Column header="Qo'shilgan sana" :style="{ minWidth: '150px' }">
          <template #body="slotProps">
            <div class="flex items-center text-gray-600">
              <i class="pi pi-calendar mr-2 text-sm"></i>
              <span class="text-sm">{{ formatDate(slotProps.data.createdAt) }}</span>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { exportToExcel } from '@/utils/formatToExcel'
import { formatDate } from '@/utils/FormatDate'

const props = defineProps({ group: Object })
const dt = ref()
const filters = ref({ global: { value: null, matchMode: 'contains' } })
const isLoading = ref(true)

// 1. Computed: sort students
const sortedStudents = computed(() =>
  [...(props.group.students || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
)

// 2. Watch for group data to finish loading
watch(
  () => props.group.students,
  () => {
    isLoading.value = false
  },
  { immediate: true }
)

// 3. Export
const exportToExcelHandler = () => {
  const exportData = sortedStudents.value.map((student, index) => ({
    ID: index + 1,
    Ism: student.name,
    Familiya: student.lastname,
    Telefon: student.phone,
    'Yashash joyi': student.location,
    "Qo'shilgan sanasi": formatDate(student.createdAt)
  }))
  const today = new Date()
  const fileName = `${props.group.name}_${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}.xlsx`
  exportToExcel(exportData, fileName)
}
</script>

<style scoped>
:deep(.custom-table .p-datatable-header) {
  display: none;
}
:deep(.custom-table .p-datatable-thead > tr > th) {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  color: #475569;
  font-weight: 600;
  padding: 1rem;
}
:deep(.custom-table .p-datatable-tbody > tr > td) {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
}
:deep(.custom-table .p-datatable-tbody > tr:hover) {
  background: #f8fafc;
}
:deep(.p-paginator) {
  background: #f8fafc;
  border: none;
  border-top: 1px solid #e2e8f0;
  padding: 1rem;
}
</style>
