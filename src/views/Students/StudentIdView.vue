<template>
  <div class="">
    <div class="mx-auto">
      <!-- Header with back button -->
      <div class="mb-6">
        <button
          @click="goBack"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <i class="pi pi-arrow-left mr-2"></i>
          Ortga
        </button>
      </div>

      <!-- Student Profile Card -->
      <StudentInfoCard
        v-if="student"
        :student="student"
        @edit="openEditModal"
        @delete="openDeleteModal"
        @show-monthly="showMonthly = true"
      />

      <!-- Loading Skeleton -->
      <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="bg-gray-200 animate-pulse h-32 flex items-center justify-center">
          <i class="pi pi-spin pi-spinner text-4xl text-gray-400"></i>
        </div>
        <div class="p-8 space-y-4">
          <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          <div class="text-center text-gray-500 mt-4">
            <i class="pi pi-spin pi-spinner mr-2"></i>
            Ma'lumotlar yuklanmoqda...
          </div>
        </div>
      </div>

      <!-- Payment Table -->
      <PaymentHistorySection :studentId="studentId" @add-payment="addPaymentModalVisible = true" />

      <!-- Monthly Payment Dialog -->
      <MonthlyPaymentDialog v-model:visible="showMonthly" :student="student || {}" />

      <!-- Payment Modal -->
      <PaymentModal
        v-model:visible="addPaymentModalVisible"
        :student="student"
        :loading="isLoading"
        @save="addPayment"
        @cancel="addPaymentModalVisible = false"
      />

      <!-- Delete Confirmation Modal -->
      <DeleteConfirmationModal
        v-model:visible="deleteModalVisible"
        :student="student"
        :loading="isLoading"
        @confirm="deleteStudent"
        @cancel="deleteModalVisible = false"
      />

      <!-- Edit Student Modal -->
      <EditStudentModal
        v-model:visible="editStudentModalVisible"
        :student="editedStudent"
        :loading="isLoading"
        @save="editStudent"
        @cancel="editStudentModalVisible = false"
      />

      <Toast />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'

// Komponentlarni import qilish
import StudentInfoCard from '../../components/Students/StudentInfoCard.vue'
import PaymentHistorySection from '../../components/Students/PaymentHistorySection.vue'
import MonthlyPaymentDialog from '../../components/Students/MonthlyPaymentDialog.vue'
import PaymentModal from '../../components/Students/PaymentModal.vue'
import DeleteConfirmationModal from '../../components/Students/DeleteConfirmationModal.vue'
import EditStudentModal from '../../components/Students/EditStudentModal.vue'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const student = ref(null)
const isLoading = ref(false)
const studentId = ref(route.params.id)
const groupId = ref(route.params.slug)

const showMonthly = ref(false)
const deleteModalVisible = ref(false)
const editStudentModalVisible = ref(false)
const addPaymentModalVisible = ref(false)
const selectedStudentId = ref()

const admin = JSON.parse(sessionStorage.getItem('admin'))

const editedStudent = ref({
  name: '',
  lastname: '',
  phone: '',
  parentPhone: '',
  location: '',
  description: '',
  groupId: groupId.value,
  status: 'active',
  admin: admin.id,
})

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

const openDeleteModal = (student) => {
  selectedStudentId.value = student._id
  deleteModalVisible.value = true
}

const editStudent = async () => {
  isLoading.value = true
  try {
    const res = await axios.put(`/students/${selectedStudentId.value}`, {
      ...editedStudent.value,
      admin: admin.id,
    })
    if (res.status === 200) {
      editStudentModalVisible.value = false
      getStudentById()
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
    deleteModalVisible.value = false
    goBack()
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
      studentId: student.value._id,
      userId: admin.id,
    })

    toast.add({
      severity: 'success',
      summary: 'Bajarildi',
      detail: 'To‘lov qabul qilindi',
      life: 3000,
    })

    addPaymentModalVisible.value = false
    getStudentById()
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

const getStudentById = async () => {
  try {
    const res = await axios.get(`/students/byId/${studentId.value}`)
    student.value = res.data.student
  } catch (error) {
    console.error("O'quvchini yuklashda xatolik:", error)
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  getStudentById()
})
</script>

<style scoped>
/* Custom animations for loading */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
