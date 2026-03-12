<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Home } from 'lucide-vue-next'
import SearchBar from '@/components/SearchBar.vue'
import { getMockData } from '@/lib/mock'

type Category = {
  id: number
  name: string
  books: { id: number }[]
}

const loading = ref(false)
const error = ref('')
const categories = ref<Category[]>([])

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await getMockData('/categories', 80, true)
    categories.value = Array.isArray(res?.data) ? (res.data as Category[]) : []
  } catch (_e) {
    error.value = '加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex h-full w-full flex-col">
    <header
      class="sticky top-0 z-10 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div class="flex items-center justify-between gap-3">
        <h1 class="text-lg font-semibold tracking-tight">分类</h1>
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
      <div v-if="loading" class="text-sm text-muted-foreground">加载中...</div>
      <div v-else-if="error" class="text-sm text-destructive">{{ error }}</div>
      <div v-else class="grid gap-2">
        <RouterLink
          v-for="c in categories"
          :key="c.id"
          :to="`/categories/${c.id}`"
          class="flex items-center justify-between rounded-lg border border-border bg-background p-3 transition-transform active:scale-[0.98]"
        >
          <div class="text-sm font-medium text-foreground">{{ c.name }}</div>
          <div class="text-xs text-muted-foreground">{{ (c.books?.length ?? 0) }} 本</div>
        </RouterLink>
      </div>
    </main>
  </div>
</template>
