<script setup lang="ts">
import { Home } from 'lucide-vue-next'
import SearchBar from '@/components/SearchBar.vue'
</script>

<template>
  <div class="flex h-full w-full flex-col">
    <header
      class="sticky top-0 z-10 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div class="flex items-center justify-between gap-3">
        <h1 class="text-lg font-semibold tracking-tight">排行榜</h1>
        <RouterLink
          to="/"
          class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background transition-colors transition-transform active:scale-[0.98] active:bg-accent active:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="返回首页"
          title="返回首页"
        >
          <Home class="h-5 w-5" />
        </RouterLink>
      </div>
    </header>

    <main class="min-h-0 flex-1 overflow-auto p-4">
      <SearchBar class="mb-3" />
      <div class="grid gap-2">
      <RouterLink
        to="/book/1"
        class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors transition-transform active:scale-[0.98] active:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        进入书籍详情（示例 ID=1）
      </RouterLink>
      <RouterLink
        to="/search"
        class="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors transition-transform active:scale-[0.98] active:bg-accent active:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        去搜索与分类
      </RouterLink>
      <RouterLink
        to="/bookshelf"
        class="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors transition-transform active:scale-[0.98] active:bg-accent active:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        去书架
      </RouterLink>
      </div>
    </main>
  </div>
</template>
