<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
    <div class="px-4 sm:px-6 py-4 border-b border-gray-200">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        
        <!-- Avatar va ism bloki -->
        <div class="flex items-center space-x-4">
          <Avatar 
            :label="teacher.name.charAt(0) + teacher.lastname.charAt(0)"
            class="bg-blue-500 text-white"
            size="xlarge"
            shape="circle"
          />
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
              {{ teacher.name }} {{ teacher.lastname }}
            </h1>
            <p class="text-gray-600 text-sm sm:text-base">{{ teacher.science }}</p>
          </div>
        </div>

        <!-- Ball va tahrirlash tugmasi -->
        <div class="flex items-center space-x-2">
          <Tag :value="teacher.points + ' ball'" severity="success" />
          <Button 
            icon="pi pi-pencil" 
            label="Tahrirlash" 
            class="p-button-outlined whitespace-nowrap"
            size="small" 
          />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
defineProps(['teacher'])
</script>
