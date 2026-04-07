<script setup lang="ts">
import { BookOpen, LayoutGrid, Trophy } from 'lucide-vue-next'
</script>

<template>
  <div class="flex h-full w-full flex-col">
    <header
      class="sticky top-0 z-10 border-b bg-background/95 px-8 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div class="mx-auto max-w-5xl flex items-center justify-between gap-3">
        <h1 class="text-xl font-bold tracking-tight">概览</h1>
      </div>
    </header>

    <main class="min-h-0 flex-1 overflow-auto p-8">
      <div class="mx-auto max-w-5xl">
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h2 class="text-3xl font-bold tracking-tight text-foreground">欢迎回来</h2>
            <p class="text-muted-foreground">继续阅读你喜爱的书籍。</p>
          </div>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <RouterLink
            to="/bookshelf"
            class="group relative overflow-hidden rounded-2xl border border-border bg-background p-6 transition-all hover:border-primary/50 hover:shadow-lg active:scale-[0.98]"
          >
            <div class="flex items-center gap-4">
              <div class="rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <BookOpen class="h-6 w-6" />
              </div>
              <div>
                <div class="text-lg font-semibold">书架</div>
                <p class="text-sm text-muted-foreground">管理你收藏的所有书籍</p>
              </div>
            </div>
          </RouterLink>

          <RouterLink
            to="/rankings"
            class="group relative overflow-hidden rounded-2xl border border-border bg-background p-6 transition-all hover:border-primary/50 hover:shadow-lg active:scale-[0.98]"
          >
            <div class="flex items-center gap-4">
              <div class="rounded-xl bg-orange-500/10 p-3 text-orange-500 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                <Trophy class="h-6 w-6" />
              </div>
              <div>
                <div class="text-lg font-semibold">排行榜</div>
                <p class="text-sm text-muted-foreground">发现当下最热门的作品</p>
              </div>
            </div>
          </RouterLink>

          <RouterLink
            to="/categories"
            class="group relative overflow-hidden rounded-2xl border border-border bg-background p-6 transition-all hover:border-primary/50 hover:shadow-lg active:scale-[0.98]"
          >
            <div class="flex items-center gap-4">
              <div class="rounded-xl bg-blue-500/10 p-3 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                <LayoutGrid class="h-6 w-6" />
              </div>
              <div>
                <div class="text-lg font-semibold">分类</div>
                <p class="text-sm text-muted-foreground">按类型浏览海量书籍</p>
              </div>
            </div>
          </RouterLink>
        </div>

        <div class="mt-12 grid gap-6 md:grid-cols-2">
          <div class="rounded-2xl border border-border bg-background p-6">
            <h3 class="mb-4 text-xl font-semibold">最近阅读</h3>
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-4 rounded-xl border border-transparent bg-muted/30 p-3 transition-all hover:border-border hover:bg-muted/50">
                <div class="h-20 w-14 overflow-hidden rounded-md border border-border bg-muted">
                  <img src="https://img1.readwithmino.com/book/1/cover.jpg" alt="Book" class="h-full w-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium truncate">三体</div>
                  <div class="text-sm text-muted-foreground">刘慈欣 · 已读 85%</div>
                </div>
                <RouterLink to="/reader/1" class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">继续</RouterLink>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-border bg-background p-6">
            <h3 class="mb-4 text-xl font-semibold">快捷入口</h3>
            <div class="grid grid-cols-2 gap-4">
              <RouterLink to="/history" class="flex items-center justify-center rounded-xl border border-border p-4 text-sm font-medium hover:bg-muted">历史记录</RouterLink>
              <RouterLink to="/profile" class="flex items-center justify-center rounded-xl border border-border p-4 text-sm font-medium hover:bg-muted">个人设置</RouterLink>
              <RouterLink to="/template" class="flex items-center justify-center rounded-xl border border-border p-4 text-sm font-medium hover:bg-muted">组件示例</RouterLink>
              <button class="flex items-center justify-center rounded-xl border border-border p-4 text-sm font-medium hover:bg-muted">帮助中心</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
