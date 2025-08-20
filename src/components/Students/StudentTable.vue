<template>
  <div class="p-6">
    <DataTable
      :value="students"
      ref="dt"
      :filters="filters"
      filterDisplay="menu"
      :loading="loading"
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

      <!-- ID Column -->
      <Column header="#" :style="{ width: '60px' }">
        <template #body="slotProps">
          <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <span class="text-sm font-semibold text-indigo-600">
              {{ slotProps.index + 1 }}
            </span>
          </div>
        </template>
      </Column>

      <!-- Student Info Column -->
      <Column header="O'quvchi ma'lumotlari" :style="{ minWidth: '250px' }">
        <template #body="slotProps">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
            >
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

      <!-- Contact Column -->
      <Column header="Aloqa" :style="{ minWidth: '180px' }">
        <template #body="slotProps">
          <div class="space-y-1">
            <a
              :href="`tel:${slotProps.data.phone}`"
              class="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              v-tooltip.top="'Qo\'ng\'iroq qilish'"
            >
              <i class="pi pi-phone mr-2 text-sm"></i>
              {{ slotProps.data.phone }}
            </a>
          </div>
        </template>
      </Column>

      <Column header="Ota-Ona Telefon raqami" :style="{ minWidth: '180px' }">
        <template #body="slotProps">
          <div class="space-y-1">
            <a
              :href="`tel:${slotProps.data.parentPhone}`"
              class="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              v-tooltip.top="'Qo\'ng\'iroq qilish'"
            >
              <i class="pi pi-phone mr-2 text-sm"></i>
              {{ slotProps.data.parentPhone }}
            </a>
          </div>
        </template>
      </Column>

      <!-- Date Column -->
      <Column header="Qo'shilgan sana" :style="{ minWidth: '150px' }">
        <template #body="slotProps">
          <div class="flex items-center text-gray-600">
            <i class="pi pi-calendar mr-2 text-sm"></i>
            <span class="text-sm">{{ formatDate(slotProps.data.createdAt) }}</span>
          </div>
        </template>
      </Column>

      <!-- Status Column -->
      <Column header="Holat" :style="{ width: '120px' }">
        <template #body="slotProps">
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="
              slotProps.data.paymentStatus?.isPaid
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            "
          >
            <i
              :class="
                slotProps.data.paymentStatus?.isPaid
                  ? 'pi pi-check-circle mr-1'
                  : 'pi pi-times-circle mr-1'
              "
            ></i>
            {{ slotProps.data.paymentStatus.overallMessage }}
          </span>
        </template>
      </Column>

      <!-- Actions Column -->
      <Column header="Amallar" :style="{ width: '120px' }">
        <template #body="slotProps">
          <div class="flex items-center">
            <Button
              icon="pi pi-ellipsis-v"
              class="p-button-text"
              @click="(event) => toggleMenu(event, slotProps.data)"
            />
            <Menu :model="menuItems" popup ref="menu" />
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
import Menu from 'primevue/menu'
import { formatDate } from '../../utils/FormatDate'

const props = defineProps({
  students: Array,
  filters: Object,
  loading: Boolean
})

const emit = defineEmits(['edit', 'delete', 'payment', 'message', 'view'])

const menu = ref(null)
const menuItems = ref([])

const toggleMenu = (event, student) => {
  menuItems.value = [
    { label: 'Batafsil', icon: 'pi pi-eye', command: () => emit('view', student) },
    { label: 'To‘lov', icon: 'pi pi-money-bill', command: () => emit('payment', student) },
    { label: 'Xabar yuborish', icon: 'pi pi-send', command: () => emit('message', student) },
    { label: 'Tahrirlash', icon: 'pi pi-pencil', command: () => emit('edit', student) },
    { label: "O'chirish", icon: 'pi pi-trash', command: () => emit('delete', student) }
  ]

  if (menu.value) menu.value.toggle(event)
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