import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import pmtZh from './prompt.zh.md?raw';
import pmtEn from './prompt.en.md?raw';

import type { ToastServiceMethods } from 'primevue/toastservice';
let _toast: ToastServiceMethods | null = null;
export function setToast(t: ToastServiceMethods){ _toast = t; };
export function getToast(){ return _toast; };

export const defaultConfig = {
    lang: navigator.language.includes('zh') ? 'zh' : 'en',
    vibration: 0,
    corsMode: false,
    corsPrefix: 'https://cors.forthezero.dpdns.org/?',
    baseUrl: '',
    key: '',
    model: '',
    temperature: 0,
    prompt: pmtEn,
    search: 'uapi',
    content: 'md.new',
    toolsKeys: {
        exa: '',
        uapi: '',
        tavily: '',
        querit: ''
    }
};

export const useGlobalRefStore = defineStore('globalRef', () => {
    const status = ref<aistatus>({
        isGenerating: false,
        isGenResult: false,
        isToolCalling: false,
        response: '',
        toolResults: []
    });
    const config = ref<config>(JSON.parse(localStorage.getItem('oheya') || 'null') || defaultConfig);
    watch(config, (v) => localStorage.setItem('oheya', JSON.stringify(v)), { deep: true });
    return { status, config };
});