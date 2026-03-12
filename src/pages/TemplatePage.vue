<template>
  <div class="h-full w-full overflow-auto p-4">
    <div class="flex items-center justify-between gap-3">
      <h1 class="text-lg font-semibold tracking-tight">组件模板</h1>
      <RouterLink
        to="/"
        class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        回到首页
      </RouterLink>
    </div>

    <div class="mt-4 grid gap-4">
      <section class="rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
        <div class="text-sm font-medium">按钮</div>
        <div class="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
          >
            Primary
          </button>
          <button
            type="button"
            class="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
          >
            Secondary
          </button>
          <button
            type="button"
            class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
          >
            Outline
          </button>
          <button
            type="button"
            class="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
          >
            Ghost
          </button>
        </div>
      </section>

      <section class="rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
        <div class="text-sm font-medium">表单</div>
        <div class="mt-3 grid gap-2">
          <label class="text-sm text-muted-foreground" for="demo-input">输入框</label>
          <input
            id="demo-input"
            class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            placeholder="例如：书名 / 作者 / 关键词"
          />
        </div>
      </section>

      <section class="rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
        <div class="flex items-center justify-between gap-3">
          <div class="text-sm font-medium">信息卡片</div>
          <span
            class="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
          >
            Badge
          </span>
        </div>
        <div class="mt-3 text-sm text-muted-foreground">
          这里用于对齐全局排版、圆角、阴影、边框与颜色变量（bg-*, text-*）。
        </div>
      </section>
    </div>
  </div>
</template>
