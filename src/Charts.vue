<script setup lang="ts">
    import Chart from 'primevue/chart';
    import { computed } from 'vue';

    const props = defineProps<{ chart?: result_chart | null }>();
    const safeChart = computed(() => props?.chart ?? null);

    const colorPalette = [
        'rgba(99, 102, 241, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(52, 211, 153, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(14, 165, 233, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(34, 197, 94, 0.8)',
    ];
    const getColor = (i: number): string => {
        const len = colorPalette?.length || 0;
        if (len === 0) return 'rgba(99, 102, 241, 0.8)';
        return colorPalette[i % len] || colorPalette[0];
    };
    const safeReplace = (color: unknown, from: string, to: string): string => {
        if (typeof color !== 'string' || !color) return `rgba(99, 102, 241, ${to})`;
        try {
            return color.replace(from, to);
        } catch {
            return color;
        };
    };
    const chartType = computed<string>(() => {
        const t = safeChart.value?.type;
        return typeof t === 'string' && t ? t : 'bar';
    });
    const safeLabels = computed<string[]>(() => {
        const labels = safeChart.value?.labels;
        return Array.isArray(labels) ? labels.filter((x) => x != null) : [];
    });
    const safeDatasets = computed<any[]>(() => {
        const c = safeChart.value as any;
        const ds = c?.datasets;
        if (!Array.isArray(ds)) return [];
        return ds.filter((d) => d && typeof d === 'object');
    });
    const safePieData = computed<number[]>(() => {
        const c = safeChart.value as any;
        const d = c?.data;
        return Array.isArray(d) ? d.filter((x) => x != null) : [];
    });
    const safeTitle = computed<string>(() => {
        const t = safeChart.value?.title;
        return typeof t === 'string' ? t : '';
    });
    const hasData = computed<boolean>(() => {
        try {
            const c = safeChart.value as any;
            if (!c) return false;
            if (c.type === 'pie') {
                return safePieData.value.length > 0;
            }
            return safeDatasets.value.some((ds) => Array.isArray(ds?.data) && ds.data.length > 0);
        } catch {
            return false;
        }
    });
    const chartData = computed(() => {
        try {
            const type = chartType.value;
            const labels = safeLabels.value;
            if (type === 'pie') {
                const data = safePieData.value;
                return {
                    labels,
                    datasets: [
                        {
                            data,
                            backgroundColor: colorPalette.slice(0, Math.max(data.length, 1)),
                        },
                    ],
                };
            }
            const datasets = safeDatasets.value.map((ds, i) => {
                const color = getColor(i);
                const lineColor = safeReplace(color, '0.8', '0.2');
                const borderColor = safeReplace(color, '0.8', '1');
                const data = Array.isArray(ds?.data) ? ds.data : [];
                const label = typeof ds?.label === 'string' ? ds.label : '';
                const tension = typeof ds?.tension === 'number' ? ds.tension : 0.4;

                return {
                    label,
                    data,
                    tension: type === 'line' ? tension : 0,
                    backgroundColor: type === 'line' ? lineColor : color,
                    borderColor,
                    borderWidth: type === 'line' ? 2 : 1,
                };
            });
            return { labels, datasets };
        } catch {
            return { labels: [], datasets: [] };
        };
    });

    const chartOptions = computed(() => {
        try {
            const type = chartType.value;
            const dsCount = type === 'pie' ? 0 : safeDatasets.value.length;
            const title = safeTitle.value;
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: type !== 'pie' && dsCount > 1,
                        position: 'bottom',
                    },
                    title: {
                        display: type !== 'pie' && !!title,
                        text: title,
                    },
                },
                scales:
                    type !== 'pie'
                        ? {
                            x: { grid: { display: false } },
                            y: {
                                beginAtZero: true,
                                grid: { color: 'rgba(0,0,0,0.05)' },
                            },
                        }
                        : undefined,
            };
        } catch {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, title: { display: false } },
            };
        };
    });
    const pieOptions = computed(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
    }));
</script>

<template>
    <div class="w-full">
        <div
            v-if="hasData && chartType === 'pie'"
            class="flex w-full h-full gap-2"
        >
            <div class="flex flex-col justify-center gap-2 pl-2 w-full">
                <span v-if="safeTitle" class="text-sm font-bold leading-tight">{{ safeTitle }}</span>
                <div
                    v-for="(label, i) in safeLabels"
                    :key="i"
                    class="flex items-center gap-2 text-xs"
                >
                    <span
                        class="w-2.5 h-2.5 rounded-full shrink-0"
                        :style="{ backgroundColor: getColor(i) }"
                    ></span>
                    <span class="truncate">{{ label }}</span>
                </div>
            </div>
            <div class="flex-1 flex justify-end flex-shrink-0 min-w-[40%]">
                <div class="w-full max-w-xs h-full">
                    <Chart
                        :type="chartType"
                        :data="chartData"
                        :options="pieOptions"
                    />
                </div>
            </div>
        </div>
        <Chart
            v-else-if="hasData"
            :type="chartType"
            :data="chartData"
            :options="chartOptions"
        />
    </div>
</template>
