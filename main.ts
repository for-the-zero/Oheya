import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './src/App.vue';
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';

import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import 'primeicons/primeicons.css';

import './style.css';

const Noir = definePreset(Aura, {
    semantic: {
        primary: { 50: '{zinc.50}', 100: '{zinc.100}', 200: '{zinc.200}', 300: '{zinc.300}', 400: '{zinc.400}', 500: '{zinc.500}', 600: '{zinc.600}', 700: '{zinc.700}', 800: '{zinc.800}', 900: '{zinc.900}', 950: '{zinc.950}' },
        colorScheme: { dark: {
            primary: {
                color: '{zinc.50}',
                inverseColor: '{zinc.950}',
                hoverColor: '{zinc.100}',
                activeColor: '{zinc.200}'
            },
            highlight: {
                background: 'rgba(250, 250, 250, .16)',
                focusBackground: 'rgba(250, 250, 250, .24)',
                color: 'rgba(255,255,255,.87)',
                focusColor: 'rgba(255,255,255,.87)'
            },
            surface: { 0: '#ffffff', 50: '{neutral.50}', 100: '{neutral.100}', 200: '{neutral.200}', 300: '{neutral.300}', 400: '{neutral.400}', 500: '{neutral.500}', 600: '{neutral.600}', 700: '{neutral.700}', 800: '{neutral.800}', 900: '{neutral.900}', 950: '{neutral.950}' }
        }}
    }
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(PrimeVue, {
    theme: {
        preset: Noir,
        options: {
            prefix: 'p',
            darkModeSelector: '.dark-mode',
            cssLayer: false
        }
    }
});
app.directive('tooltip', Tooltip);
app.use(ToastService);
app.component('Toast', Toast);

app.mount('#app');
