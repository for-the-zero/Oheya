import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import pmtZh from './prompt.zh.md?raw';
import pmtEn from './prompt.en.md?raw';

export const useGlobalRefStore = defineStore('globalRef', () => {
    const status = ref<status>({
        isGenerating: false,
        isGenResult: false,
        response: '',
        resYaml: '',
        lastToken: '',
        toolResults: []
    });
    const config = ref<config>(JSON.parse(localStorage.getItem('oheya') || 'null') || {
        lang: navigator.language.includes('zh') ? 'zh' : 'en',
        corsMode: false,
        corsPrefix: '',
        baseUrl: '',
        key: '',
        model: '',
        prompts: [pmtZh, pmtEn],
        activePrompt: 0,
        search: 'exa',
        content: 'exa',
        toolsKeys: {
            exa: '',
            uapi: '',
            jina: ''
        }
    });
    watch(config, (v) => localStorage.setItem('oheya', JSON.stringify(v)), { deep: true });
    return { status, config };
});