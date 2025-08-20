<template>
  <div class="bg-white rounded-2xl overflow-hidden">
    <StudentListHeader
      :student-count="sortedStudents.length"
      @search="handleSearch"
      @export="exportToExcelHandler"
    />
    
    <StudentTable
      :students="sortedStudents"
      :filters="filters"
      :loading="loading"
      @edit="openEditModal"
      @delete="openDeleteModal"
      @payment="opentPaymentModal"
      @message="openMessageModal"
      @view="viewStudentDetails"
    />
    
    <DeleteConfirmationModal
      :visible="deleteModalVisible"
      :student="changeStudent"
      :loading="isLoading"
      @cancel="deleteModalVisible = false"
      @confirm="deleteStudent"
    />
    
    <EditStudentModal
      :visible="editStudentModalVisible"
      :student="editedStudent"
      :loading="isLoading"
      @cancel="editStudentModalVisible = false"
      @save="editStudent"
    />
    
    <PaymentModal
      :visible="addPaymentModalVisible"
      :student="changeStudent"
      :loading="isLoading"
      @cancel="addPaymentModalVisible = false"
      @save="addPayment"
    />
    
    <SendMessageModal
      :visible="sendMessageModalVisible"
      :student="changeStudent"
      :loading="isLoading"
      @cancel="sendMessageModalVisible = false"
      @send="sendMessageFunction"
    />
    
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import { exportToExcel } from '@/utils/formatToExcel'
import { formatDate } from '../../utils/FormatDate'

// Komponentlarni import qilish
import StudentListHeader from './StudentListHeader.vue'
import StudentTable from './StudentTable.vue'
import DeleteConfirmationModal from './DeleteConfirmationModal.vue'
import EditStudentModal from './EditStudentModal.vue'
import PaymentModal from './PaymentModal.vue'
import SendMessageModal from './SendMessageModal.vue'

const router = useRouter()
const toast = useToast()
const admin = JSON.parse(sessionStorage.getItem('admin'))

// Props & Emit
const props = defineProps({ group: Object })
const emit = defineEmits(['getGroupById'])

// Refs
const filters = ref({ global: { value: null, matchMode: 'contains' } })
const deleteModalVisible = ref(false)
const editStudentModalVisible = ref(false)
const addPaymentModalVisible = ref(false)
const selectedStudentId = ref(null)
const showValidation = ref(false)
const changeStudent = ref({})
const sendMessageModalVisible = ref(false)
const messageText = ref('')
const isLoading = ref(false)
const loading = ref(false)

const editedStudent = ref({
  name: '',
  lastname: '',
  phone: '',
  location: '',
  description: '',
  parentPhone:'',
  groupId: props.group._id,
  status: 'active',
  admin: admin.id,
})

const newPayment = ref({
  amount: null,
  method: null,
  description: '',
})

// Computed: students sorted by createdAt (desc)
const sortedStudents = computed(() =>
  [...(props.group.students || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
)

// Event handlers
const handleSearch = (value) => {
  filters.value.global.value = value
}

const opentPaymentModal = (student) => {
  addPaymentModalVisible.value = true
  changeStudent.value = student
}

const openMessageModal = (student) => {
  sendMessageModalVisible.value = true
  changeStudent.value = student
}

const openDeleteModal = (student) => {
  deleteModalVisible.value = true
  changeStudent.value = student
}

const openEditModal = (student) => {
  selectedStudentId.value = student._id
  Object.assign(editedStudent.value, {
    name: student.name,
    lastname: student.lastname,
    phone: student.phone,
    parentPhone: student.parentPhone,
    location: student.location,
    description: student.description,
  })
  editStudentModalVisible.value = true
}

const viewStudentDetails = (student) => {
  router.push(`/group/${student.groupId}/student/${student._id}`)
}

// Export Excel
const exportToExcelHandler = () => {
  const exportData = sortedStudents.value.map((student, index) => ({
    ID: index + 1,
    Ism: student.name,
    Familiya: student.lastname,
    Telefon: student.phone,
    "Ota-Ona Telefon raqami": student.parentPhone,
    'Yashash joyi': student.location,
    "Qo'shilgan sanasi": formatDate(student.createdAt),
  }))
  const fileName = `${props.group.name.replace(/\s+/g, '_')}_${getTodayDate()}.xlsx`
  exportToExcel(exportData, fileName)
}

const getTodayDate = () => {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

// Delete
const deleteStudent = async () => {
  isLoading.value = true
  try {
    await axios.delete(`/students/${changeStudent.value._id}`)
    toast.add({
      severity: 'success',
      summary: 'Bajarildi',
      detail: "O'quvchi o'chirildi",
      life: 3000,
    })
    emit('getGroupById')
    deleteModalVisible.value = false
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Xatolik', detail: error.message, life: 3000 })
  } finally {
    isLoading.value = false
  }
}

// Edit
const editStudent = async () => {
  isLoading.value = true
  try {
    const res = await axios.put(`/students/${selectedStudentId.value}`, {
      ...editedStudent.value,
      admin: admin.id,
    })
    if (res.status === 200) {
      editStudentModalVisible.value = false
      emit('getGroupById')
      toast.add({
        severity: 'success',
        summary: 'Yangilandi',
        detail: "O'quvchi yangilandi",
        life: 3000,
      })
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Xatolik', detail: error.message, life: 3000 })
  } finally {
    isLoading.value = false
  }
}

const addPayment = async (paymentData) => {
  isLoading.value = true

  try {
    await axios.post('/payments', {
      ...paymentData,
      studentId: changeStudent.value._id,
      userId: admin.id,
    })
    
    toast.add({
      severity: 'success',
      summary: 'Bajarildi',
      detail: 'To‘lov qabul qilindi',
      life: 3000,
    })

    addPaymentModalVisible.value = false
    emit('getGroupById')
  } catch (error) {
    console.error('To‘lovni saqlashda xatolik:', error)
    toast.add({
      severity: 'error',
      summary: 'Xatolik',
      detail: 'To‘lovni saqlab bo‘lmadi',
      life: 3000,
    })
  } finally {
    isLoading.value = false
  }
}

const sendMessageFunction = async (message) => {
  isLoading.value = true
  try {
    const res = await axios.post('/students/send-message', {
      studentId: changeStudent.value._id,
      message: message,
    })

    if (res.status >= 200 && res.status < 300) {
      sendMessageModalVisible.value = false
      toast.add({
        severity: 'success',
        summary: 'Muvaffaqiyatli',
        detail: 'Xabar yuborildi ✅',
        life: 3000,
      })
    }
  } catch (err) {
    console.error('Xabar yuborishda xatolik:', err)
    toast.add({
      severity: 'error',
      summary: 'Xatolik',
      detail: 'Xabar yuborib bo‘lmadi ❌',
      life: 3000,
    })
  } finally {
    isLoading.value = false
  }
}
</script>