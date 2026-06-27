<script setup lang="ts">
    import Chart from 'primevue/chart';
    import { computed } from 'vue';

    const { chart } = defineProps<{ chart: result_chart }>();

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

    const chartType = computed(() => chart?.type || 'bar');

    const hasData = computed(() => {
        if (chart?.type === 'pie') {
            return (chart?.data || []).length > 0;
        };
        return ((chart as { datasets?: { data?: number[] }[] }).datasets || []).some(ds => (ds.data || []).length > 0);
    });

    const chartData = computed(() => {
        const type = chartType.value;
        const labels = chart?.labels || [];
        if (chart?.type === 'pie') {
            const data = chart?.data || [];
            return {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colorPalette.slice(0, data.length || 1),
                }],
            };
        };
        return {
            labels,
            datasets: ((chart as { datasets?: { label?: string; data?: number[]; tension?: number }[] }).datasets || []).map((ds, i) => {
                const color = colorPalette[i % colorPalette.length];
                return {
                    label: ds.label || '',
                    data: ds.data || [],
                    tension: type === 'line' ? (ds.tension ?? 0.4) : 0,
                    backgroundColor: type === 'line' ? color.replace('0.8', '0.2') : color,
                    borderColor: color.replace('0.8', '1'),
                    borderWidth: type === 'line' ? 2 : 1,
                };
            }),
        };
    });

    const chartOptions = computed(() => {
        const type = chartType.value;
        const dsCount = chart?.type === 'pie' ? 0 : ((chart as { datasets?: unknown[] }).datasets || []).length;
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: type !== 'pie' && dsCount > 1,
                    position: 'bottom',
                },
                title: {
                    display: type !== 'pie' && !!chart?.title,
                    text: chart?.title || '',
                },
            },
            scales: type !== 'pie' ? {
                x: {
                    grid: { display: false },
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                },
            } : undefined,
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
        <div v-if="hasData && chartType === 'pie'" class="flex w-full h-full gap-2">
            <div class="flex flex-col justify-center shrink-0 gap-2 pl-2" style="width: 120px;">
                <span v-if="chart?.title" class="text-sm font-bold leading-tight">{{ chart?.title }}</span>
                <div v-for="(label, i) in (chart?.labels || [])" :key="i" class="flex items-center gap-2 text-xs">
                    <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: colorPalette[i % colorPalette.length] }"></span>
                    <span class="truncate">{{ label }}</span>
                </div>
            </div>
            <div class="flex-1 flex justify-end min-w-0">
                <div class="w-full max-w-xs h-full">
                    <Chart
                        :type="chartType"
                        :data="chartData"
                        :options="pieOptions"
                    />
                </div>
            </div>
        </div>
        <Chart v-else-if="hasData"
            :type="chartType"
            :data="chartData"
            :options="chartOptions"
        />
    </div>
</template>
