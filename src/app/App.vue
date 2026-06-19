<script setup lang="ts">
    import Settings from './Settings.vue';
    import Title from './Title.vue';
    
    import { useGlobalRefStore } from './utils/globalRef';
    import { storeToRefs } from 'pinia';


    const globalRef = useGlobalRefStore();
    const { status, config } = storeToRefs(globalRef);
</script>

<template>
    <Settings />
    <div class="flex flex-col justify-center items-center p-6 gap-3">
        <Title />
    </div>
    <Toast />
</template>