<template>
  <div class="min-h-screen">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header with Year Selector -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p class="text-gray-600">Boshqaruv paneli va statistikalar</p>
        </div>
        <div class="flex items-center gap-2 bg-white rounded-lg shadow-sm p-2">
          <i class="pi pi-calendar text-blue-500"></i>
          <Calendar
            v-model="selectedYear"
            view="year"
            dateFormat="yy"
            class=" border-0"
            @update:modelValue="loadDashboard"
            placeholder="Yil tanlang"
            :showIcon="false"
          />
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <div 
          v-for="(item, index) in summary" 
          :key="item.label"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          >
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 rounded-lg" :class="getIconBackground(index)">
              <i :class="getIcon(index)" class="text-xl text-white"></i>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-600 mb-1">{{ item.label }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatNumber(item.value) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <!-- Applications Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <i class="pi pi-file text-blue-500"></i>
              Arizalar (oylik)
            </h3>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Arizalar soni</span>
            </div>
          </div>
          <div class="h-80">
            <Chart type="bar" :data="applicationChart" :options="chartOptions" class="h-full" />
          </div>
        </div>

        <!-- Payments Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <i class="pi pi-credit-card text-green-500"></i>
              To'lovlar (oylik)
            </h3>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>To'lovlar miqdori</span>
            </div>
          </div>
          <div class="h-80">
            <Chart type="bar" :data="paymentChart" :options="enhancedChartOptions" class="h-full" />
          </div>
        </div>

        <!-- Expenses Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <i class="pi pi-minus-circle text-red-500"></i>
              Xarajatlar (oylik)
            </h3>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Xarajatlar miqdori</span>
            </div>
          </div>
          <div class="h-80">
            <Chart type="bar" :data="expenseChart" :options="enhancedChartOptions" class="h-full" />
          </div>
        </div>

        <!-- Balance Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <i class="pi pi-chart-line text-orange-500"></i>
              Balans (oylik)
            </h3>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Balans o'zgarishi</span>
            </div>
          </div>
          <div class="h-80">
            <Chart type="line" :data="balanceChart" :options="lineChartOptions" class="h-full" />
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <i class="pi pi-clock text-purple-500"></i>
            So'nggi faoliyat
          </h3>
        </div>
        <div class="space-y-4">
          <div 
            v-for="(item, index) in activity" 
            :key="item.date"
            class="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-center gap-4">
              <div class="p-2 rounded-lg" :class="getActivityIcon(item.type).bg">
                <i :class="getActivityIcon(item.type).icon" class="text-white text-sm"></i>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ item.type }}</p>
                <p class="text-sm text-gray-600">{{ item.description }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">{{ formatDate(item.date) }}</p>
              <p class="text-xs text-gray-400">{{ formatTime(item.date) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Chart from 'primevue/chart'
import Calendar from 'primevue/calendar'

// Admin ID
const adminId = JSON.parse(sessionStorage.getItem('admin'))

// Selected year
const selectedYear = ref(new Date())

// Data
const summary = ref([])
const applicationChart = ref({})
const paymentChart = ref({})
const expenseChart = ref({})
const balanceChart = ref({})
const activity = ref([])

// Helper functions
const formatNumber = (value) => {
  return new Intl.NumberFormat('uz-UZ').format(value)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('uz-UZ', {
    day: 'numeric',
    month: 'short'
  })
}

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getCardGradient = (index) => {
  const gradients = [
    'bg-gradient-to-br from-blue-50 to-blue-100',
    'bg-gradient-to-br from-green-50 to-green-100',
    'bg-gradient-to-br from-purple-50 to-purple-100',
    'bg-gradient-to-br from-orange-50 to-orange-100',
    'bg-gradient-to-br from-pink-50 to-pink-100'
  ]
  return gradients[index % gradients.length]
}

const getIconBackground = (index) => {
  const backgrounds = [
    'bg-gradient-to-r from-blue-500 to-blue-600',
    'bg-gradient-to-r from-green-500 to-green-600',
    'bg-gradient-to-r from-purple-500 to-purple-600',
    'bg-gradient-to-r from-orange-500 to-orange-600',
    'bg-gradient-to-r from-pink-500 to-pink-600'
  ]
  return backgrounds[index % backgrounds.length]
}

const getIcon = (index) => {
  const icons = [
    'pi pi-credit-card',
    'pi pi-money-bill',
    'pi pi-minus-circle',
    'pi pi-book',
    'pi pi-users'
  ]
  return icons[index % icons.length]
}

const getProgressColor = (index) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500'
  ]
  return colors[index % colors.length]
}


const getActivityIcon = (type) => {
  const iconMap = {
    'Ariza': { icon: 'pi pi-file', bg: 'bg-blue-500' },
    'To\'lov': { icon: 'pi pi-credit-card', bg: 'bg-green-500' },
    'Xarajat': { icon: 'pi pi-minus-circle', bg: 'bg-red-500' },
    'default': { icon: 'pi pi-info-circle', bg: 'bg-gray-500' }
  }
  return iconMap[type] || iconMap.default
}

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      callbacks: {
        label: (context) => ` ${context.dataset.label}: ${context.raw.toLocaleString()} so'm`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false
      },
      ticks: {
        color: '#6B7280',
        font: {
          size: 12
        },
        callback: (value) => `${value.toLocaleString()}`
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#6B7280',
        font: {
          size: 12
        }
      }
    }
  }
}

