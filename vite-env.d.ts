/// <reference types="vite/client" />
/// <reference types="vue/compiler-sfc" />

interface aistatus{
    isGenerating: boolean;
    isGenResult: boolean;
    isToolCalling: false | 'search' | 'fetch';
    response?: string;
    resObj?: result;
    toolResults: {
        title: string;
        summary: string;
        content?: string | null;
        url: string;
    }[];
};

interface config{
    lang: 'zh' | 'en';
    vibration: number;
    autoScroll: boolean;
    corsMode: boolean;
    corsPrefix: string;
    baseUrl: string;
    key: string;
    model: string;
    temperature: number;
    reasoning: 'provider-default' | 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh'
    prompt: string;
    search: 'exa' | 'uapi' | 'tavily' | 'querit';
    content: 'exa' | 'tavily' | 'md.new';
    toolsKeys: {
        exa: string;
        uapi: string;
        tavily: string;
        querit: string;
    };
};

interface result{
    targets?: {
        name?: string;
        category?: string;
        brief?: string;
        confidence?: number;
        descriptions?: {
            text?: string;
            confidence?: number;
            cite?: number[];
        }[];
        attributes?: {
            akey?: string;
            avalue?: string;
            confidence?: number;
            cite?: number[];
        }[];
        tags?: {
            tag?: string;
            confidence?: number;
            cite?: number[];
        }[];
        charts?: result_chart[];
        related?: {
            name?: string;
            confidence?: number;
            cite?: number[];
        }[];
    }[];
    classic?: number[];
};
type result_chart = {
    type?: 'bar' | 'line';
    title?: string;
    labels?: string[];
    datasets?: {
        label?: string;
        data?: number[];
        tension?: number;
    }[];
} | {
    type?: 'pie';
    title?: string;
    labels?: string[];
    data?: number[];
};