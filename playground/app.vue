<script setup lang="ts">
const logger = useLogger();

logger.info('App setup');
logger.warn('App setup');
logger.error('App setup');

onMounted(() => {
    logger.info('App mounted');
    logger.warn('App mounted');
    logger.error('App mounted');
});
</script>

<template>
</template>