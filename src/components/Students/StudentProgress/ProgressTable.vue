<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import axios from 'axios'

// Props
const props = defineProps({
  studentId: {
    type: String,
    required: true,
  },
})

const progresses = ref([])
const loading = ref(false)

const fetchProgresses = async () => {
  loading.value = true
  console.log(props.studentId);
  try {
    const res = await axios.get(`/progress/${props.studentId}`)
    console.log(res.data);
    progresses.value = res.data
  } catch (err) {
    console.error('Progresslarni olishda xatolik:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchProgresses)

// Helper: Level ranglari
const levelSeverity = (level) => {
  switch (level) {
    case 'Past':
      return 'danger'
    case 'O‘rta':
      return 'warning'
    case 'Yuqori':
      return 'success'
    default:
      return 'info'
  }
}
</script>

<template>
  <!-- Enhanced card container with better shadows and styling -->
  <div class="bg-white rounded-3xl border border-gray-100 overflow-hidden">
    <!-- Enhanced table container with better spacing -->
    <div class="p-4">
      <DataTable
        :value="progresses"
        :loading="loading"
        stripedRows
        paginator
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        class="custom-table"
        removableSort
        responsiveLayout="scroll"
        :globalFilterFields="['subject', 'overallLevel', 'description']"
        emptyMessage="Ma'lumotlar topilmadi"
        :loadingIcon="'pi pi-spin pi-spinner'"
      >
        <!-- Enhanced date column with better formatting -->
        <Column field="date" header="📅 Sana" sortable class="min-w-32">
          <template #body="slotProps">
            <div class="flex flex-col">
              <span class="font-semibold text-gray-900">
                {{ new Date(slotProps.data.date).toLocaleDateString('uz-UZ') }}
              </span>
              <span class="text-xs text-gray-500">
                {{
                  new Date(slotProps.data.date).toLocaleDateString('uz-UZ', { weekday: 'short' })
                }}
              </span>
            </div>
          </template>
        </Column>

        <!-- Enhanced subject column with icon -->
        <Column field="subject" header="📚 Fan / Guruh" sortable class="min-w-48">
          <template #body="slotProps">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span class="text-blue-600 text-sm font-semibold">
                  {{ slotProps.data.subject?.charAt(0) }}
                </span>
              </div>
              <span class="font-medium text-gray-900">{{ slotProps.data.subject }}</span>
            </div>
          </template>
        </Column>

        <!-- Enhanced attendance column with progress bar -->
        <Column field="attendanceRate" header="👥 Davomat" sortable class="min-w-32">
          <template #body="slotProps">
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-gray-900">
                  {{ slotProps.data.attendanceRate }} ball
                </span>
              </div>
            </div>
          </template>
        </Column>

        <!-- Enhanced teacher feedback column with coin styling -->
        <Column field="teacherFeedback" header="⭐ O'qituvchi bahosi" sortable class="min-w-36">
          <template #body="slotProps">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span class="text-yellow-600 text-sm">🪙</span>
              </div>
              <span class="font-bold text-yellow-700">
                {{ slotProps.data.teacherFeedback }}
              </span>
              <span class="text-xs text-gray-500">coin</span>
            </div>
          </template>
        </Column>

        <!-- Enhanced level column with better tag styling -->
        <Column field="overallLevel" header="🎯 Daraja" sortable class="min-w-28">
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.overallLevel"
              :severity="levelSeverity(slotProps.data.overallLevel)"
              class="font-semibold px-3 py-1 text-sm"
            />
          </template>
        </Column>

        <!-- Enhanced description column with truncation -->
        <Column field="description" header="💬 Izoh" class="min-w-64">
          <template #body="slotProps">
            <div class="max-w-xs">
              <p class="text-sm text-gray-700 line-clamp-2" :title="slotProps.data.description">
                {{ slotProps.data.description }}
              </p>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
/* Enhanced custom styling for better visual appeal */
.custom-table {
  font-size: 0.875rem;
}

/* Custom DataTable styling */
:deep(.p-datatable) {
  border-radius: 0;
  border: none;
}

:deep(.p-datatable-header) {
  background: transparent;
  border: none;
  padding: 0;
}

:deep(.p-datatable-thead > tr > th) {
  background: #f8fafc;
  border: none;
  border-bottom: 2px solid #e2e8f0;
  color: #374151;
  font-weight: 600;
  padding: 1rem;
  font-size: 0.875rem;
}

:deep(.p-datatable-tbody > tr > td) {
  border: none;
  border-bottom: 1px solid #f1f5f9;
  padding: 1rem;
  vertical-align: middle;
}

:deep(.p-datatable-tbody > tr:hover) {
  background: #f8fafc;
}

:deep(.p-datatable-striped .p-datatable-tbody > tr:nth-child(odd)) {
  background: #fefefe;
}

:deep(.p-datatable-striped .p-datatable-tbody > tr:nth-child(odd):hover) {
  background: #f8fafc;
}

/* Paginator styling */
:deep(.p-paginator) {
  background: transparent;
  border: none;
  border-top: 1px solid #e2e8f0;
  padding: 1rem;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  border-radius: 0.5rem;
  margin: 0 0.125rem;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background: #3b82f6;
  border-color: #3b82f6;
}

/* Loading spinner styling */
:deep(.p-datatable-loading-overlay) {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
}

/* Tag styling enhancements */
:deep(.p-tag) {
  border-radius: 1rem;
  font-weight: 600;
  letter-spacing: 0.025em;
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive enhancements */
@media (max-width: 768px) {
  :deep(.p-datatable-thead > tr > th),
  :deep(.p-datatable-tbody > tr > td) {
    padding: 0.75rem 0.5rem;
    font-size: 0.8rem;
  }
}
</style>
