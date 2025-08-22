<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <button
          @click="router.back()"
          class="inline-flex items-center cursor-pointer px-4 py-2 mb-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <i class="pi pi-arrow-left mr-2"></i>
          Ortga
        </button>
    <div class=" space-y-6">
      <!-- Filters -->
      <FiltersCard 
        :type="type" 
        :year="year" 
        :month="month" 
        :typeOptions="typeOptions" 
        :monthOptions="monthOptions" 
        @filter="loadStats" 
        v-model:type="type" 
        v-model:year="year" 
        v-model:month="month"
      />

      <!-- Summary Cards -->
     <SummaryCards 
  :totalStudents="totalStudents" 
  :minScore="minScoreData" 
  :maxScore="maxScoreData" 
/>

      <!-- Chart -->
      <ChartCard 
        :loading="loading" 
        :chartData="chartData" 
        :chartOptions="chartOptions" 
      />

      <!-- Data Table -->
      <StatsTable 
        :statsList="statsList" 
        @export="exportTableData" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import { useRoute,useRouter } from 'vue-router';

// Components
import FiltersCard from './FiltersCard.vue';
import SummaryCards from './SummaryCards.vue';
import ChartCard from './ChartCard.vue';
import StatsTable from './StatsTable.vue';

// State
const loading = ref(false);
const type = ref('weekly');
const year = ref(new Date().getFullYear());
const month = ref(new Date().getMonth() + 1);
const route = useRoute();
const router = useRouter()
const groupId = ref(route.params.slug);
const statsList = ref([]);
const chartData = ref(null);

// Options
const typeOptions = [
  { label: 'Haftalik', value: 'weekly' },
  { label: 'Oylik', value: 'monthly' },
  { label: 'Yillik', value: 'yearly' },
];

const monthOptions = [
  { label: 'Yanvar', value: 1 }, { label: 'Fevral', value: 2 }, { label: 'Mart', value: 3 },
  { label: 'Aprel', value: 4 }, { label: 'May', value: 5 }, { label: 'Iyun', value: 6 },
  { label: 'Iyul', value: 7 }, { label: 'Avgust', value: 8 }, { label: 'Sentabr', value: 9 },
  { label: 'Oktabr', value: 10 }, { label: 'Noyabr', value: 11 }, { label: 'Dekabr', value: 12 }
];

// Computed
const totalStudents = computed(() => statsList.value.length);
const averageScore = computed(() => statsList.value.length ? statsList.value.reduce((sum,s)=>sum+(s.totalScore||0),0)/statsList.value.length : 0);
const maxScoreData = computed(() => {
  if (!statsList.value.length) return { studentName: 'N/A', score: 0 };
  const student = statsList.value.reduce((prev, curr) => 
    (curr.totalScore || 0) > (prev.totalScore || 0) ? curr : prev
  );
  return { studentName: student.studentName || 'N/A', score: student.totalScore || 0 };
});

const minScoreData = computed(() => {
  if (!statsList.value.length) return { studentName: 'N/A', score: 0 };
  const student = statsList.value.reduce((prev, curr) => 
    (curr.totalScore || 0) < (prev.totalScore || 0) ? curr : prev
  );
  return { studentName: student.studentName || 'N/A', score: student.totalScore || 0 };
});

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { position: 'top', labels:{usePointStyle:true, padding:20} }, 
    tooltip:{ mode:'index', intersect:false, backgroundColor:'rgba(0,0,0,0.8)', titleColor:'white', bodyColor:'white', borderColor:'rgba(255,255,255,0.2)', borderWidth:1 } 
  },
  scales: { x:{ stacked:false, grid:{display:false} }, y:{ stacked:false, beginAtZero:true, max:100, grid:{color:'rgba(0,0,0,0.1)'} } },
  elements:{ bar:{ borderRadius:4 } }
};

// Methods
const loadStats = async () => {
  if(!groupId.value) return;
  loading.value = true;
  try {
    const res = await axios.get('/progress/group/stats', { params: { groupId: groupId.value, type:type.value, year:year.value, month:month.value } });
    statsList.value = res.data || [];
    chartData.value = statsList.value.length ? {
      labels: statsList.value.map(s=>s.studentName||'N/A'),
      datasets:[
        { label:"Davomat balli", data: statsList.value.map(s=>s.attendanceScore||0), backgroundColor:"rgba(59,130,246,0.8)", borderColor:"rgb(59,130,246)", borderWidth:2 },
        { label:"O'qituvchi bahosi", data: statsList.value.map(s=>s.teacherFeedback||0), backgroundColor:"rgba(245,158,11,0.8)", borderColor:"rgb(245,158,11)", borderWidth:2 },
        { label:"Yig'indisi", data: statsList.value.map(s=>s.totalScore||0), backgroundColor:"rgba(16,185,129,0.8)", borderColor:"rgb(16,185,129)", borderWidth:2 }
      ]
    } : null;
  } catch(err){ console.error(err); statsList.value=[]; chartData.value=null; }
  finally{ loading.value=false; }
};

const exportData = () => console.log('Export ma\'lumot');
const exportTableData = () => console.log('Export jadval');

watch([groupId, type, year, month], loadStats, { immediate:true });
onMounted(loadStats);
</script>
