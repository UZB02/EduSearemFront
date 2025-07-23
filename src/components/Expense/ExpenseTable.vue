<template>
  <Card class="shadow-lg border-0">
    <template #content>
      <DataTable 
        :value="expenses"
        v-if="!loading"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        stripedRows
        responsiveLayout="scroll"
        :globalFilterFields="['category', 'description']"
        class="custom-datatable"
      >
        <template #empty>
          <div class="text-center py-12">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Xarajatlar topilmadi</h3>
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

        <Column field="amount" header="Summasi" class="min-w-32">
          <template #body="{ data }">
            <div class="text-right text-red-600 font-bold">
              {{ formatCurrency(data.amount) }}
            </div>
          </template>
        </Column>

        <Column field="spentAt" header="Sana" class="min-w-32">
          <template #body="{ data }">
            <div class="text-center">
              <div class="text-sm text-gray-800">{{ formatDate(data.spentAt) }}</div>
              <div class="text-xs text-gray-500">{{ formatTime(data.spentAt) }}</div>
            </div>
          </template>
        </Column>

        <Column header="Amallar" class="min-w-32">
          <template #body="{ data }">
            <div class="flex gap-2 justify-center">
              <Button @click="$emit('edit', data)" icon="pi pi-pencil" size="small" severity="info" outlined />
              <Button @click="$emit('delete', data.id)" icon="pi pi-trash" size="small" severity="danger" outlined />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup>
defineProps(['expenses', 'loading'])
defineEmits(['edit', 'delete'])

const formatCurrency = (amount) => new Intl.NumberFormat('uz-UZ', {
  style: 'currency', currency: 'UZS', minimumFractionDigits: 0
}).format(amount)

const formatDate = (date) => new Date(date).toLocaleDateString('uz-UZ')
const formatTime = (date) => new Date(date).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
</script>
