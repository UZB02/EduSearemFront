import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import Chart from 'primevue/chart'
import Card from 'primevue/card'
import ConfirmationService from 'primevue/confirmationservice'
import ConfirmDialog from 'primevue/confirmdialog'


const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark',
    },
  },
})


app.directive('tooltip', Tooltip)
app.use(ToastService)
app.component('Chart', Chart) 
app.component('Card', Card)
app.use(ConfirmationService) // 👈 BU MUHIM!

app.component('ConfirmDialog', ConfirmDialog) 
app.use(router)

app.mount('#app')
