<template>
     <Card class="shadow-xl border-0 overflow-hidden">
    <template #content>
      <div class=" flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div class="flex items-center gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-800 m-0">Guruh Statistikasi</h1>
            <p class="text-gray-600 dark:text-gray-400 text-sm m-0 mt-1">
              O'quvchilar faoliyati va natijalarini tahlil qiling
            </p>
          </div>
        </div>
         <div class="flex flex-wrap gap-6 items-end">
    <!-- Statistika turi -->
    <div class="flex flex-col ">
      <label class="mb-2 text-sm font-semibold text-gray-700">Statistika turi</label>
      <Dropdown 
        v-model="localType" 
        :options="typeOptions" 
        optionLabel="label" 
        optionValue="value" 
        class="w-full" 
        :class="{'p-invalid': !localType}" 
      />
    </div>

    <!-- Yil -->
    <div class="flex flex-col" v-if="localType !== 'weekly'">
      <label class="mb-2 text-sm font-semibold text-gray-700">Yil</label>
      <InputNumber 
        v-model="localYear" 
        :min="2000" 
        :max="2100" 
        showButtons 
        class="w-full"
      />
    </div>

    <!-- Oy -->
    <div class="flex flex-col" v-if="localType === 'monthly'">
      <label class="mb-2 text-sm font-semibold text-gray-700">Oy</label>
      <Dropdown 
        v-model="localMonth" 
        :options="monthOptions" 
        optionLabel="label" 
        optionValue="value" 
        class="w-full"
      />
    </div>
  </div>
      </div>
    </template>
  </Card>

</template>

<script setup>
import { ref, watch } from 'vue';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';

const props = defineProps({
  type: String,
  year: Number,
  month: Number,
  typeOptions: Array,
  monthOptions: Array
});

const emit = defineEmits(['update:type', 'update:year', 'update:month', 'filter']);

const localType = ref(props.type);
const localYear = ref(props.year);
const localMonth = ref(props.month);

watch(localType, val => emit('update:type', val));
watch(localYear, val => emit('update:year', val));
watch(localMonth, val => emit('update:month', val));
</script>
