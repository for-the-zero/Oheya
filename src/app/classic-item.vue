<script setup lang="ts">
    import Card from 'primevue/card';

    const { item } = defineProps<{ item: aistatus['toolResults'][number] }>();
</script>

<template>
    <a v-if="item && item.url && item.title" class="w-full" target="_blank" :href="item?.url || ''">
        <Card class="w-full hover:brightness-110 break-all **:data-[pc-section='body']:p-3! **:data-[pc-section='caption']:gap-0!">
            <template #title>
                <div class="flex flex-col">
                    <div class="truncate text-xs text-gray-500">
                        {{ item.url }}
                    </div>
                    <div class="truncate">
                        {{ item.title }}
                    </div>
                </div>
            </template>
            <template #subtitle>
                <span class="whitespace-pre-wrap line-clamp-3 text-sm">{{ item?.summary }}</span>
            </template>
        </Card>
    </a>
</template>