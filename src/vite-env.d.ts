/// <reference types="vite/client" />
declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
};

interface status{
    isGenerating: boolean;
    isGenResult: boolean;
    response: string;
    resYaml: string;
    lastToken: string;
    toolResults: {
        title: string;
        summary: string;
        content: string;
        url: string;
    }[];
};
interface config{
    lang: 'zh' | 'en';
    corsMode: boolean;
    corsPrefix: string;
    baseUrl: string;
    key: string;
    model: string;
    prompts: string[];
    activePrompt: number;
    search: 'exa' | 'uapi' | 'tavily';
    content: 'exa' | 'tavily' | 'md.new' | 'defuddle';
    toolsKeys: {
        exa: string;
        uapi: string;
        jina: string;
    };
};

interface result{
    items?: {
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
        related?: {
            name?: string;
            confidence?: number;
            cite?: number[];
        }[];
    }[];
    classic?: number[];
};
