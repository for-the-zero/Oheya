import { tool } from 'ai';
import { z } from 'zod';
import { getActivePinia } from 'pinia';
import { useGlobalRefStore, getToast } from './globalRef';

function useStore() {
    const pinia = getActivePinia();
    if (!pinia) throw new Error('Pinia not active');
    return useGlobalRefStore(pinia);
};

function showError(name: string, message: string) {
    const lang = useStore().config.lang;
    getToast()?.add({
        severity: 'warn',
        life: 2500,
        summary: lang === 'zh' ? `${name}请求出错` : `${name} request failed`,
        detail: message,
        closable: true,
    });
};

async function apiFetch(url: string, options: RequestInit = {}, skipCors = false) {
    const { corsMode, corsPrefix } = useStore().config;
    return fetch(!skipCors ? `${corsPrefix}${url}` : url, options);
};

// ---- search providers ----

async function searchExa(query: string, max: number) {
    const key = useStore().config.toolsKeys.exa;
    if (!key) { showError('Exa', 'API key not configured'); return []; };
    try {
        const res = await apiFetch('https://api.exa.ai/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': key },
            body: JSON.stringify({ query, numResults: max }),
        });
        if (!res.ok) { showError('Exa', `HTTP ${res.status}`); return []; };
        const data = await res.json();console.log(data);
        return (data.results || []).map((r: any) => ({ title: r.title || '', url: r.url || '', summary: r.summary || '' }));
    } catch (e: any) { showError('Exa', e.message); return []; };
};

async function searchTavily(query: string, max: number) {
    const key = useStore().config.toolsKeys.tavily;
    if (!key) { showError('Tavily', 'API key not configured'); return []; };
    try {
        const res = await apiFetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
            body: JSON.stringify({ query, max_results: max }),
        });
        if (!res.ok) { showError('Tavily', `HTTP ${res.status}`); return []; };
        const data = await res.json();console.log(data);
        return (data.results || []).map((r: any) => ({ title: r.title || '', url: r.url || '', summary: r.content || '' }));
    } catch (e: any) { showError('Tavily', e.message); return []; };
};

async function searchQuerit(query: string, max: number) {
    const key = useStore().config.toolsKeys.querit;
    if (!key) { showError('Querit', 'API key not configured'); return []; };
    try {
        const res = await apiFetch('https://api.querit.ai/v1/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
            body: JSON.stringify({ query, count: max }),
        });
        if (!res.ok) { showError('Querit', `HTTP ${res.status}`); return []; };
        const data = await res.json();console.log(data);
        return (data.results?.result || []).map((r: any) => ({ title: r.title || '', url: r.url || '', summary: r.snippet || '' }));
    } catch (e: any) { showError('Querit', e.message); return []; };
};

async function searchUapi(query: string, max: number) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const key = useStore().config.toolsKeys.uapi;
    if (key) headers['Authorization'] = `Bearer ${key}`;
    try {
        const res = await apiFetch('https://uapis.cn/api/v1/search-aggregate', {
            method: 'POST',
            headers,
            body: JSON.stringify({ query, max_result: max }),
        });
        if (!res.ok) { showError('UApi', `HTTP ${res.status}`); return []; };
        const data = await res.json();console.log(data);
        return (data.results || []).map((r: any) => ({ title: r.title || '', url: r.url || '', summary: r.snippet || '' }));
    } catch (e: any) { showError('UApi', e.message); return []; };
};

// ---- content fetch providers ----

async function fetchExa(urls: string[]) {
    const key = useStore().config.toolsKeys.exa;
    if (!key) { showError('Exa', 'API key not configured'); return []; };
    try {
        const res = await apiFetch('https://api.exa.ai/contents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': key },
            body: JSON.stringify({ ids: urls }),
        });
        if (!res.ok) { showError('Exa', `HTTP ${res.status}`); return []; };
        const data = await res.json();console.log(data);
        return (data.results || []).map((r: any) => ({ title: r.title || '', url: r.url || '', text: r.text || '' }));
    } catch (e: any) { showError('Exa', e.message); return []; };
};

