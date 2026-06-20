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
    const responseChars = computed(() => status.value.response?.split(''));

    // TODO:
    status.value = {...status.value, toolResults: [
        {title: '搜索结果1', url: 'https://example.com', summary: '搜索结果1摘要'},
        {title: '搜索结果2', url: 'https://example.com', summary: '搜索结果2摘要'},
        {title: '搜索结果3', url: 'https://example.com', summary: '搜索结果3摘要'}
    ]}
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

        <!-- TODO: -->
        <Accordion multiple class="w-full" :value="Array.from({length: 2}, (_, i) => `target-${i}`)">
            <Targets :target="
                {'name':'特斯拉','category':'公司','brief':'一家美国的电动汽车及能源公司，致力于加速世界向可持续能源的转变。','confidence':95,'descriptions':[{'text':'成立于2003年，总部位于得克萨斯州奥斯汀','confidence':95,'cite':[1,2,1,1,1,1,1,1,1,1]},{'text':'以生产高性能纯电动汽车和储能产品闻名','confidence':98,'cite':[2]}],'attributes':[{'akey':'创始人','avalue':'马丁·艾伯哈德、马克·塔彭宁等','confidence':90,'cite':[1]},{'akey':'现任CEO','avalue':'埃隆·马斯克','confidence':99,'cite':[1]},{'akey':'主营业务','avalue':'电动汽车、储能设备、太阳能','confidence':95,'cite':[2]}],'tags':[{'tag':'电动车','confidence':0.99,'cite':[1,2]},{'tag':'新能源','confidence':0.95,'cite':[2,3]},{'tag':'美股上市','confidence':0.9,'cite':[3]}],'charts':[{'type':'bar','title':'特斯拉近三年全球汽车交付量（万辆）','labels':['2021','2022','2023'],'datasets':[{'label':'交付量','data':[93.6,131.3,180.8]}]},{'type':'line','title':'特斯拉2023年Q1-Q3营收（亿美元）','labels':['Q1','Q2','Q3'],'datasets':[{'label':'总营收','data':[233.3,249.3,233.5],'tension':0.3}]}],'related':[{'name':'埃隆·马斯克','confidence':0.99,'cite':[1,3]},{'name':'SpaceX','confidence':0.8,'cite':[1]},{'name':'比亚迪','confidence':0.85,'cite':[4]}]}
            " :id="`target-${1}`" />
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