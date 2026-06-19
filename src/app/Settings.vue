<script setup lang="ts">
    import { useToast } from 'primevue/usetoast';
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
    import InputGroup from 'primevue/inputgroup';
    import InputGroupAddon from 'primevue/inputgroupaddon';
    import ToggleSwitch from 'primevue/toggleswitch';
    import Password from 'primevue/password';
    import Textarea from 'primevue/textarea';
    import Divider from 'primevue/divider';
    import Select from 'primevue/select';
    import IftaLabel from 'primevue/iftalabel';

    import { ref, watch } from 'vue';
    import { useGlobalRefStore } from './utils/globalRef';
    import { storeToRefs } from 'pinia';
    import { defaultConfig } from './utils/globalRef';
    import pmtZh from './utils/prompt.zh.md?raw';
    import pmtEn from './utils/prompt.en.md?raw';
    import { z } from 'zod';
    const globalRef = useGlobalRefStore();
    const { config } = storeToRefs(globalRef);
    const toast = useToast();

    const visible = ref(false);
    const editing_lang = ref(config.value.lang);
    const editing_vibra = ref(config.value.vibration);
    const editing_corsm = ref(config.value.corsMode);
    const editing_corsp = ref(config.value.corsPrefix);
    const editing_base = ref(config.value.baseUrl);
    const editing_key = ref(config.value.key);
    const editing_model = ref(config.value.model);
    const editing_temp = ref(config.value.temperature);
    const editing_prompt = ref(config.value.prompt);
    const editing_search = ref(config.value.search);
    const editing_content = ref(config.value.content);
    const editing_ta_exa = ref(config.value.toolsKeys.exa);
    const editing_ta_uapi = ref(config.value.toolsKeys.uapi);
    const editing_ta_tavily = ref(config.value.toolsKeys.tavily);
    const editing_ta_querit = ref(config.value.toolsKeys.querit);
    const import_config = ref('');
    const import_config_valid = ref(false);

    const configSchema = z.object({ lang: z.enum(['zh', 'en']), vibration: z.number(), corsMode: z.boolean(), corsPrefix: z.string(), baseUrl: z.string(), key: z.string(), model: z.string(), temperature: z.number(), prompt: z.string(), search: z.enum(['exa', 'uapi', 'tavily', 'querit']), content: z.enum(['exa', 'tavily', 'md.new']), toolsKeys: z.object({ exa: z.string(), uapi: z.string(), tavily: z.string(), querit: z.string() }) });
    watch(import_config, (v)=>{
        if(!v){
            import_config_valid.value = false;
            return;
        };
        try{
            const json = JSON.parse(v);
            import_config_valid.value = configSchema.safeParse(json).success;
        }catch(e){
            import_config_valid.value = false;
        };
    });
    function copyConfig(){
        navigator.clipboard.writeText(JSON.stringify(config.value, null, 2));
    };
    function importConfig(){
        try{
            const json = configSchema.parse(JSON.parse(import_config.value));
            editing_lang.value = json.lang; editing_vibra.value = json.vibration; editing_corsm.value = json.corsMode; editing_corsp.value = json.corsPrefix; editing_base.value = json.baseUrl; editing_key.value = json.key; editing_model.value = json.model; editing_temp.value = json.temperature; editing_prompt.value = json.prompt; editing_search.value = json.search; editing_content.value = json.content; editing_ta_exa.value = json.toolsKeys.exa; editing_ta_uapi.value = json.toolsKeys.uapi; editing_ta_tavily.value = json.toolsKeys.tavily; editing_ta_querit.value = json.toolsKeys.querit;
        }catch(e){
            import_config_valid.value = false;
        };
    };
    function save(){
        let need_notice = false;
        if(!editing_base.value || !editing_model.value || !editing_prompt.value){
            toast.add({severity: 'warn', life: 2500, summary: config.value.lang === 'zh' ? '还有没填的东西……' : 'Missing required fields', detail: config.value.lang === 'zh' ? '请检查必填项是否填写完整' : 'Please check required fields', closable: true});
            need_notice = true;
        };
        if((editing_search.value === 'exa' || editing_content.value === 'exa') && !editing_ta_exa.value){
            toast.add({severity: 'warn', life: 2500, summary: config.value.lang === 'zh' ? '还有没填的东西……' : 'Missing required fields', detail: config.value.lang === 'zh' ? '请填写 Exa API Key' : 'Please fill in the Exa API Key', closable: true});
            need_notice = true;
        };
        if((editing_search.value === 'tavily' || editing_content.value === 'tavily') && !editing_ta_tavily.value){
            toast.add({severity: 'warn', life: 2500, summary: config.value.lang === 'zh' ? '还有没填的东西……' : 'Missing required fields', detail: config.value.lang === 'zh' ? '请填写 Tavily API Key' : 'Please fill in the Tavily API Key', closable: true});
            need_notice = true;
        };
        if(editing_search.value === 'querit' && !editing_ta_querit.value){
            toast.add({severity: 'warn', life: 2500, summary: config.value.lang === 'zh' ? '还有没填的东西……' : 'Missing required fields', detail: config.value.lang === 'zh' ? '请填写 Querit API Key' : 'Please fill in the Querit API Key', closable: true});
            need_notice = true;
        };
        config.value.lang = editing_lang.value; config.value.vibration = editing_vibra.value; config.value.corsMode = editing_corsm.value; config.value.corsPrefix = editing_corsp.value; config.value.baseUrl = editing_base.value; config.value.key = editing_key.value; config.value.model = editing_model.value; config.value.temperature = editing_temp.value; config.value.prompt = editing_prompt.value; config.value.search = editing_search.value; config.value.content = editing_content.value; config.value.toolsKeys.exa = editing_ta_exa.value; config.value.toolsKeys.uapi = editing_ta_uapi.value; config.value.toolsKeys.tavily = editing_ta_tavily.value; config.value.toolsKeys.querit = editing_ta_querit.value; visible.value = false;
        let notice = need_notice ? {detail: config.value.lang === 'zh' ? '但是配置项并不完整，可能会有问题' : 'But the configuration is not complete, there may be problems'} : {};
        toast.add({severity: 'success', life: 2500, summary: config.value.lang === 'zh' ? '保存成功' : 'Saved', closable: true, ...notice});
    };
    function restore(){ editing_lang.value = config.value.lang; editing_vibra.value = config.value.vibration; editing_corsm.value = config.value.corsMode; editing_corsp.value = config.value.corsPrefix; editing_base.value = config.value.baseUrl; editing_key.value = config.value.key; editing_model.value = config.value.model; editing_temp.value = config.value.temperature; editing_prompt.value = config.value.prompt; editing_search.value = config.value.search; editing_content.value = config.value.content; editing_ta_exa.value = config.value.toolsKeys.exa; editing_ta_uapi.value = config.value.toolsKeys.uapi; editing_ta_tavily.value = config.value.toolsKeys.tavily; editing_ta_querit.value = config.value.toolsKeys.querit; };
    function resetDefault(){ editing_lang.value = defaultConfig.lang; editing_vibra.value = defaultConfig.vibration; editing_corsm.value = defaultConfig.corsMode; editing_corsp.value = defaultConfig.corsPrefix; editing_base.value = defaultConfig.baseUrl; editing_key.value = defaultConfig.key; editing_model.value = defaultConfig.model; editing_temp.value = defaultConfig.temperature; editing_prompt.value = defaultConfig.prompt; editing_search.value = defaultConfig.search || 'uapi'; editing_content.value = defaultConfig.content || 'md.new'; editing_ta_exa.value = defaultConfig.toolsKeys.exa; editing_ta_uapi.value = defaultConfig.toolsKeys.uapi; editing_ta_tavily.value = defaultConfig.toolsKeys.tavily; editing_ta_querit.value = defaultConfig.toolsKeys.querit; };
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
                        <Button icon="pi pi-undo" v-tooltip.top="config.lang === 'zh' ? '恢复为默认设置' : 'Reset to Default'" variant="outlined" @click="resetDefault"/>
                        <Button icon="pi pi-file-export" :label="config.lang === 'zh' ? '复制配置JSON' : 'Copy Config JSON'" fluid @click="copyConfig" />
                    </div>
                    <div class="flex flex-row items-center justify-center gap-2 w-full">
                        <InputText v-model="import_config" fluid :invalid="!import_config_valid" />
                        <Button icon="pi pi-file-import" :disabled="!import_config_valid" v-tooltip.top="config.lang === 'zh' ? '导入配置' : 'Import Config'" variant="outlined" @click="importConfig"/>
                    </div>
                </TabPanel>

                <TabPanel value="m" class="flex flex-col items-start gap-3">
                    <h1 class="text-xl">API</h1>
                    <InputGroup>
                        <InputGroupAddon class="shrink-0">
                            <ToggleSwitch v-model="editing_corsm" v-tooltip.top="config.lang === 'zh' ? '启用CORS Proxy' : 'Enable CORS Proxy'" />
                        </InputGroupAddon>
                        <FloatLabel variant="on"> 
                            <InputText v-model="editing_base" fluid placeholder="https://your-api.ai" :invalid="!editing_base" />
                            <label>BaseURL</label>
                        </FloatLabel>
                        <InputGroupAddon v-tooltip.top="config.lang === 'zh' ? '只支持OpenAI格式端点' : 'Only supports OpenAI format endpoints'" class="shrink-0 text-xs">/chat/completions</InputGroupAddon>
                    </InputGroup>
                    <div class="w-full flex flex-row items-center justify-center gap-2">
                        <FloatLabel variant="on">
                            <Password v-model="editing_key" fluid toggleMask :feedback="false" />
                            <label>Key</label>
                        </FloatLabel>
                        <FloatLabel variant="on">
                            <InputText v-model="editing_model" fluid :invalid="!editing_model" />
                            <label>Model ID</label>
                        </FloatLabel>
                    </div>
                    <div class="flex flex-row items-center justify-center w-full gap-4">
                        <div class="shrink-0 whitespace-nowrap">Temperature: {{ editing_temp.toFixed(2) }}</div>
                        <Slider v-model="editing_temp" :step="0.05" :min="0" :max="1" class="flex-1" />
                    </div>
                    <Divider />
                    <h1 class="text-xl">{{ config.lang === 'zh' ? '系统提示词' : 'System Prompts' }}</h1>
                    <Textarea v-model="editing_prompt" rows="7" fluid size="small" :invalid="!editing_prompt" />
                    <div class="flex flex-row items-center justify-center gap-2 w-full">
                        <Button icon="pi pi-pencil" label="默认(中文)" variant="outlined" @click="editing_prompt = pmtZh"/>
                        <Button icon="pi pi-pencil" label="Default(English)" variant="outlined" @click="editing_prompt = pmtEn"/>
                    </div>
                </TabPanel>

                <TabPanel value="s" class="flex flex-col items-start gap-3">
                    <h1 class="text-xl">{{ config.lang === 'zh' ? '搜索API' : 'Search API' }}</h1>
                    <div class="flex flex-row items-center justify-center gap-2 w-full">
                        <Select fluid v-model="editing_search" :options="[{l:'Exa',v:'exa'},{l:'UApi',v:'uapi'},{l:'Tavily',v:'tavily'},{l:'Querit',v:'querit'}]" optionLabel="l" optionValue="v" checkmark size="small" />
                        <Button icon="pi pi-external-link" v-tooltip.top="config.lang === 'zh' ? '打开相关网站' : 'Open the Website'" severity="secondary" class="shrink-0" size="small"
                            as="a" target="_blank" :href="{'exa':'https://exa.ai/docs/reference/search', 'uapi': 'https://uapis.cn/docs/api-reference/post-search-aggregate', 'tavily': 'https://docs.tavily.com/documentation/api-reference/endpoint/search', 'querit': 'https://www.querit.ai/en/docs/reference/post'}[editing_search]"
                        />
                    </div>
                    <h1 class="text-xl">{{ config.lang === 'zh' ? '抓取API' : 'Content API' }}</h1>
                    <div class="flex flex-row items-center justify-center gap-2 w-full"> 
                        <Select fluid v-model="editing_content" :options="[{l:'Exa',v:'exa'},{l:'Tavily',v:'tavily'},{l:'markdown.new',v:'md.new'}]" optionLabel="l" optionValue="v" checkmark size="small" />
                        <Button icon="pi pi-external-link" v-tooltip.top="config.lang === 'zh' ? '打开相关网站' : 'Open the Website'" severity="secondary" class="shrink-0" size="small"
                            as="a" target="_blank" :href="{'exa':'https://exa.ai/docs/reference/get-contents', 'tavily': 'https://docs.tavily.com/documentation/api-reference/endpoint/extract', 'md.new':' https://markdown.new'}[editing_content]"
                        />
                    </div>
                    <h1 class="text-xl">API Keys</h1>
                    <IftaLabel class="w-full" v-if="editing_search === 'exa' || editing_content === 'exa'">
                        <Password v-model="editing_ta_exa" fluid :invalid="!editing_ta_exa" toggleMask :feedback="false" />
                        <label>Exa</label>
                    </IftaLabel>
                    <IftaLabel class="w-full" v-if="editing_search === 'uapi'">
                        <Password v-model="editing_ta_uapi" fluid toggleMask :feedback="false" />
                        <label>UApi</label>
                        <Message size="small" severity="secondary" variant="simple">{{ config.lang === 'zh' ? '使用该API可以不需要填写API Key，但是有一定限制' : 'This API can be used without an API key, but with certain limitations' }}</Message>
                    </IftaLabel>
                    <IftaLabel class="w-full" v-if="editing_search === 'tavily' || editing_content === 'tavily'">
                        <Password v-model="editing_ta_tavily" fluid :invalid="!editing_ta_tavily" toggleMask :feedback="false" />
                        <label>Tavily</label>
                    </IftaLabel>
                    <IftaLabel class="w-full" v-if="editing_search === 'querit'">
                        <Password v-model="editing_ta_querit" fluid :invalid="!editing_ta_querit" toggleMask :feedback="false" />
                        <label>Querit</label>
                    </IftaLabel>
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
                <Button icon="pi pi-undo" v-tooltip.top="config.lang === 'zh' ? '恢复为当前设置' : 'Restore to Current'" severity="secondary" @click="restore" />
                <Button icon="pi pi-save" :label="config.lang === 'zh' ? '保存' : 'Save'" @click="save" />
            </div>
        </template>
    </Drawer>
</template>