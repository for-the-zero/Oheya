import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import pmtZh from './prompt.zh.md?raw';
import pmtEn from './prompt.en.md?raw';

export const defaultConfig = {
    lang: navigator.language.includes('zh') ? 'zh' : 'en',
    vibration: true,
    corsMode: false,
    corsPrefix: '',
    baseUrl: '',
    key: '',
    model: '',
    prompts: [pmtZh, pmtEn],
    activePrompt: 0,
    search: 'uapi',
    content: 'md.new',
    toolsKeys: {
        exa: '',
        uapi: '',
        querit: ''
    }
};

export const useGlobalRefStore = defineStore('globalRef', () => {
    const status = ref<aistatus>({
        isGenerating: false,
        isGenResult: false,
        response: '',
        resYaml: '',
        last: null,
        toolResults: []
    });
    const config = ref<config>(JSON.parse(localStorage.getItem('oheya') || 'null') || defaultConfig);
    watch(config, (v) => localStorage.setItem('oheya', JSON.stringify(v)), { deep: true });
    return { status, config };
});