<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">📅 Xonalar Timeline</h2>
        <p class="text-gray-600">Xonalar va guruhlar jadvalini boshqaring</p>
      </div>

      <div class="flex flex-wrap gap-2">
        <Button 
          :label="filterType === 'all' ? '✓ Barchasi' : 'Barchasi'" 
          @click="$emit('update-filter', 'all')" 
          :class="filterType === 'all' ? 'p-button-sm' : 'p-button-sm p-button-outlined'"
        />
        <Button 
          :label="filterType === 'odd' ? '✓ Toq kunlar' : 'Toq kunlar'" 
          @click="$emit('update-filter', 'odd')" 
          :class="filterType === 'odd' ? 'p-button-sm' : 'p-button-sm p-button-outlined'"
        />
        <Button 
          :label="filterType === 'even' ? '✓ Juft kunlar' : 'Juft kunlar'" 
          @click="$emit('update-filter', 'even')" 
          :class="filterType === 'even' ? 'p-button-sm' : 'p-button-sm p-button-outlined'"
        />
        <Button 
          label="Guruh joylash" 
          icon="pi pi-plus" 
          class="p-button-sm p-button-success" 
          @click="$emit('open-dialog')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from "primevue/button";
const props = defineProps({ filterType: String });
</script>
