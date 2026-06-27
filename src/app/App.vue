<script setup lang="ts">
    import InputText from 'primevue/inputtext';
    import InputGroup from 'primevue/inputgroup';
    import InputGroupAddon from 'primevue/inputgroupaddon';
    import Button from 'primevue/button';
    import Accordion from 'primevue/accordion';
    import ProgressSpinner from 'primevue/progressspinner';

    import { ref, watch, nextTick, type VNodeRef } from 'vue';
    import { useElementSize } from '@vueuse/core';

    import Settings from './Settings.vue';
    import Title from './Title.vue';
    import ClassicItem from './classic-item.vue';
    import Targets from './targets.vue';
    
    import { useToast } from 'primevue/usetoast';
    import { requestAI } from './utils/ai';
    import { useGlobalRefStore, setToast } from './utils/globalRef';
    import { storeToRefs } from 'pinia';
    const globalRef = useGlobalRefStore();
    const { status, config } = storeToRefs(globalRef);
    setToast(useToast());

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
    watch([()=>status.value.resObj, ()=>status.value.isGenerating, ()=>status.value.response], ()=>{
        if(!config.value.autoScroll){return;};
        nextTick(()=>{
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        });
    }, { deep: true });
    const activeTargets = ref<string[]>([]);
    watch(() => status.value.resObj?.targets, (targets) => {
        if(targets){
            activeTargets.value = targets.map((_, i: number) => `target-${i}`);
        };
    }, { immediate: true, flush: 'post' });

    function searchPressed(){
        if(searchbox.value){
            requestAI(searchbox.value);
        };
    };
</script>

<template>
    <Settings />
    <div class="flex flex-col justify-center items-center p-6 gap-5 mx-auto w-[90vw] sm:w-[65vw]">
        <Title />
        <InputGroup>
            <InputText :placeholder="config.lang === 'zh' ? '输入你想要了解的事物吧~' : 'Type What You Want to Know'" v-model="searchbox" @keydown="(e)=>{if(e.key==='Enter'){searchPressed()}}" />
            <InputGroupAddon>
                <ProgressSpinner v-if="status.isGenerating" class="h-6! w-6!" />
                <Button v-else icon="pi pi-search" :disabled="!searchbox" @click="searchPressed" />
            </InputGroupAddon>
        </InputGroup>
        <div v-if="status.isGenerating && !status.isGenResult" ref="genContentDiv" class="max-h-[50vh] max-w-full break-all overflow-y-hidden text-gray-500 scrollbar-none scroll-smooth whitespace-pre-wrap" >
            {{ status.response }}
            <i class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-7xl! text-white" :class="`pi ${status.isToolCalling ? (status.isToolCalling === 'search' ? 'pi-search' : 'pi-eye') : 'pi-lightbulb'}`"></i>
        </div>

        <Accordion class="w-full" v-model:value="activeTargets" multiple>
            <Targets v-for="target, i in status.resObj?.targets" :id="`target-${i}`" :key="`target-${i}`" :target="target" :active="activeTargets.includes(`target-${i}`)" />
        </Accordion>
        
        <TransitionGroup name="item-float" tag="div" class="w-full flex flex-col justify-center items-center gap-5">
            <ClassicItem v-for="i in status.resObj?.classic" :key="i" :item="status.toolResults[i]" />
        </TransitionGroup>
    </div>
    <Toast />
</template>

<style scoped>
    .item-float-enter-active {
        transition: all 0.25s cubic-bezier(0.3, 0.35, 0, 1);
    }
    .item-float-enter-from {
        opacity: 0;
        transform: translateY(0.5rem);
    }
</style>