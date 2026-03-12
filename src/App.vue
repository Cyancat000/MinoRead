<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import Tabbar from '@/components/Tabbar.vue'

const route = useRoute()

const showTabbar = computed(() => Boolean(route.meta?.showTabbar))
</script>

<template>
  <div class="min-h-dvh w-full bg-muted/40 text-foreground">
    <div class="mx-auto flex min-h-dvh w-full items-center justify-center p-6">
      <div class="h-[812px] w-[375px] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <div class="flex h-full w-full flex-col">
          <div class="min-h-0 flex-1">
            <RouterView />
          </div>
          <Tabbar v-if="showTabbar" />
        </div>
      </div>
    </div>
  </div>
</template>
