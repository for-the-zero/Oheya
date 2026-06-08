import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useGlobalRefStore = defineStore('globalRef', () => {
    const status = ref<string>('initial');
    const config = ref<Record<string, unknown>>({});
    return { status, config };
});
