<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <Card class="mb-8 shadow-lg border-0 bg-gradient-to-r from-white to-blue-50">
        <template #content>
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="pi pi-credit-card text-white text-2xl"></i>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-gray-800 mb-1">Xarajatlar boshqaruvi</h1>
                <p class="text-gray-600">Moliyaviy xarajatlarni kuzatish va tahlil qilish</p>
              </div>
            </div>
            <div class="flex gap-3 w-full md:w-auto">
              <Button 
                @click="refreshData" 
                :loading="loading"
                icon="pi pi-refresh" 
                label="Yangilash"
                class="flex-1 md:flex-none"
                severity="info"
              />
              <Button 
                @click="showAddDialog = true" 
                icon="pi pi-plus" 
                label="Yangi xarajat"
                class="flex-1 md:flex-none"
                severity="success"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Expenses -->
        <Card class="shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <template #content>
            <div class="relative overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-400/20 to-pink-500/20 rounded-full -translate-y-4 translate-x-4"></div>
              <div class="relative z-10">
                <div class="flex justify-between items-start mb-4">
                  <div class="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                    <i class="pi pi-file text-white text-lg"></i>
                  </div>
                  <Tag value="Jami" severity="danger" class="text-xs" />
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">Jami xarajatlar</p>
                  <h2 class="text-2xl font-bold text-gray-800">{{ expenses.length }} ta</h2>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Total Amount -->
        <Card class="shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <template #content>
            <div class="relative overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full -translate-y-4 translate-x-4"></div>
              <div class="relative z-10">
                <div class="flex justify-between items-start mb-4">
                  <div class="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                    <i class="pi pi-dollar text-white text-lg"></i>
                  </div>
                  <Tag 
                    :value="`${monthlyGrowth > 0 ? '+' : ''}${monthlyGrowth}%`" 
                    :severity="monthlyGrowth > 0 ? 'danger' : 'success'" 
                    class="text-xs"
                  />
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">Umumiy summa</p>
                  <h2 class="text-2xl font-bold text-gray-800">{{ formatCurrency(totalAmount) }}</h2>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Last Expense -->
        <Card class="shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <template #content>
            <div class="relative overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full -translate-y-4 translate-x-4"></div>
              <div class="relative z-10">
                <div class="flex justify-between items-start mb-4">
                  <div class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <i class="pi pi-calendar text-white text-lg"></i>
                  </div>
                  <Tag value="So'nggi" severity="info" class="text-xs" />
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">Oxirgi xarajat</p>
                  <h2 class="text-lg font-bold text-gray-800">
                    {{ lastExpenseDate ? formatDate(lastExpenseDate) : 'Mavjud emas' }}
                  </h2>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Average Expense -->
        <Card class="shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <template #content>
            <div class="relative overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full -translate-y-4 translate-x-4"></div>
              <div class="relative z-10">
                <div class="flex justify-between items-start mb-4">
                  <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                    <i class="pi pi-chart-bar text-white text-lg"></i>
                  </div>
                  <Tag value="O'rtacha" severity="success" class="text-xs" />
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">O'rtacha xarajat</p>
                  <h2 class="text-lg font-bold text-gray-800">{{ formatCurrency(averageExpense) }}</h2>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Filters and Search -->
      <Card class="mb-6 shadow-lg border-0">
        <template #content>
          <div class="flex flex-col md:flex-row gap-4 items-center">
            <div class="flex-1 w-full md:w-auto">
              <span class="p-input-icon-left w-full">
                <InputText 
                  v-model="searchQuery" 
                  placeholder="Xarajatlarni qidirish..." 
                  class="w-full"
                />
              </span>
            </div>
            <div class="flex gap-3 w-full md:w-auto">
              <Calendar 
                v-model="dateRange" 
                selectionMode="range" 
                :manualInput="false"
                placeholder="Sana oralig'i"
                class="w-full md:w-64"
                showIcon
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Expenses Table -->
      <Card class="shadow-lg border-0">
        <template #content>
          <DataTable 
            :value="filteredExpenses"
            v-if="!loading"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            stripedRows
            responsiveLayout="scroll"
            currentPageReportTemplate="{first} dan {last} gacha {totalRecords} ta yozuvdan"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :globalFilterFields="['category', 'description']"
            class="custom-datatable"
          >
            <template #empty>
              <div class="text-center py-12">
                <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="pi pi-inbox text-4xl text-gray-400"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Xarajatlar topilmadi</h3>
                <p class="text-gray-500 mb-4">Hozircha hech qanday xarajat mavjud emas</p>
                <Button 
                  @click="showAddDialog = true"
                  icon="pi pi-plus" 
                  label="Birinchi xarajatni qo'shish"
                  severity="success"
                />
              </div>
            </template>
            <Column field="description" header="Izoh" class="min-w-60">
              <template #body="{ data }">
                <div>
                  <p class="text-gray-800 font-medium">{{ data.description || 'Izoh yo\'q' }}</p>
                  <p class="text-xs text-gray-500 mt-1">ID: {{ data.id }}</p>
                </div>
              </template>
            </Column>

            <Column field="amount" header="Summasi" sortable class="min-w-32">
              <template #body="{ data }">
                <div class="text-right">
                  <span class="text-lg font-bold text-red-600">
                    {{ formatCurrency(data.amount) }}
                  </span>
                </div>
              </template>
            </Column>

            <Column field="spentAt" header="Sana" sortable class="min-w-32">
              <template #body="{ data }">
                <div class="text-center">
                  <div class="text-sm font-medium text-gray-800">{{ formatDate(data.spentAt) }}</div>
                  <div class="text-xs text-gray-500">{{ formatTime(data.spentAt) }}</div>
                </div>
              </template>
            </Column>

            <Column header="Amallar" class="min-w-32">
              <template #body="{ data }">
                <div class="flex gap-2 justify-center">
                  <Button 
                    @click="editExpense(data)"
                    icon="pi pi-pencil" 
                    size="small"
                    severity="info"
                    outlined
                    v-tooltip="'Tahrirlash'"
                  />
                  <Button 
                    @click="deleteExpense(data.id)"
                    icon="pi pi-trash" 
                    size="small"
                    severity="danger"
                    outlined
                    v-tooltip="'Ochirish'"
                  />
                </div>
              </template>
            </Column>
          </DataTable>

          <!-- Loading State -->
          <div v-else class="p-8">
            <div class="space-y-4">
              <Skeleton height="60px" class="rounded-lg" />
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Skeleton height="40px" class="rounded" />
                <Skeleton height="40px" class="rounded" />
                <Skeleton height="40px" class="rounded" />
                <Skeleton height="40px" class="rounded" />
              </div>
              <div class="space-y-3">
                <Skeleton height="50px" class="rounded" v-for="i in 5" :key="i" />
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Add/Edit Dialog -->
    <Dialog 
      v-model:visible="showAddDialog" 
      modal 
      :header="editingExpense ? 'Xarajatni tahrirlash' : 'Yangi xarajat qo\'shish'"
      class="w-full max-w-md mx-4"
    >
      <div class="space-y-4 pt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Izoh</label>
          <Textarea 
            v-model="expenseForm.description" 
            placeholder="Xarajat haqida izoh..."
            rows="3"
            class="w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Summa</label>
          <InputNumber 
            v-model="expenseForm.amount" 
            mode="currency" 
            currency="UZS" 
            locale="uz-UZ"
            placeholder="0"
            class="w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sana</label>
          <Calendar 
            v-model="expenseForm.spentAt" 
            showTime 
            hourFormat="24"
            placeholder="Sana va vaqtni tanlang"
            class="w-full"
            showIcon
          />
        </div>
      </div>
      <template #footer>
        <div class="flex gap-2 justify-end">
          <Button 
            @click="showAddDialog = false"
            label="Bekor qilish" 
            severity="secondary"
            outlined
          />
          <Button 
            @click="saveExpense"
            :label="editingExpense ? 'Saqlash' : 'Qo\'shish'"
            severity="success"
            :loading="saving"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import Skeleton from 'primevue/skeleton'
