<script setup lang="ts">
import { BookOpen, LayoutGrid, Trophy, User } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { key: 'bookshelf', label: '书架', to: '/', icon: BookOpen },
  { key: 'rankings', label: '排行', to: '/rankings', icon: Trophy },
  { key: 'categories', label: '分类', to: '/categories', icon: LayoutGrid },
  { key: 'profile', label: '我的', to: '/profile', icon: User },
]

const activeKey = computed(() => {
  const name = String(route.name ?? '')
  if (name === 'bookshelf') return 'bookshelf'
  if (name === 'rankings') return 'rankings'
  if (name === 'categories') return 'categories'
  if (name === 'profile') return 'profile'
  return ''
})
</script>

<template>
  <nav class="w-full border-t border-border bg-background">
    <div class="grid grid-cols-4">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.key"
        :to="tab.to"
        class="flex h-14 flex-col items-center justify-center gap-1 text-muted-foreground transition-colors active:bg-muted/50 active:text-foreground"
        :class="activeKey === tab.key ? 'text-foreground' : ''"
      >
        <component :is="tab.icon" class="h-5 w-5" />
        <span class="text-[11px] leading-none">{{ tab.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>
