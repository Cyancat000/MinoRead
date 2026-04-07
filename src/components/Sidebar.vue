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
  <nav class="flex h-full w-64 flex-col border-r border-border bg-background">
    <div class="flex h-16 items-center px-6">
      <h1 class="text-xl font-bold tracking-tight">MinoRead</h1>
    </div>
    <div class="flex-1 space-y-1 p-4">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.key"
        :to="tab.to"
        class="flex h-12 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-[0.98]"
        :class="activeKey === tab.key ? 'bg-muted text-foreground' : ''"
      >
        <component :is="tab.icon" class="h-5 w-5" />
        <span>{{ tab.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>
