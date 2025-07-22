<template>
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    <div>
      <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ group.name || 'Loading...' }}</h1>
      <p class="text-gray-600">
        {{ group.teacher ? group.teacher.name + ' ' + group.teacher.lastname : 'O‘qituvchi maʼlumoti yo‘q' }}
      </p>
    </div>

    <!-- Yangi guruh qo‘shish -->
    <div class="flex items-center gap-2 bg-white rounded-lg shadow-sm p-3">
      <button
        class="bg-gradient-to-r cursor-pointer from-green-500 to-green-600 text-white rounded-md px-4 py-2 hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        @click="visibleAddGroup = true"
      >
        <i class="pi pi-plus"></i>
        O'quvchi qo‘shish
      </button>
    </div>
  </div>
  <div>
    <StudentsTable :group="group"></StudentsTable>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import StudentsTable from "../../components/Students/StudentsTable.vue"

const route = useRoute()
const groupId = ref(route.params.slug)
const admin = JSON.parse(sessionStorage.getItem('admin'))

const group = ref({})
const visibleAddGroup = ref(false)

const getGroupById = async () => {
  try {
    const res = await axios.get(`/groups/${groupId.value}`, {
      params: {
        adminId: admin.id,
      },
    })
    group.value = res.data
  } catch (err) {
    console.error('Xatolik:', err)
  }
}

getGroupById()
</script>
