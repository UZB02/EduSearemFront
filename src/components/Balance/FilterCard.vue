<template>
  <Card class="mb-6 shadow-md border-0">
    <template #content>
      <div class="flex flex-col md:flex-row md:items-end gap-4">
        <!-- Filter type -->
        <div class="flex flex-col w-full md:w-48">
          <label class="text-sm font-medium text-gray-700 mb-1">Filter turi</label>
          <Dropdown
            v-model="filterType"
            :options="filterTypes"
            optionLabel="label"
            optionValue="value"
            placeholder="Tanlang"
            class="w-full"
            @change="applyFilter"
          />
        </div>

        <!-- Single date -->
        <div v-if="filterType === 'date'" class="flex flex-col w-full md:w-56">
          <label class="text-sm font-medium text-gray-700 mb-1">Sana</label>
          <Calendar 
            v-model="selectedDate" 
            dateFormat="dd.mm.yy" 
            class="w-full"
            @update:modelValue="applyFilter" 
          />
        </div>

        <!-- Date range -->
        <div v-if="filterType === 'range'" class="flex flex-col w-full md:w-72">
          <label class="text-sm font-medium text-gray-700 mb-1">Sana oralig‘i</label>
          <Calendar 
            v-model="selectedRange" 
            selectionMode="range" 
            dateFormat="dd.mm.yy" 
            class="w-full"
            @update:modelValue="applyFilter"
          />
        </div>

        <!-- Month + Year -->
        <div v-if="filterType === 'month'" class="flex flex-col w-full md:w-56">
          <label class="text-sm font-medium text-gray-700 mb-1">Oy</label>
          <Dropdown 
            v-model="selectedMonth" 
            :options="months" 
            optionLabel="label" 
            optionValue="value"
            placeholder="Oy" 
            class="w-full"
            @change="applyFilter"
          />
          <Dropdown 
            v-model="selectedYear" 
            :options="years" 
            optionLabel="label" 
            optionValue="value"
            placeholder="Yil" 
            class="mt-2 w-full"
            @change="applyFilter"
          />
        </div>

        <!-- Reset only -->
        <div class="flex gap-2 w-full md:w-auto">
          <Button label="Tozalash" icon="pi pi-times" severity="secondary" @click="resetFilter" />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from "vue";
import Card from "primevue/card";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

const filterType = ref("date");
const selectedDate = ref(null);
const selectedRange = ref(null);
const selectedMonth = ref(null);
const selectedYear = ref(null);

const filterTypes = [
  { label: "Sana bo‘yicha", value: "date" },
  { label: "Sana oralig‘i", value: "range" },
  { label: "Oy + Yil", value: "month" }
];

const months = [
  { label: "Yanvar", value: 1 },
  { label: "Fevral", value: 2 },
  { label: "Mart", value: 3 },
  { label: "Aprel", value: 4 },
  { label: "May", value: 5 },
  { label: "Iyun", value: 6 },
  { label: "Iyul", value: 7 },
  { label: "Avgust", value: 8 },
  { label: "Sentabr", value: 9 },
  { label: "Oktabr", value: 10 },
  { label: "Noyabr", value: 11 },
  { label: "Dekabr", value: 12 }
];

const years = Array.from({ length: 10 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { label: y.toString(), value: y };
});

const emit = defineEmits(["filter-change"]);

const applyFilter = () => {
  let payload = {};

  if (filterType.value === "date" && selectedDate.value) {
    payload = { type: "date", date: selectedDate.value };
  } else if (filterType.value === "range" && selectedRange.value?.length === 2) {
    payload = { type: "range", from: selectedRange.value[0], to: selectedRange.value[1] };
  } else if (filterType.value === "month" && selectedMonth.value && selectedYear.value) {
    payload = { type: "month", month: selectedMonth.value, year: selectedYear.value };
  }

  emit("filter-change", payload);
};

const resetFilter = () => {
  filterType.value = "date";
  selectedDate.value = null;
  selectedRange.value = null;
  selectedMonth.value = null;
  selectedYear.value = null;
  emit("filter-change", {});
};
</script>