const enhancedChartOptions = {
  ...chartOptions,
  plugins: {
    ...chartOptions.plugins,
    tooltip: {
      ...chartOptions.plugins.tooltip,
      callbacks: {
        label: (context) => ` ${context.dataset.label}: ${context.raw.toLocaleString()} so'm`
      }
    }
  }
}

const lineChartOptions = {
  ...chartOptions,
  elements: {
    point: {
      radius: 4,
      hoverRadius: 6
    },
    line: {
      tension: 0.4
    }
  }
}

// Load dashboard data
const loadDashboard = async () => {
  try {
    const year = selectedYear.value.getFullYear()
    const yearQuery = `?year=${year}`
    
  const [summaryRes, appRes, payRes, expRes, balRes, actRes] = await Promise.all([
  axios.get(`/dashboard/summary/${adminId.id}${yearQuery}`),
  axios.get(`/dashboard/applications-by-month/${adminId.id}${yearQuery}`),
  axios.get(`/dashboard/payments-by-month/${adminId.id}${yearQuery}`),
  axios.get(`/dashboard/expenses-by-month/${adminId.id}${yearQuery}`),
  axios.get(`/dashboard/balance-by-month/${adminId.id}${yearQuery}`),
  axios.get(`/dashboard/recent-activity/${adminId.id}`)
])

    summary.value = summaryRes.data

    applicationChart.value = {
      labels: appRes.data.labels,
      datasets: [{
        label: 'Arizalar',
        data: appRes.data.values,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false
      }]
    }

    paymentChart.value = {
      labels: payRes.data.labels,
      datasets: [{
        label: "To'lovlar",
        data: payRes.data.values,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false
      }]
    }

    expenseChart.value = {
      labels: expRes.data.labels,
      datasets: [{
        label: "Xarajatlar",
        data: expRes.data.values,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false
      }]
    }

    balanceChart.value = {
      labels: balRes.data.labels,
      datasets: [{
        label: "Balans",
        data: balRes.data.values,
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(249, 115, 22)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    }

    activity.value = actRes.data
  } catch (err) {
    console.error("Dashboard ma'lumotlarini yuklashda xatolik:", err)
  }
}

onMounted(loadDashboard)
</script>

<style scoped>
/* Custom scrollbar for activity section */
.space-y-4 {
  max-height: 400px;
  overflow-y: auto;
}

.space-y-4::-webkit-scrollbar {
  width: 4px;
}

.space-y-4::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.space-y-4::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.space-y-4::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animation for cards */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > div {
  animation: fadeInUp 0.6s ease-out forwards;
}

.grid > div:nth-child(1) { animation-delay: 0.1s; }
.grid > div:nth-child(2) { animation-delay: 0.2s; }
.grid > div:nth-child(3) { animation-delay: 0.3s; }
.grid > div:nth-child(4) { animation-delay: 0.4s; }
.grid > div:nth-child(5) { animation-delay: 0.5s; }
</style>