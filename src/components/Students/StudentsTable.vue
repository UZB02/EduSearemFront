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
          <span class="p-input-icon-left flex">
            <InputText v-model="filters.global.value" placeholder="Qidirish" class="w-full" />
          </span>
          <Button icon="pi pi-download" label="Yuklab olish" @click="exportToExcelHandler()" />
        </div>
      </template>

      <!-- ID -->
      <Column header="ID">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>

      <!-- Ma'lumotlar -->
      <Column field="name" header="Ism" exportHeader="Ism" />
      <Column field="lastname" header="Familiya" exportHeader="Familiya" />

      <Column header="Telefon" exportHeader="Telefon">
        <template #body="slotProps">
          <a
            :href="`tel:${slotProps.data.phone}`"
            class="text-blue-500"
            v-tooltip.top="'Qo‘ng‘iroq qilish'"
          >
            {{ slotProps.data.phone }}
          </a>
        </template>
      </Column>

      <Column field="location" header="Yashash joyi" exportHeader="Yashash joyi" />

      <!-- Amallar -->
      <Column header="Amallar">
        <template #body="slotProps">
          <div class="flex items-center text-gray-500 gap-2">
            <i
              class="pi pi-pencil cursor-pointer"
              v-tooltip.top="'Tahrirlash'"
              @click="openEditModal(slotProps.data)"
            ></i>
            <i
              class="pi pi-trash cursor-pointer text-red-500"
              v-tooltip.top="'O‘chirish'"
              @click="openDeleteModal(slotProps.data._id)"
            ></i>
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Begin DeleteStudent Modal -->
    <Dialog
      v-model:visible="deleteModalVisible"
      :modal="true"
      :closable="false"
      :draggable="false"
      class="custom-dialog"
      :style="{ width: '500px' }"
      :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
    >
      <template #header>
        <div class="text-lg font-semibold text-red-600">Diqqat!</div>
      </template>

      <div class="text-gray-700 text-base py-4">
        Ushbu o‘quvchini o‘chirmoqchimisiz? Bu amal qaytarib bo‘lmaydi.
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button
            label="Bekor qilish"
            icon="pi pi-times"
            class="p-button-outlined p-button-secondary"
            @click="deleteModalVisible = false"
          />
          <Button
            :label="isLoading ? 'Yuklanmoqda...' : 'Ha, o‘chirish'"
            icon="pi pi-trash"
            class="p-button-danger"
            :disabled="isLoading"
            @click="deleteStudent"
          />
        </div>
      </template>
    </Dialog>
    <!-- Begin DeleteStudent Modal -->
    <!-- Begin EditStudent Modal -->
    <Dialog
      v-model:visible="editStudentModalVisible"
      :modal="true"
      :closable="true"
      :draggable="false"
      class="custom-dialog"
      :style="{ width: '600px' }"
      :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
    >
      <template #header>
        <div class="flex items-center gap-3 w-full">
          <div
            class="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center"
          >
            <i class="pi pi-pencil w-5 h-5 text-white"></i>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-800 m-0">Studentni tahrirlash</h2>
            <p class="text-sm text-gray-500 m-0">Ma'lumotlarni yangilang</p>
          </div>
        </div>
      </template>

      <div class="space-y-6 p-1">
        <!-- Ism, Familiya -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Ism</label>
            <InputText v-model="editedStudent.name" class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Familiya</label>
            <InputText v-model="editedStudent.lastname" class="w-full" />
          </div>
        </div>

        <!-- Telefon, Manzil -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Telefon raqami</label>
            <InputText v-model="editedStudent.phone" class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Manzil</label>
            <InputText v-model="editedStudent.location" class="w-full" />
          </div>
        </div>
        <!-- Izoh -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Izoh</label>
          <Textarea v-model="editedStudent.description" rows="3" class="w-full" autoResize />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button
            label="Bekor qilish"
            icon="pi pi-times"
            severity="secondary"
            @click="editStudentModalVisible = false"
          />
          <Button
            label="Yangilash"
            icon="pi pi-check"
            :loading="isLoading"
            @click="editStudent(selectedStudentId)"
          />
        </div>
      </template>
    </Dialog>
    <!-- End EditStudent Modal -->
    <Toast />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import axios from 'axios'
import { exportToExcel } from '@/utils/formatToExcel'
const admin = JSON.parse(sessionStorage.getItem('admin'))

const toast = useToast()

// Props
const props = defineProps({
  group: Object,
})
const emit = defineEmits(['getGroupById'])

// Refs
const dt = ref()
const filters = ref({
  global: { value: null, matchMode: 'contains' },
})
const deleteModalVisible = ref(false)
const selectedStudentId = ref(null)
const isLoading = ref(false)
const editStudentModalVisible = ref(false)
const editedStudent = ref({
  name: '',
  lastname: '',
  phone: '',
  location: '',
  groupId: props.group._id,
  status: 'active',
  description: '',
  admin: admin.id,
})

// Excel eksport funksiyasi
const exportToExcelHandler = () => {
  const exportData = props.group.students.map((student, index) => ({
    ID: index + 1,
    Ism: student.name,
    Familiya: student.lastname,
    Telefon: student.phone,
    'Yashash joyi': student.location,
  }))
  const groupName = props.group.name.replace(/\s+/g, '_')
  const fileName = `${groupName}_${getTodayDate()}.xlsx`
  exportToExcel(exportData, fileName)
}

const getTodayDate = () => {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

// Delete modal ochish
const openDeleteModal = (id) => {
  selectedStudentId.value = id
  deleteModalVisible.value = true
}

// Studentni o‘chirish
const deleteStudent = async () => {
  isLoading.value = true
  try {
    await axios.delete(`/students/${selectedStudentId.value}`)
    toast.add({
      severity: 'success',
      summary: 'Bajarildi',
      detail: "O'quvchi o'chirildi",
      life: 3000,
    })
    emit('getGroupById')
    // Frontdagi ro‘yxatdan ham o‘chirish
    const index = props.group.students.findIndex((s) => s._id === selectedStudentId.value)
    if (index !== -1) {
      props.group.students.splice(index, 1)
    }

    deleteModalVisible.value = false
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Xatolik', detail: error.message, life: 3000 })
  } finally {
    isLoading.value = false
  }
}

const openEditModal = (item) => {
  selectedStudentId.value = item._id
  console.log(item)
  editedStudent.value.name = item.name
  editedStudent.value.lastname = item.lastname
  editedStudent.value.phone = item.phone
  editedStudent.value.location = item.location
  editedStudent.value.description = item.description
  editStudentModalVisible.value = true
}

const editStudent = async () => {
  try {
    const res = await axios.put(`/students/${selectedStudentId.value}`, {
      name: editedStudent.value.name,
      lastname: editedStudent.value.lastname,
      phone: editedStudent.value.phone,
      location: editedStudent.value.location,
      groupId: editedStudent.value.groupId,
      status: editedStudent.value.status,
      description: editedStudent.value.description,
      admin: admin.id,
    })
    if(res.status===200){
        editStudentModalVisible.value=false
        emit('getGroupById')
    }
    console.log(res)
  } catch (error) {
    console.log(error)
  }
}
</script>
