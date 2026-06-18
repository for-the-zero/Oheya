/// <reference types="vite/client" />
/// <reference types="vue/compiler-sfc" />

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
    temperature: number;
    prompts: string[];
    activePrompt: number;
    search: 'exa' | 'uapi' | 'tavily' | 'querit';
    content: 'exa' | 'tavily' | 'md.new' | 'defuddle';
    toolsKeys: {
        exa: string;
        uapi: string;
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
        related?: {
            name?: string;
            confidence?: number;
            cite?: number[];
        }[];
    }[];
    classic?: number[];
};
