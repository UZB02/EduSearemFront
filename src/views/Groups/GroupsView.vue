<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Guruhlar bo'limi</h1>
        <p class="text-gray-600">Guruhlarni boshqaring va jarayonni kuzatib boring</p>
      </div>

      <!-- Yangi ustun qo'shish -->
      <div class="flex items-center gap-2 bg-white rounded-lg shadow-sm p-3">
        <button
          class="bg-gradient-to-r cursor-pointer from-green-500 to-green-600 text-white rounded-md px-4 py-2 hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          @click="visibleAddGroup = true"
        >
          <i class="pi pi-plus"></i>
          Guruh qo'shish
        </button>
      </div>
    </div>

    <!-- Guruh kartalari yoki Skeleton -->
    <div class="grid md:grid-cols-3 grid-cols-1 gap-2">
      <template v-if="isLoading">
        <div v-for="i in 4" :key="i" class="h-40 bg-gray-100 animate-pulse rounded-xl"></div>
      </template>
      <template v-else>
        <GroupsCard
          v-for="group in groups"
          :key="group._id"
          :group="group"
          @getAllGroups="getAllGroups"
        />
      </template>
    </div>
  </div>

  <!-- Drawer: Guruh Qo'shish -->
  <Drawer v-model:visible="visibleAddGroup" header="Guruh Qo'shish" position="right">
    <AddGroupForm @getAllGroups="getAllGroups" @closeDrawer="visibleAddGroup = false" />
  </Drawer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from "../../utils/api.js";
import Drawer from 'primevue/drawer'
import AddGroupForm from '../../components/Groups/AddGroupsForm.vue'
import GroupsCard from '../../components/Groups/GroupsCard.vue'

const admin = JSON.parse(sessionStorage.getItem('admin'))
const visibleAddGroup = ref(false)
const groups = ref([])
const isLoading = ref(true)

const getAllGroups = async () => {
  isLoading.value = true
  try {
    const res = await api.get('/groups', {
      params: { adminId: admin.id }
    })
    groups.value = res.data
    console.log(groups.value);
  } catch (err) {
    console.error('Guruhlarni olishda xatolik:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(getAllGroups)
</script>

<style scoped></style>


<!-- <template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Guruhlar bo'limi</h1>
        <p class="text-gray-600">Guruhlarni boshqaring va jarayonni kuzatib boring</p>
      </div>

      <div class="flex items-center gap-2 bg-white rounded-lg shadow-sm p-3">
        <button
          class="bg-gradient-to-r cursor-pointer from-green-500 to-green-600 text-white rounded-md px-4 py-2 hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm font-medium flex items-center gap-2"
          @click="visibleAddGroup = true"
        >
          <i class="pi pi-plus"></i>
          Guruh qo'shish
        </button>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gradient-to-r from-slate-50 to-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">#</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Nomi</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">O'qituvchi</th>
            <th class="px-6 py-3 text-center text-sm font-semibold text-gray-600">O‘quvchilar</th>
            <th class="px-6 py-3 text-center text-sm font-semibold text-gray-600">Oylik to‘lov</th>
            <th class="px-6 py-3 text-center text-sm font-semibold text-gray-600">Kunlar</th>
            <th class="px-6 py-3 text-center text-sm font-semibold text-gray-600">Boshlanish</th>
            <th class="px-6 py-3 text-center text-sm font-semibold text-gray-600">Yaratilgan sana</th>
            <th class="px-6 py-3 text-right text-sm font-semibold text-gray-600">Amallar</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="isLoading" v-for="i in 4" :key="i" class="animate-pulse">
            <td colspan="9" class="py-6 text-center text-gray-400">Yuklanmoqda...</td>
          </tr>

          <GroupsCard
            v-else
            v-for="(group, index) in groups"
            :key="group._id"
            :index="index"
            :group="group"
            @getAllGroups="getAllGroups"
          />
        </tbody>
      </table>

      <div v-if="!isLoading && !groups.length" class="text-center py-8 text-gray-500 text-sm">
        Hech qanday guruh topilmadi
      </div>
    </div>
  </div>

  <Drawer v-model:visible="visibleAddGroup" header="Yangi Guruh Qo‘shish" position="right">
    <AddGroupForm @getAllGroups="getAllGroups" @closeDrawer="visibleAddGroup = false" />
  </Drawer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Drawer from 'primevue/drawer'
import AddGroupForm from '../../components/Groups/AddGroupsForm.vue'
import GroupsCard from '../../components/Groups/GroupsCard.vue'

const admin = JSON.parse(sessionStorage.getItem('admin'))
const visibleAddGroup = ref(false)
const groups = ref([])
const isLoading = ref(true)

const getAllGroups = async () => {
  isLoading.value = true
  try {
    const res = await axios.get('/groups', {
      params: { adminId: admin.id }
    })
    groups.value = res.data
  } catch (err) {
    console.error('Guruhlarni olishda xatolik:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(getAllGroups)
</script> -->

