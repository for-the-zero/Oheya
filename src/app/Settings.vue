<script setup lang="ts">
    import Button from 'primevue/button';
    import Drawer from 'primevue/drawer';
    import Tabs from 'primevue/tabs';
    import TabList from 'primevue/tablist';
    import Tab from 'primevue/tab';
    import TabPanels from 'primevue/tabpanels';
    import TabPanel from 'primevue/tabpanel';
    import SelectButton from 'primevue/selectbutton';
    import Slider from 'primevue/slider';
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Message from 'primevue/message';

    import { ref, watch } from 'vue';
    import { useGlobalRefStore } from './utils/globalRef';
    import { storeToRefs } from 'pinia';
    const globalRef = useGlobalRefStore();
    const { config } = storeToRefs(globalRef);

    const visible = ref(false);
    const editing_lang = ref(config.value.lang);
    const editing_vibra = ref(config.value.vibration);
    const editing_corsm = ref(config.value.corsMode);
    const editing_corsp = ref(config.value.corsPrefix);
    const editing_base = ref(config.value.baseUrl);
    const editing_key = ref(config.value.key);
    const editing_model = ref(config.value.model);
    const editing_temp = ref(config.value.temperature);
    const editing_prompts = ref(config.value.prompts);
    const editing_activep = ref(config.value.activePrompt);
    const editing_search = ref(config.value.search);
    const editing_content = ref(config.value.content);
    const editing_ta_exa = ref(config.value.toolsKeys.exa);
    const editing_ta_uapi = ref(config.value.toolsKeys.uapi);
    const editing_ta_querit = ref(config.value.toolsKeys.querit);
    const import_config = ref('');
    const import_config_valid = ref(false);

    watch(import_config, (v)=>{
        if(!v){
            import_config_valid.value = false;
            return;
        };
        try{
            const json = JSON.parse(v);
            // TODO: zod验证
            import_config_valid.value = true;
        }catch(e){
            import_config_valid.value = false;
        };
    });

    // TODO: 保存、重置、恢复、导入导出

</script>

<template>
    <Button class="fixed! top-5 right-5" icon="pi pi-cog" severity="secondary" @click="visible = true" />
    <Drawer v-model:visible="visible" :header="config.lang === 'zh' ? '设置' : 'Settings'" position="right" class="w-[90vw]! sm:w-125!">
        <Tabs value="g">
            <TabList>
                <Tab value="g">{{ config.lang === 'zh' ? '应用' : 'APP' }}</Tab>
                <Tab value="m">{{ config.lang === 'zh' ? '模型' : 'Model' }}</Tab>
                <Tab value="s">{{ config.lang === 'zh' ? '搜索' : 'Search' }}</Tab>
                <Tab value="a">{{ config.lang === 'zh' ? '关于' : 'About' }}</Tab>
            </TabList>
            <TabPanels>

                <TabPanel value="g" class="flex flex-col items-start gap-3">
                    <h1 class="text-xl">语言 / Language</h1>
                    <SelectButton :options="[{l:'中文',v:'zh'},{l:'English',v:'en'}]" optionLabel="l" optionValue="v" v-model="editing_lang" :allowEmpty="false" />
                    <h1 class="text-xl">{{ config.lang === 'zh' ? '震动反馈' : 'Vibrantion Feedback' }}</h1>
                    <p class="text-sm">{{ config.lang === 'zh' 
                        ? '每收到一个Token震动一次，推荐有线性震动马达的手机开启' 
                        : 'Vibrate once for each token received, recommended for devices with linear vibration motor'
                    }}</p>
                    <div class="flex flex-row items-center justify-center w-full gap-3">
                        <Slider v-model="editing_vibra" :step="5" :min="0" :max="60" class="flex-1" />
                        <div class="text-sm shrink-0 whitespace-nowrap">{{ editing_vibra }} ms</div>
                    </div>
                    <h1 class="text-xl">CORS Proxy</h1>
                    <p class="text-sm">{{ config.lang === 'zh' 
                        ? '这里提供的大部分第三方api都要依赖CORS Proxy才能运作，而且你配置的LLM可能也需要借助CORS Proxy，否则会请求失败' 
                        : 'The most third-party APIs need CORS Proxy to work, and your LLM may also need CORS Proxy, otherwise the request will fail' 
                    }}</p>
                    <FloatLabel>
                        <InputText v-model="editing_corsp" fluid />
                        <Message size="small" severity="secondary" variant="simple" class="text-xs">{{ config.lang === 'zh' ? 'URL前缀将在请求时添加到目标url前面' : 'URL prefix will be prepended to the target URL upon request' }}</Message>
                    </FloatLabel>
                    <h1 class="text-xl">{{ config.lang === 'zh' ? '应用配置' : 'APP Configs' }}</h1>
                    <div class="flex flex-row items-center justify-center gap-2 w-full">
                        <Button icon="pi pi-undo" v-tooltip.top="config.lang === 'zh' ? '恢复为默认设置' : 'Reset to Default'" variant="outlined"/>
                        <Button icon="pi pi-file-export" :label="config.lang === 'zh' ? '复制配置JSON' : 'Copy Config JSON'" fluid />
                    </div>
                    <div class="flex flex-row items-center justify-center gap-2 w-full">
                        <InputText v-model="import_config" fluid :invalid="!import_config_valid" />
                        <Button icon="pi pi-file-import" :disabled="!import_config_valid" v-tooltip.top="config.lang === 'zh' ? '导入配置' : 'Import Config'" variant="outlined"/>
                    </div>
                </TabPanel>

                <TabPanel value="m" class="flex flex-col items-start gap-3">
                    m
                </TabPanel>

                <TabPanel value="s" class="flex flex-col items-start gap-3">
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