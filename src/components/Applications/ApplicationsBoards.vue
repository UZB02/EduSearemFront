<template>
  <div class="bg-gradient-to-br p-4 sm:p-1">
    <div class="">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Arizalar bo'limi</h1>
          <p class="text-gray-600">Vazifalarni boshqaring va jarayonni kuzatib boring</p>
        </div>

        <!-- Yangi ustun qo'shish -->
        <div class="flex items-center gap-2 bg-white rounded-lg shadow-sm p-3 ">
          <input
            v-model="newColumnName"
            placeholder="Ustun nomi kiriting..."
            class="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[200px]"
            @keyup.enter="addColumn"
          />
          <button
            @click="addColumn"
            :disabled="!newColumnName.trim()"
            class="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md px-4 py-2 hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <i class="pi pi-plus"></i>
            Ustun qo'shish
          </button>
        </div>
      </div>

      <!-- Kanban Board -->
      <div class="flex gap-6 overflow-x-auto md:flex-row flex-col pb-4">
        <div
          v-for="(column, columnIndex) in columns"
          :key="column._id"
          class="bg-red h-auto rounded-xl shadow-sm border border-gray-100 p-4 w-80 flex-shrink-0 transition-all duration-200 hover:shadow-md"
          @dragover.prevent
          @drop="onDrop(column._id)"
          @dragenter.prevent="onDragEnter(column._id)"
          @dragleave.prevent="onDragLeave(column._id)"
          :class="{ 'ring-2 ring-blue-300 bg-blue-50': dragOverColumn === column._id }"
        >
          <!-- Column Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" :class="getColumnColor(columnIndex)"></div>
              <h2 class="text-lg font-semibold text-gray-800">{{ column.name }}</h2>
              <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                {{ column.tasks.length }}
              </span>
            </div>
            <i class="pi pi-cog cursor-pointer" @click="deleteColumn(column._id)"></i>
          </div>

          <!-- Tasks -->
          <div class="space-y-3 mb-4 min-h-[100px]">
            <div
              v-for="task in column.tasks"
              :key="task.id"
              class="bg-gradient-to-r from-white to-gray-300 rounded-lg p-3 cursor-move border border-gray-100 hover:shadow-md transition-all duration-200 group"
              draggable="true"
              @dragstart="onDragStart(task, column._id)"
              :class="{ 'opacity-50 scale-95': draggedTask?.id === task.id }"
            >
              <div class="flex items-start justify-between">
                <div class="flex flex-col gap-2">
                  <p class="text-sm font-medium flex-1">
                    {{ task.name }} {{ task.lastname }}
                  </p>
                  <div class="text-gray-700 flex gap-2">
                    <span class="flex items-center text-sm">
                      <i class="pi pi-phone text-sm"></i> {{ task.phone }}
                    </span>
                    <span class="flex items-center text-sm">
                      <i class="pi pi-map-marker text-sm"></i> {{ task.location }}
                    </span>
                  </div>
                </div>
                <i class="pi pi-trash opacity-0 cursor-pointer group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200 ml-2" @click="deleteTask(column._id, task.id)"></i>
                <i class="pi pi-info opacity-0 cursor-pointer group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200 ml-2" @click="deleteTask(column._id, task.id)"></i>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <div class="w-2 h-2 rounded-full" :class="getColumnColor(columnIndex)"></div>
                <span class="text-xs text-gray-500">{{ formatDate(task.createdAt) }}</span>
              </div>
            </div>
          </div>
          <button
            @click="addModalToogle(column._id)"
            class="w-full bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 text-white rounded-lg px-3 py-2 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <i class="pi pi-plus"></i>
            Vazifa qo'shish
          </button>
        </div>

        <!-- Empty state agar ustunlar bo'lmasa -->
        <div v-if="columns.length === 0" class="flex items-center justify-center w-full h-64">
          <div class="text-center">
            <h3 class="text-lg font-medium text-gray-600 mb-2">Ustunlar yo'q</h3>
            <p class="text-gray-500 text-sm">
              Birinchi ustun qo'shish uchun yuqoridagi tugmani bosing
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Begin Add Modal -->
  <Dialog
    v-model:visible="addmodalvisible"
    :modal="true"
    :closable="true"
    :draggable="false"
    class="custom-dialog"
    :style="{ width: '600px' }"
    :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
  >
    <!-- Custom Header -->
    <template #header>
      <div class="flex items-center gap-3 w-full">
        <div
          class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center"
        >
        <i class="pi pi-user-plus w-5 h-5 text-white"></i>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-800 m-0">Yangi ariza qo'shish</h2>
          <p class="text-sm text-gray-500 m-0">Ariza beruvchi ma'lumotlarini kiriting</p>
        </div>
      </div>
    </template>

    <!-- Form Content -->
    <div class="space-y-6 p-1">
      <!-- Shaxsiy ma'lumotlar bo'limi -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <i class="pi pi-user w-5 h-5 text-blue-500"></i>
          Shaxsiy ma'lumotlar
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-1">
              Ism <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="newApplicant.name"
              placeholder="Ismingizni kiriting"
              class="w-full"
              :class="{ 'p-invalid': !newApplicant.name && showValidation }"
            />
            <small v-if="!newApplicant.name && showValidation" class="text-red-500">
              Ism kiritish majburiy
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-1">
              Familiya <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="newApplicant.lastname"
              placeholder="Familiyangizni kiriting"
              class="w-full"
              :class="{ 'p-invalid': !newApplicant.lastname && showValidation }"
            />
            <small v-if="!newApplicant.lastname && showValidation" class="text-red-500">
              Familiya kiritish majburiy
            </small>
          </div>
        </div>
      </div>

      <!-- Aloqa ma'lumotlari bo'limi -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <i class="pi pi-phone w-5 h-5 text-green-500"></i>
          Aloqa ma'lumotlari
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Telefon raqami</label>
            <InputText
              v-model="newApplicant.phone"
              placeholder="+998 90 123 45 67"
              class="w-full"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Manzil</label>
            <InputText
              v-model="newApplicant.location"
              placeholder="Yashash manzili"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Ta'lim ma'lumotlari bo'limi -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <i class="pi pi-briefcase w-5 h-5 text-purple-500"></i>
          Ta'lim ma'lumotlari
        </h3>

        <div class="flex flex-col w-full gap-2">
          <label class="text-sm font-medium text-gray-700">Guruh</label>
          <select
            id="gurup"
            v-model="newApplicant.gurup"
            class="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option disabled value="">Guruhni tanlang</option>
            <option v-for="option in gurupOptions" :key="option.id" :value="option.name">
              {{ option.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Qo'shimcha ma'lumotlar bo'limi -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <i class="pi pi-clipboard w-5 h-5 text-orange-500"></i>
          Qo'shimcha ma'lumotlar
        </h3>

        <div class="space-y-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Izoh</label>
            <Textarea
              v-model="newApplicant.description"
              placeholder="Qo'shimcha ma'lumotlar yoki izohlar..."
              class="w-full"
              rows="3"
              autoResize
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Mas'ul admin</label>
            <InputText
              v-model="newApplicant.admin"
              placeholder="Admin ismini kiriting"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Footer -->
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
            @click="addmodalvisible = false"
            class="px-4 py-2"
          />
          <Button
            label="Saqlash"
            icon="pi pi-check"
            @click="addTask()"
            :loading="isLoading"
            class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 border-blue-500 hover:from-blue-600 hover:to-blue-700"
          />
        </div>
      </div>
    </template>
  </Dialog>
  <!-- End Add Modal -->
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'

let nextColumnId = 4
const admin = JSON.parse(sessionStorage.getItem('admin'))// o'zgaruvchini haqiqiy admin id bilan almashtiring

const newColumnName = ref('')
const draggedTask = ref(null)
const draggedFromColumnId = ref(null)
const dragOverColumn = ref(null)
const columnID = ref(null)
const addmodalvisible = ref(false)
const showValidation = ref(false)
const isLoading = ref(false)

const columns = ref([])

const newApplicant = ref({
  name: 'Alisher',
  lastname: 'Sobirov',
  phone: '+998974589652',
  location: 'Namangan',
  gurup: 'A1+',
  status: '',
  description: 'Sertefikat olmoqchi',
  admin: admin.id,
})

const gurupOptions = [
  { id: 1, name: 'A1+' },
  { id: 2, name: 'A2+' },
  { id: 3, name: 'A3+' },
  { id: 4, name: 'A4+' },
]

onMounted(async () => {
  await fetchColumns()
})

async function fetchColumns() {
  const colRes = await axios.get(`/columns/${admin.id}`)
  console.log(colRes);
  const appRes = await axios.get(`/applications/${admin.id}`)
  columns.value = colRes.data.map((col) => ({
    ...col,
    tasks: appRes.data.filter((app) => app.columnId === col._id),
  }))
}

const addModalToogle = (columnId) => {
  addmodalvisible.value = true
  columnID.value = columnId
  console.log(columnID.value);
}

function onDragStart(task, columnId) {
  draggedTask.value = task
  draggedFromColumnId.value = columnId
}

function onDragEnter(columnId) {
  dragOverColumn.value = columnId
}

function onDragLeave() {
  dragOverColumn.value = null
}

async function onDrop(targetColumnId) {
  if (!draggedTask.value) return

  const fromColumn = columns.value.find((col) => col._id === draggedFromColumnId.value)
  const toColumn = columns.value.find((col) => col._id === targetColumnId)

  if (fromColumn && toColumn) {
    fromColumn.tasks = fromColumn.tasks.filter((t) => t._id !== draggedTask.value._id)
    toColumn.tasks.push(draggedTask.value)

    try {
      await axios.put(`/applications/${draggedTask.value._id}/move`, {
        columnId: targetColumnId,
      })
    } catch (err) {
      console.error('Backend update error:', err)
    }
  }

  draggedTask.value = null
  draggedFromColumnId.value = null
  dragOverColumn.value = null
}

async function addColumn() {
  if (newColumnName.value.trim() === '') return

  try {
    const res = await axios.post('/columns', {
      name: newColumnName.value.trim(),
      userId: admin.id,
    })
    columns.value.push({ ...res.data, tasks: [] })
    newColumnName.value = ''
  } catch (err) {
    console.error('Error adding column:', err)
  }
}

async function deleteColumn(columnId) {
  try {
    await axios.delete(`/columns/${columnId}`)
    columns.value = columns.value.filter((col) => col._id !== columnId)
  } catch (err) {
    console.error('Error deleting column:', err)
  }
}

async function addTask() {
  const applicant = newApplicant.value

  console.log(applicant);
  if (!applicant.name || !applicant.lastname || !applicant.phone) {
    showValidation.value = true
    return
  }

  const column = columns.value.find((c) => c._id === columnID.value)
  console.log(columnID.value);
  if (column) {
    isLoading.value = true
    try {
      const response = await axios.post('/applications', {
        ...applicant,
        columnId: column._id,
      })
      column.tasks.push(response.data)
    } catch (err) {
      console.error('Error adding task:', err)
    } finally {
      isLoading.value = false
    }

    newApplicant.value = {
      name: '',
      lastname: '',
      phone: '',
      location: '',
      gurup: '',
      status: column.name,
      description: '',
      admin: '',
    }
    addmodalvisible.value = false
    showValidation.value = false
  }
}

function deleteTask(columnId, taskId) {
  const column = columns.value.find((c) => c._id === columnId)
  if (column) column.tasks = column.tasks.filter((t) => t._id !== taskId)
}

function getColumnColor(index) {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-indigo-500',
  ]
  return colors[index % colors.length]
}

function formatDate(date) {
  return new Intl.DateTimeFormat('uz-UZ', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}
</script>
<style scoped>
::-webkit-scrollbar{
  height: 6px;
  
}
::-webkit-scrollbar-thumb{
  background-color: grey;
  border-radius: 24px;
  cursor: grab;
}
</style>