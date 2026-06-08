<script setup lang="ts">
    import Button from 'primevue/button';
    
    import { useGlobalRefStore } from './utils/globalRef';
    import { storeToRefs } from 'pinia';

    const globalRef = useGlobalRefStore();
    const { status, config } = storeToRefs(globalRef);
</script>

<template>
    <Button label="Click Me" icon="pi pi-play" />
</template>