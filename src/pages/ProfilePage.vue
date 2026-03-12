<template>
  <div class="h-full w-full overflow-auto p-4">
    <div class="flex items-center justify-between gap-3">
      <h1 class="text-lg font-semibold tracking-tight">个人主页</h1>
      <RouterLink
        to="/"
        class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        返回首页
      </RouterLink>
    </div>

    <div class="mt-4 grid gap-2">
      <RouterLink
        to="/history"
        class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        去浏览历史
      </RouterLink>
      <RouterLink
        to="/bookshelf"
        class="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        去书架
      </RouterLink>
    </div>
  </div>
</template>
