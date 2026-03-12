<template>
  <div class="flex h-full w-full flex-col">
    <header
      class="sticky top-0 z-10 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div class="flex items-center justify-between gap-3">
        <h1 class="text-lg font-semibold tracking-tight">评论区</h1>
        <RouterLink
          to="/book/1"
          class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors transition-transform active:scale-[0.98] active:bg-accent active:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          返回详情
        </RouterLink>
      </div>
    </header>

    <main class="min-h-0 flex-1 overflow-auto p-4">
      <div class="grid gap-2">
      <RouterLink
        to="/reader/1/1"
        class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors transition-transform active:scale-[0.98] active:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        继续阅读（示例 书籍=1 章节=1）
      </RouterLink>
      <RouterLink
        to="/toc/1"
        class="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors transition-transform active:scale-[0.98] active:bg-accent active:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        去目录（示例 书籍=1）
      </RouterLink>
      </div>
    </main>
  </div>
</template>
