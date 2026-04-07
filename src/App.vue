<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import Sidebar from '@/components/Sidebar.vue'

const route = useRoute()

const showSidebar = computed(() => Boolean(route.meta?.showSidebar))
</script>

<template>
  <div class="flex h-screen w-full bg-background text-foreground">
    <Sidebar v-if="showSidebar" />
    <div class="flex-1 overflow-auto bg-muted/20">
      <RouterView />
    </div>
  </div>
</template>
