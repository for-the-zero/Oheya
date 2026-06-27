import { createOpenAI } from '@ai-sdk/openai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText, isLoopFinished } from 'ai';
import yaml from 'js-yaml';

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
    try{
        const result = streamText({
            // model: createOpenAI({
            //     baseURL: `${config.corsMode ? config.corsPrefix : ''}${config.baseUrl}`,
            //     apiKey: config.key
            // })(config.model),
            model: createOpenAICompatible({
                name: 'API',
                baseURL: `${config.corsMode ? config.corsPrefix : ''}${config.baseUrl}`,
                apiKey: config.key
            })(config.model),
            instructions: config.prompt,
            prompt: kw,
            temperature: config.temperature,
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
            parseContent();
            if(isFinished){
                status.isGenerating = false;
                console.log(status);
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
};

const isEmpty = (v:any) => v == null || (typeof v === 'object' && !Object.keys(v).length) || (typeof v === 'string' && !v.trim());
function parseContent(){
    const { status } = useGlobalRefStore();
    if(!status.response){return;};
    let marker = '<--YAML START-->';
    let markerIndex = status.response.indexOf(marker);
    if(markerIndex === -1){return;};
    // status.isGenResult = true;
    let yamlContent = status.response.slice(markerIndex + marker.length);
    try {
        status.resObj = yaml.load(yamlContent) as aistatus['resObj'];
        if(!isEmpty(status.resObj)){
            status.isGenResult = true;
        };
    } catch (e) {
        return;
    };
};