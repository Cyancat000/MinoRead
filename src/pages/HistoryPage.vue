<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { getMockData } from '@/lib/mock'
import BookListItem from '@/components/BookListItem.vue'

type Book = {
  id: number
  title: string
  cover: string
  authorName?: string
  seriesName?: string
  dbRating?: number
  length?: number
}

const loading = ref(false)
const error = ref('')
const list = ref<Book[]>([])

const mainEl = ref<HTMLElement | null>(null)
const pageSize = 10
const visibleCount = ref(pageSize)
const loadingMore = ref(false)

const total = computed(() => list.value.length)
const visibleList = computed(() => list.value.slice(0, visibleCount.value))

const loadMore = async () => {
  if (loadingMore.value) return
  if (visibleCount.value >= total.value) return
  loadingMore.value = true
  await new Promise((r) => setTimeout(r, 2000))
  visibleCount.value = Math.min(total.value, visibleCount.value + pageSize)
  loadingMore.value = false
}

const onScroll = async () => {
  const el = mainEl.value
  if (!el) return
  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24
  if (nearBottom) await loadMore()
}

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await getMockData('/history', 80, true)
    list.value = Array.isArray(res?.data) ? (res.data as Book[]) : []
    visibleCount.value = pageSize
    loadingMore.value = false
    if (mainEl.value) mainEl.value.scrollTop = 0
  } catch (_e) {
    error.value = '加载失败'
    list.value = []
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="flex h-full w-full flex-col">
    <header
      class="sticky top-0 z-10 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div class="flex items-center justify-between gap-3">
        <h1 class="text-lg font-semibold tracking-tight">浏览历史</h1>
        <RouterLink
          to="/profile"
          class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background transition-colors transition-transform active:scale-[0.98] active:bg-accent active:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="返回上一级"
          title="返回上一级"
        >
          <ArrowLeft class="h-5 w-5" />
        </RouterLink>
      </div>
    </header>

    <main ref="mainEl" class="min-h-0 flex-1 overflow-auto p-4" @scroll="onScroll">
      <div v-if="loading" class="text-sm text-muted-foreground">加载中...</div>
      <div v-else-if="error" class="text-sm text-destructive">{{ error }}</div>
      <div v-else class="grid grid-cols-2 gap-4 xl:grid-cols-3">
        <div class="col-span-full text-xs text-muted-foreground">共 {{ total }} 条</div>
        <BookListItem v-for="(b, i) in visibleList" :key="`${b.id}-${i}`" :book="b" />

        <div v-if="total === 0" class="py-2 text-center text-xs text-muted-foreground">暂无历史</div>
        <div v-else-if="loadingMore" class="flex items-center justify-center gap-2 py-3">
          <div
            class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground"
          />
          <div class="text-xs text-muted-foreground">加载中...</div>
        </div>
        <div
          v-else-if="visibleCount >= total"
          class="py-2 text-center text-xs text-muted-foreground"
        >
          已经没有更多了~
        </div>
      </div>
    </main>
  </div>
</template>