async function fetchTavily(urls: string[]) {
    const key = useStore().config.toolsKeys.tavily;
    if (!key) { showError('Tavily', 'API key not configured'); return []; };
    try {
        const res = await apiFetch('https://api.tavily.com/extract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
            body: JSON.stringify({ urls }),
        });
        if (!res.ok) { showError('Tavily', `HTTP ${res.status}`); return []; };
        const data = await res.json();console.log(data);
        return (data.results || []).map((r: any) => ({ title: '', url: r.url || '', text: r.raw_content || '' }));
    } catch (e: any) { showError('Tavily', e.message); return []; };
};

async function fetchMdNew(urls: string[]) {
    const results: { title: string; url: string; text: string }[] = [];
    for (const url of urls) {
        try {
            const res = await apiFetch(`https://markdown.new/${encodeURIComponent(url)}`);
            if (!res.ok) { results.push({ title: '', url, text: '' }); continue; };
            const raw = await res.text();console.log(raw);
            const title = raw.match(/^Title:\s*(.+)$/m)?.[1]?.trim() || '';
            const text = raw.match(/Markdown Content:\n([\s\S]*)/)?.[1]?.trim() || raw;
            results.push({ title, url, text });
        } catch {
            results.push({ title: '', url, text: '' });
        };
    };
    return results;
};

// ---- toolResults management ----

function addSearchResults(items: { title: string; url: string; summary: string }[]) {
    const tr = useStore().status.toolResults;
    const result: { title: string; url: string; summary: string; id: number }[] = [];
    for (const item of items) {
        let idx = tr.findIndex(t => t.url === item.url);
        if (idx === -1) {
            idx = tr.push({ title: item.title, summary: item.summary, content: '', url: item.url }) - 1;
        };
        result.push({ ...item, id: idx });
    };
    return result;
};

function addContentResults(items: { title: string; url: string; text: string }[]) {
    const tr = useStore().status.toolResults;
    for (const item of items) {
        const ex = tr.find(t => t.url === item.url);
        if (ex) {
            if (item.title) ex.title = item.title;
            ex.content = item.text;
        } else if (item.url) {
            tr.push({ title: item.title, summary: '', content: item.text, url: item.url });
        };
    };
};

// ---- AI SDK tools ----

export const searchTool = tool({
    description: 'Search the web for information. Results are automatically recorded in toolResults.',
    inputSchema: z.object({
        query: z.string().describe('The search query'),
        max_results: z.number().default(5).describe('Maximum number of search results'),
    }),
    execute: async ({ query, max_results }) => {
        console.log({ query, max_results });
        const store = useStore();
        store.status.isToolCalling = 'search';
        try {
            const provider = store.config.search;
            const fns: Record<string, (q: string, m: number) => Promise<{ title: string; url: string; summary: string }[]>> = {
                exa: searchExa, tavily: searchTavily, querit: searchQuerit, uapi: searchUapi,
            };
            const fn = fns[provider];
            if (!fn) throw new Error(`Unknown search provider: ${provider}`);
            const results = await fn(query, max_results);
            const processed = addSearchResults(results);
            console.log(processed);
            return processed;
        } catch (e: any) {
            showError('searchTool', e.message);
            return [];
        } finally {
            store.status.isToolCalling = false;
        };
    },
});

export const getFullTextTool = tool({
    description: 'Fetch full text content of web pages. Use url for direct URLs or id to reference existing search results by their index in toolResults.',
    inputSchema: z.object({
        url: z.array(z.string()).optional().describe('URLs to fetch full text for'),
        id: z.array(z.number()).optional().describe('Indices of search results in toolResults'),
    }),
    execute: async ({ url, id }) => {
        console.log({ url, id });
        const store = useStore();
        store.status.isToolCalling = 'fetch';
        try {
            const urls: string[] = [...(url || [])];
            for (const idx of (id || [])) {
                const entry = store.status.toolResults[idx];
                if (entry?.url && !urls.includes(entry.url)) urls.push(entry.url);
            };
            if (!urls.length) return '';
            const provider = store.config.content;
            const fns: Record<string, (u: string[]) => Promise<{ title: string; url: string; text: string }[]>> = {
                exa: fetchExa, tavily: fetchTavily, 'md.new': fetchMdNew,
            };
            const fn = fns[provider];
            if (!fn) throw new Error(`Unknown content provider: ${provider}`);
            const results = await fn(urls);
            addContentResults(results);
            console.log(results);
            return results.map(r => r.text).filter(Boolean).join('\n\n---\n\n');
        } catch (e: any) {
            showError('getFullTextTool', e.message);
            return '';
        } finally {
            store.status.isToolCalling = false;
        };
    },
});