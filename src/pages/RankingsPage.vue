<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Home } from 'lucide-vue-next'
import SearchBar from '@/components/SearchBar.vue'
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

type RankingEntry = {
  rank: number
  book: Book
}

type Rankings = {
  hot: RankingEntry[]
  finished: RankingEntry[]
  potential: RankingEntry[]
}

const loading = ref(false)
const error = ref('')
const rankings = ref<Rankings | null>(null)

const tab = ref<'hot' | 'finished' | 'potential'>('hot')

const list = computed(() => {
  if (!rankings.value) return []
  return rankings.value[tab.value] ?? []
})

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

const setTab = (t: 'hot' | 'finished' | 'potential') => {
  tab.value = t
  visibleCount.value = pageSize
  loadingMore.value = false
  if (mainEl.value) mainEl.value.scrollTop = 0
}

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await getMockData('/rankings', 80, true)
    rankings.value = (res?.data as Rankings) ?? null
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

    <main ref="mainEl" class="min-h-0 flex-1 overflow-auto p-4" @scroll="onScroll">
      <SearchBar class="mb-3" />
      <div class="mb-3 grid grid-cols-3 gap-2">
        <button
          type="button"
          class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-transform active:scale-[0.98]"
          :class="tab === 'hot' ? 'bg-accent text-accent-foreground' : ''"
          @click="setTab('hot')"
        >
          热门
        </button>
        <button
          type="button"
          class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-transform active:scale-[0.98]"
          :class="tab === 'finished' ? 'bg-accent text-accent-foreground' : ''"
          @click="setTab('finished')"
        >
          高分
        </button>
        <button
          type="button"
          class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-transform active:scale-[0.98]"
          :class="tab === 'potential' ? 'bg-accent text-accent-foreground' : ''"
          @click="setTab('potential')"
        >
          畅销
        </button>
      </div>

      <div v-if="loading" class="text-sm text-muted-foreground">加载中...</div>
      <div v-else-if="error" class="text-sm text-destructive">{{ error }}</div>
      <div v-else class="grid grid-cols-2 gap-4 xl:grid-cols-3">
        <BookListItem
          v-for="item in visibleList"
          :key="item.book.id"
          :book="item.book"
          :rank="item.rank"
        />

        <div v-if="loadingMore" class="flex items-center justify-center gap-2 py-3">
          <div
            class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground"
          />
          <div class="text-xs text-muted-foreground">加载中...</div>
        </div>
        <div
          v-else-if="total > 0 && visibleCount >= total"
          class="py-2 text-center text-xs text-muted-foreground"
        >
          已经没有更多了~
        </div>
      </div>
    </main>
  </div>
</template>
