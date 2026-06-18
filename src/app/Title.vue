<script setup lang="ts">
    import { ref, nextTick } from 'vue';
    import words from './utils/words.json';

    type letters = 'o' | 'h' | 'e' | 'y' | 'a';

    const letter = ref<letters>('a');
    const word = ref<string>('');
    const wordWrapper = ref<HTMLElement>();

    function switch_word(){
        if (wordWrapper.value) {
            wordWrapper.value.style.width = wordWrapper.value.offsetWidth + 'px';
        };
        switch (letter.value) {
            case 'o':
                letter.value = 'h';
                break;
            case 'h':
                letter.value = 'e';
                break;
            case 'e':
                letter.value = 'y';
                break;
            case 'y':
                letter.value = 'a';
                break;
            case 'a':
                letter.value = 'o';
        };
        let c_words: string[] = words[letter.value];
        word.value = c_words[Math.floor(Math.random() * c_words.length)];
        nextTick(() => {
            if (wordWrapper.value) {
                wordWrapper.value.style.width = wordWrapper.value.scrollWidth + 'px';
            };
        });
    };
    switch_word();
</script>

<template>
    <div class="flex flex-row items-baseline gap-2 p-2 select-none" @click="switch_word">
        <div class="text-5xl">
            <span class="transition-all duration-250" :class="letter == 'o' ? 'font-extrabold' : 'font-thin'">O</span>
            <span class="transition-all duration-250" :class="letter == 'h' ? 'font-extrabold' : 'font-thin'">h</span>
            <span class="transition-all duration-250" :class="letter == 'e' ? 'font-extrabold' : 'font-thin'">e</span>
            <span class="transition-all duration-250" :class="letter == 'y' ? 'font-extrabold' : 'font-thin'">y</span>
            <span class="transition-all duration-250" :class="letter == 'a' ? 'font-extrabold' : 'font-thin'">a</span>
        </div>
        <div class="translate-y-1.5 flex items-baseline gap-1">
            →
            <span ref="wordWrapper" class="relative inline-block overflow-hidden transition-all duration-250">
                <span class="invisible whitespace-nowrap">{{ word }}</span>
                <Transition name="word">
                    <span :key="word" class="absolute left-0 top-0 whitespace-nowrap">{{ word }}</span>
                </Transition>
            </span>
        </div>
    </div>
</template>

<style scoped>
    .word-enter-active,
    .word-leave-active {
        transition: all 0.25s cubic-bezier(0.3, 0.35, 0, 1);
    }
    .word-enter-from {
        opacity: 0;
        transform: translateX(-0.5rem);
    }
    .word-leave-to {
        opacity: 0;
        transform: translateX(0.5rem);
    }
</style>