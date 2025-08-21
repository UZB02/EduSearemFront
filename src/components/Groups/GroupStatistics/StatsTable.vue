<template>
      <div class="p-0">
        <!-- Enhanced Data Table -->
        <div class="">
          <DataTable 
            :value="statsList" 
            :paginator="true" 
            :rows="10" 
            stripedRows 
            :scrollable="true" 
            scrollHeight="500px"
            class="rounded-lg overflow-hidden border border-gray-200"
            :rowClass="getRowClass"
          >
            <Column field="studentName" header="O'quvchi" class="font-medium">
              <template #body="slotProps">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {{ slotProps.data.studentName?.charAt(0)?.toUpperCase() }}
                  </div>
                  <span class="font-medium text-gray-900">{{ slotProps.data.studentName }}</span>
                </div>
              </template>
            </Column>
            
            <Column field="attendanceScore" header="Davomat balli" class="text-center">
              <template #body="slotProps">
                <div class="flex items-center justify-center">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                        :class="getScoreClass(slotProps.data.attendanceScore, 'attendance')">
                    {{ slotProps.data.attendanceScore }}
                  </span>
                </div>
              </template>
            </Column>
            
            <Column field="teacherFeedback" header="O'qituvchi bahosi" class="text-center">
              <template #body="slotProps">
                <div class="flex items-center justify-center">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                        :class="getScoreClass(slotProps.data.teacherFeedback, 'feedback')">
                    {{ slotProps.data.teacherFeedback }}
                  </span>
                </div>
              </template>
            </Column>
            
            <Column field="totalScore" header="Yig'indisi" class="text-center">
              <template #body="slotProps">
                <div class="flex items-center justify-center">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold"
                        :class="getTotalScoreClass(slotProps.data.totalScore)">
                    {{ slotProps.data.totalScore }}
                    <i class="pi pi-star-fill ml-1 text-xs"></i>
                  </span>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
</template>

<script setup>
import { computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const props = defineProps({
  statsList: Array
})


// Styling functions
const getScoreClass = (score, type) => {
  const numScore = Number(score)
  if (type === 'attendance') {
    if (numScore >= 90) return 'bg-green-100 text-green-800'
    if (numScore >= 70) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  } else {
    if (numScore >= 85) return 'bg-blue-100 text-blue-800'
    if (numScore >= 70) return 'bg-indigo-100 text-indigo-800'
    return 'bg-gray-100 text-gray-800'
  }
}

const getTotalScoreClass = (score) => {
  const numScore = Number(score)
  if (numScore >= 90) return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
  if (numScore >= 80) return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
  if (numScore >= 70) return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
  return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
}

const getRowClass = (data) => {
  const score = Number(data.totalScore)
  if (score >= 90) return 'bg-green-50/50'
  if (score >= 80) return 'bg-blue-50/50'
  return ''
}

console.log(props)
</script>
