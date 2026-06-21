<script setup lang="ts">
    import InputText from 'primevue/inputtext';
    import InputGroup from 'primevue/inputgroup';
    import InputGroupAddon from 'primevue/inputgroupaddon';
    import Button from 'primevue/button';
    import Accordion from 'primevue/accordion';

    import { ref, watch, nextTick, computed, type VNodeRef } from 'vue';
    import { useElementSize } from '@vueuse/core';

    import Settings from './Settings.vue';
    import Title from './Title.vue';
    import ClassicItem from './classic-item.vue';
    import Targets from './targets.vue';
    
    import { useGlobalRefStore } from './utils/globalRef';
    import { storeToRefs } from 'pinia';
    const globalRef = useGlobalRefStore();
    const { status, config } = storeToRefs(globalRef);

    const searchbox = ref('');
    const genContentDiv = ref<VNodeRef | null>(null);
    const { width: genContentDivW, height: genContentDivH } = useElementSize(genContentDiv);
    watch([()=>(status.value.response), genContentDivH, genContentDivW], (newv, oldv)=>{
        nextTick(()=>{
            if(genContentDiv.value){
                (genContentDiv.value as HTMLElement).scrollTop = (genContentDiv.value as HTMLElement).scrollHeight;
            };
        });
    });
    const activeTargets = ref<string[]>([]);
    watch(() => status.value.resObj?.targets, (targets) => {
        if(targets){
            activeTargets.value = targets.map((_, i: number) => `target-${i}`);
        };
    }, { immediate: true });
</script>

<template>
    <Settings />
    <div class="flex flex-col justify-center items-center p-6 gap-5 mx-auto w-[90vw] sm:w-[65vw]">
        <Title />
        <InputGroup>
            <InputText :placeholder="config.lang === 'zh' ? '输入你想要了解的事物吧~' : 'Type What You Want to Know'" v-model="searchbox" />
            <InputGroupAddon>
                <Button icon="pi pi-search" :disabled="!searchbox" severity="" />
            </InputGroupAddon>
        </InputGroup>
        <div v-if="status.isGenerating && !status.isGenResult" ref="genContentDiv" class="max-h-[50vh] max-w-full break-all overflow-y-hidden text-gray-500 scrollbar-none scroll-smooth whitespace-pre-wrap" >
            {{ status.response }}
            <i class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-7xl! text-white" :class="`pi ${status.isToolCalling ? (status.isToolCalling === 'search' ? 'pi-search' : 'pi-eye') : 'pi-lightbulb'}`"></i>
        </div>

        <Accordion class="w-full" v-model="activeTargets">
            <Targets v-for="target, i in status.resObj?.targets" :id="`target-${i}`" :target="target" />
        </Accordion>
        

        <TransitionGroup name="item-float" tag="div" class="w-full flex flex-col justify-center items-center gap-5">
            <ClassicItem v-for="i in status.resObj?.classic" :key="i" :item="status.toolResults[i]" />
        </TransitionGroup>
    </div>
    <Toast />
</template>

<style>
    .item-float-enter-active {
        transition: all 0.25s cubic-bezier(0.3, 0.35, 0, 1);
    }
    .item-float-enter-from {
        opacity: 0;
        transform: translateY(0.5rem);
    }
</style>