import Tag from 'primevue/tag'
import axios from 'axios'

// Data
const expenses = ref([])
const loading = ref(true)
const saving = ref(false)
const showAddDialog = ref(false)
const editingExpense = ref(null)
const searchQuery = ref('')
const selectedCategory = ref(null)
const dateRange = ref(null)
const monthlyGrowth = ref(15.3)

// Form data
const expenseForm = ref({
  category: null,
  description: '',
  amount: null,
  spentAt: new Date()
})


// Computed properties
const totalAmount = computed(() =>
  expenses.value.reduce((sum, e) => sum + (e.amount || 0), 0)
)

const averageExpense = computed(() => {
  return expenses.value.length > 0 ? totalAmount.value / expenses.value.length : 0
})

const lastExpenseDate = computed(() => {
  if (expenses.value.length === 0) return null
  return [...expenses.value].sort((a, b) => new Date(b.spentAt) - new Date(a.spentAt))[0].spentAt
})

const filteredExpenses = computed(() => {
  let filtered = [...expenses.value]
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(expense => 
      expense.category?.toLowerCase().includes(query) ||
      expense.description?.toLowerCase().includes(query)
    )
  }
  
  // Category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(expense => expense.category === selectedCategory.value)
  }
  
  // Date range filter
  if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
    const startDate = new Date(dateRange.value[0])
    const endDate = new Date(dateRange.value[1])
    filtered = filtered.filter(expense => {
      const expenseDate = new Date(expense.spentAt)
      return expenseDate >= startDate && expenseDate <= endDate
    })
  }
  
  return filtered
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('uz-UZ', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  })
}

