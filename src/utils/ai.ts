import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText, isLoopFinished } from 'ai';
import yaml from 'js-yaml';
// import { getCurrentInstance } from 'vue'

import { useGlobalRefStore, getToast } from './globalRef';
import { searchTool, getFullTextTool } from './tools';

export async function requestAI(kw: string){
    const { status, config } = useGlobalRefStore();
    status.isGenerating = true;
    status.isGenResult = false;
    status.isToolCalling = false;
    status.response = '';
    status.resObj = {};
    status.toolResults = [];
    _lastYamlText = '';
    _pendingParsed = null;
    if(_throttleTimer){clearTimeout(_throttleTimer); _throttleTimer = null;};
    try{
        const result = streamText({
            model: createOpenAICompatible({
                name: 'API',
                baseURL: `${config.corsMode ? config.corsPrefix : ''}${config.baseUrl}`,
                apiKey: config.key
            })(config.model),
            instructions: config.prompt,
            prompt: kw,
            temperature: config.temperature,
            reasoning: config.reasoning,
            tools: {
                search: searchTool,
                getFullText: getFullTextTool
            },
            stopWhen: isLoopFinished(),
        });
        let isReasoning = false;
        let isFinished = false;
        for await(const part of result.stream){
            // console.log(part);
            switch(part.type){
                case 'reasoning-delta':
                    if(isReasoning){
                        status.response += part.text;
                    }else{
                        status.response = '\n' + part.text;
                        isReasoning = true;
                    };
                    if(navigator?.vibrate){navigator.vibrate(config.vibration);};
                    break;
                case 'text-delta':
                    if(!isReasoning){
                        status.response += part.text;
                    }else{
                        status.response = '\n' + part.text;
                        isReasoning = false;
                    };
                    if(navigator?.vibrate){navigator.vibrate(config.vibration);};
                    break;
                case 'finish':
                    isFinished = true;
            };
            parseContent(isFinished);
            if(isFinished){
                status.isGenerating = false;
                console.log(status);
                // getCurrentInstance()?.proxy?.$forceUpdate();
                break;
            };
        };
    }catch(e){
        const msg = e instanceof Error ? e.message : String(e);
        console.error(e);
        getToast()?.add({
            severity: 'warn',
            life: 2500,
            summary: config.lang === 'zh' ? 'AI请求出错' : 'AI request failed',
            detail: msg,
            closable: true,
        });
        status.isGenerating = false;
    };
    _lastYamlText = '';
};

const isEmpty = (v:any) => v == null || (typeof v === 'object' && !Object.keys(v).length) || (typeof v === 'string' && !v.trim());

function deepMerge(target: any, source: any){
    for(const key of Object.keys(source)){
        const sv = source[key];
        const tv = target[key];
        if(sv && typeof sv === 'object' && !Array.isArray(sv) && tv && typeof tv === 'object' && !Array.isArray(tv)){
            deepMerge(tv, sv);
        }else{
            target[key] = sv;
        };
    };
};

let _lastYamlText = '';
let _pendingParsed: aistatus['resObj'] | null = null;
let _throttleTimer: ReturnType<typeof setTimeout> | null = null;

function flushParsed(){
    if(!_pendingParsed){return;};
    const { status } = useGlobalRefStore();
    if(status.resObj){
        deepMerge(status.resObj, _pendingParsed);
    }else{
        status.resObj = _pendingParsed;
    };
    status.isGenResult = true;
    _pendingParsed = null;
};

// const THROTTLE_MS = 250;
const THROTTLE_MS = 100;
function parseContent(flush = false){
    const { status } = useGlobalRefStore();
    if(!status.response){return;};
    const marker = '<--YAML START-->';
    const markerIndex = status.response.indexOf(marker);
    if(markerIndex === -1){return;};
    const yamlContent = status.response.slice(markerIndex + marker.length);
    if(yamlContent === _lastYamlText){return;};
    _lastYamlText = yamlContent;
    try {
        const parsed = yaml.load(yamlContent) as aistatus['resObj'];
        if(isEmpty(parsed)){return;};
        _pendingParsed = parsed;
        if(flush){
            if(_throttleTimer){clearTimeout(_throttleTimer); _throttleTimer = null;};
            flushParsed();
        }else if(!_throttleTimer){
            _throttleTimer = setTimeout(() => {
                _throttleTimer = null;
                flushParsed();
            }, THROTTLE_MS);
        };
    } catch (e) {
        return;
    };
};