<script setup lang="ts">
    import AccordionPanel from 'primevue/accordionpanel';
    import AccordionHeader from 'primevue/accordionheader';
    import AccordionContent from 'primevue/accordioncontent';
    import Knob from 'primevue/knob';
    import Divider from 'primevue/divider';
    import Popover from 'primevue/popover';
    import ProgressBar from 'primevue/progressbar';
    import Fieldset from 'primevue/fieldset';    
    import Chip from 'primevue/chip';

    import ClassicItem from './classic-item.vue';
    import Chart from './Charts.vue';

    const { target, id } = defineProps<{ target: NonNullable<result['targets']>[number], id: string }>();
    import { ref } from 'vue';
    import { useGlobalRefStore } from './utils/globalRef';
    import { storeToRefs } from 'pinia';
    const globalRef = useGlobalRefStore();
    const { status, config } = storeToRefs(globalRef);

    function getCfdcColor(cfdc?: number): string{
        if(!cfdc){
            return 'gray';
        } else if(cfdc >= 85){
            return 'mediumseagreen';
        } else if(cfdc >= 60){
            return 'cornflowerblue';
        } else if(cfdc >= 40){
            return 'goldenrod';
        } else {
            return 'indianred';
        };
    };

    const pop = ref();
    const active_pop = ref<{cite?: number[], confidence?: number}>({cite: [], confidence: 100});
    function openPop(e: Event, props: {cite?: number[], confidence?: number}){
        const target = e.currentTarget as HTMLElement;
        active_pop.value = props;
        if (pop.value.visible) {
            pop.value.hide();
            setTimeout(() => {
                pop.value.show(e, target);
            }, 50);
        } else {
            pop.value.show(e, target);
        };
    };
</script>

<template>
    <AccordionPanel :value="id">
        <AccordionHeader>
            <div class="flex justify-between items-center w-full mr-4">
                <div class="flex flex-col ">
                    <span class="text-2xl">{{ target.name }}</span>
                    <span class="text-sm">{{ target.category }}</span>
                </div>
                <Knob v-if="typeof target.confidence === 'number'" v-tooltip.top="config.lang === 'zh' ? '可信度' : 'Confidence'" :size="60" :min="0" :max="100" :modelValue="target.confidence" :valueColor="getCfdcColor(target.confidence)" readonly />
            </div>
        </AccordionHeader>
        <AccordionContent>
            <div class="flex flex-col gap-2">

                <h1 v-if="target.brief" class="text-xl">{{ config.lang === 'zh' ? '介绍' : 'Introduction' }}</h1>
                <p v-if="target.brief">{{ target.brief }}</p>
                <Divider />

                <h1 v-if="target.descriptions && target.descriptions.length > 0" class="text-xl">{{ config.lang === 'zh' ? '描述' : 'Descriptions' }}</h1>
                <div v-if="target.descriptions && target.descriptions.length > 0">
                    <span v-for="desc in target.descriptions" class="mr-4 underline underline-offset-3 decoration-2 cursor-pointer" :style="`text-decoration-color: ${getCfdcColor(desc.confidence)}`" @click="(e)=>{openPop(e,{cite: desc.cite, confidence: desc.confidence})}">{{ desc.text }} "</span>
                </div>
                <Divider />

                <h1 v-if="target.attributes && target.attributes.length > 0" class="text-xl">{{ config.lang === 'zh' ? '属性' : 'Attr' }}</h1>
                <div v-if="target.attributes && target.attributes.length > 0">
                    <span v-for="attr in target.attributes" class="mr-4 **:data-[pc-section='root']:p-2! cursor-pointer" @click="(e)=>{openPop(e,{cite: attr.cite, confidence: attr.confidence})}">
                        <Fieldset class="inline-block" :pt="{legend: {style: `padding: 2px;border: none;`}, content: {style: `transform: translateY(-5px);color: ${getCfdcColor(attr.confidence)}`}}">
                            <template #legend>
                                <span class="text-xs">{{ attr.akey }}</span>
                            </template>
                            <span class="text-sm font-bold">{{ attr.avalue }}</span>
                        </Fieldset>
                    </span>
                </div>
                <Divider />

                <h1 v-if="target.tags && target.tags.length > 0" class="text-xl">{{ config.lang === 'zh' ? '标签' : 'Tags' }}</h1>
                <div v-if="target.tags && target.tags.length > 0">
                    <div v-for="tag in target.tags" class="inline mr-4 cursor-pointer" @click="(e)=>{openPop(e,{cite: tag.cite, confidence: tag.confidence})}">
                        <Chip>
                            <div class="flex flex-row items-center justify-center gap-2">
                                <span class="rounded-full pi pi-tag p-2" :style="`background-color: ${getCfdcColor(tag.confidence)}`" ></span>
                                <span class="font-medium" >{{ tag.tag }}</span>
                            </div>
                        </Chip>
                    </div>
                </div>
                <Divider />

                <h1 v-if="target.charts && target.charts.length > 0" class="text-xl">{{ config.lang === 'zh' ? '图表' : 'Charts' }}</h1>
                <Chart v-if="target.charts && target.charts.length > 0" v-for="chart in target.charts" :chart="chart" />
                <Divider />

                <h1 v-if="target.related && target.related.length > 0" class="text-xl">{{ config.lang === 'zh' ? '相关内容' : 'Related' }}</h1>
                <div v-if="target.related && target.related.length > 0">
                    <div v-for="rel in target.related" class="inline mr-4 cursor-pointer" @click="(e)=>{openPop(e,{cite: rel.cite, confidence: rel.confidence})}">
                        <Chip>
                            <div class="flex flex-row items-center justify-center gap-2">
                                <span class="rounded-full pi pi-link p-2" :style="`background-color: ${getCfdcColor(rel.confidence)}`" ></span>
                                <span class="font-medium" >{{ rel.name }}</span>
                            </div>
                        </Chip>
                    </div>
                </div>

            </div>

            <Popover ref="pop">
                <div class="w-60 flex flex-col gap-3 overflow-y-auto max-h-[50vh]">
                    <ProgressBar v-if="typeof active_pop.confidence === 'number'" class="w-full h-5 shrink-0" :value="active_pop.confidence">{{ config.lang === 'zh' ? '可信度：' : 'Confidence:' }}{{ active_pop.confidence }}</ProgressBar>
                    <ClassicItem v-for="i in active_pop.cite" :item="status.toolResults[i]" />
                </div>
            </Popover>
        </AccordionContent>
    </AccordionPanel>
</template>