const formatTime = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit'
  })
}



const getExpenses = async () => {
  loading.value = true
  try {
    // Simulate API delay
    const res=await axios.get(`/expense`)
    expenses.value=res.data
  } catch (err) {
    console.error("Xarajatlarni olishda xatolik:", err)
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  getExpenses()
}


const editExpense = (expense) => {
  editingExpense.value = expense
  expenseForm.value = { ...expense }
  expenseForm.value.spentAt = new Date(expense.spentAt)
  showAddDialog.value = true
}

const deleteExpense = async (id) => {
  if (confirm('Bu xarajatni o\'chirishni xohlaysizmi?')) {
    expenses.value = expenses.value.filter(e => e.id !== id)
  }
}

const saveExpense = async () => {
  saving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingExpense.value) {
      // Update existing expense
      const index = expenses.value.findIndex(e => e.id === editingExpense.value.id)
      if (index !== -1) {
        expenses.value[index] = { ...expenseForm.value, id: editingExpense.value.id }
      }
    } else {
      // Add new expense
      const newExpense = {
        ...expenseForm.value,
        id: Date.now()
      }
      expenses.value.unshift(newExpense)
    }
    
    // Reset form
    expenseForm.value = {
      category: null,
      description: '',
      amount: null,
      spentAt: new Date()
    }
    editingExpense.value = null
    showAddDialog.value = false
  } catch (err) {
    console.error("Xarajatni saqlashda xatolik:", err)
  } finally {
    saving.value = false
  }
}

onMounted(getExpenses)
</script>

<style scoped>
:deep(.custom-datatable .p-datatable-thead > tr > th) {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

:deep(.custom-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f8fafc;
  transform: scale(1.01);
  transition: all 0.2s ease;
}

:deep(.custom-datatable .p-datatable-tbody > tr) {
  transition: all 0.2s ease;
}

:deep(.p-dropdown-panel) {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

:deep(.p-calendar-panel) {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Custom scrollbar */
:deep(.p-datatable-wrapper) {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

:deep(.p-datatable-wrapper::-webkit-scrollbar) {
  height: 6px;
}

:deep(.p-datatable-wrapper::-webkit-scrollbar-track) {
  background: #f1f5f9;
  border-radius: 3px;
}

:deep(.p-datatable-wrapper::-webkit-scrollbar-thumb) {
  background: #cbd5e1;
  border-radius: 3px;
}

:deep(.p-datatable-wrapper::-webkit-scrollbar-thumb:hover) {
  background: #94a3b8;
}
</style>