<script setup lang="ts">
    import Button from 'primevue/button';
    import Drawer from 'primevue/drawer';
    import Tabs from 'primevue/tabs';
    import TabList from 'primevue/tablist';
    import Tab from 'primevue/tab';
    import TabPanels from 'primevue/tabpanels';
    import TabPanel from 'primevue/tabpanel';


    import { ref } from 'vue';
    import { useGlobalRefStore } from './utils/globalRef';
    import { storeToRefs } from 'pinia';
    const globalRef = useGlobalRefStore();
    const { status, config } = storeToRefs(globalRef);

    const visible = ref(false);

</script>

<template>
    <Button class="fixed! top-5 right-5" icon="pi pi-cog" severity="secondary" @click="visible = true" />
    <Drawer v-model:visible="visible" :header="config.lang === 'zh' ? '设置' : 'Settings'" position="right">
        <Tabs value="g">
            <TabList>
                <Tab value="g">{{ config.lang === 'zh' ? '应用' : 'APP' }}</Tab>
                <Tab value="m">{{ config.lang === 'zh' ? '模型' : 'Model' }}</Tab>
                <Tab value="s">{{ config.lang === 'zh' ? '搜索' : 'Search' }}</Tab>
                <Tab value="a">{{ config.lang === 'zh' ? '关于' : 'About' }}</Tab>
            </TabList>
            <TabPanels>

                <TabPanel value="g">
                    g
                </TabPanel>

                <TabPanel value="m">
                    m
                </TabPanel>

                <TabPanel value="s">
                    s
                </TabPanel>

                <TabPanel value="a" class="flex flex-col items-center gap-3 text-center">
                    <h1 class="text-3xl">Oheya</h1>
                    <p>{{ config.lang === 'zh' ? '一个由大模型驱动的知识图谱生成引擎' : 'An LLM-driven knowledge graph generation engine' }}</p>
                    <div class="flex flex-row flex-wrap gap-2">
                        <Button icon="pi pi-github" v-tooltip.bottom="'Github'" class="text-xl" severity="secondary" as="a" href="https://github.com/for-the-zero/Oheya" target="_blank" />
                        <Button icon="pi pi-id-card" v-tooltip.bottom="config.lang === 'zh' ? '作者的个人主页' : 'Personal Website of the Developer'" class="text-xl" severity="secondary" as="a" href="https://ftz.is-a.dev/" target="_blank" />
                        <Button icon="pi pi-table" v-tooltip.bottom="'Free-LLM-Collection'" class="text-xl" severity="secondary" as="a" href="https://github.com/for-the-zero/Free-LLM-Collection" target="_blank" />
                    </div>
                </TabPanel>

            </TabPanels>
        </Tabs>
        <template #footer>
            <div class="justify-end flex flex-row gap-3">
                <Button icon="pi pi-undo" v-tooltip.top="config.lang === 'zh' ? '恢复为当前设置' : 'Restore to Current'" severity="secondary" @click="" />
                <Button icon="pi pi-save" :label="config.lang === 'zh' ? '保存' : 'Save'" @click="" />
            </div>
        </template>
    </Drawer>
</template>