<script setup lang="ts">
import { ArrowLeft, Clock, Trash2, Star } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { getMockData } from '@/lib/mock'

type Book = {
  id: number
  title: string
  cover: string
  authorName?: string
  seriesName?: string
  dbRating?: number
  length?: number
  lastReadTime?: string
}

const loading = ref(false)
const error = ref('')
const list = ref<Book[]>([])

const mainEl = ref<HTMLElement | null>(null)
const pageSize = 12
const visibleCount = ref(pageSize)
const loadingMore = ref(false)

const total = computed(() => list.value.length)
const visibleList = computed(() => {
  return list.value.slice(0, visibleCount.value).map((b, i) => ({
    ...b,
    // 模拟最后阅读时间
    lastReadTime: i < 3 ? '今天' : i < 8 ? '昨天' : '更早以前'
  }))
})

const loadMore = async () => {
  if (loadingMore.value) return
  if (visibleCount.value >= total.value) return
  loadingMore.value = true
  await new Promise((r) => setTimeout(r, 1000))
  visibleCount.value = Math.min(total.value, visibleCount.value + pageSize)
  loadingMore.value = false
}

const onScroll = async () => {
  const el = mainEl.value
  if (!el) return
  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100
  if (nearBottom) await loadMore()
}

const clearHistory = () => {
  if (confirm('确定要清空所有阅读历史吗？')) {
    list.value = []
  }
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
  <div class="flex h-full w-full flex-col bg-muted/30">
    <header
      class="sticky top-0 z-20 border-b bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div class="mx-auto flex max-w-[1200px] items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold tracking-tight text-foreground">阅读历史</h1>
          <div class="h-4 w-px bg-border"></div>
          <p class="text-sm text-muted-foreground">记录您的每一次阅读足迹</p>
        </div>
        <div class="flex items-center gap-3">
          <button
            v-if="total > 0"
            type="button"
            class="inline-flex items-center gap-2 rounded-lg border border-destructive/20 bg-background px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-white active:scale-[0.98]"
            @click="clearHistory"
          >
            <Trash2 class="h-4 w-4" />
            清空历史
          </button>
          <RouterLink
            to="/profile"
            class="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
          >
            <ArrowLeft class="h-4 w-4" />
            返回中心
          </RouterLink>
        </div>
      </div>
    </header>

    <main ref="mainEl" class="min-h-0 flex-1 overflow-auto" @scroll="onScroll">
      <div class="mx-auto max-w-[1200px] px-6 py-8">
        <div v-if="loading" class="flex h-64 items-center justify-center">
          <div class="flex flex-col items-center gap-3 text-muted-foreground">
            <div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            加载中...
          </div>
        </div>
        <div v-else-if="error" class="flex h-64 items-center justify-center text-destructive">{{ error }}</div>
        <div v-else-if="total === 0" class="flex h-64 flex-col items-center justify-center gap-4 text-muted-foreground">
          <Clock class="h-12 w-12 opacity-20" />
          <p>暂无阅读历史，快去读书吧</p>
          <RouterLink to="/" class="text-sm font-bold text-primary hover:underline">去书城看看</RouterLink>
        </div>
        <div v-else>
          <div class="mb-6 flex items-center justify-between">
            <div class="text-sm text-muted-foreground">
              共记录 <span class="font-bold text-foreground">{{ total }}</span> 条历史
            </div>
          </div>

          <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            <div
              v-for="(b, i) in visibleList"
              :key="`${b.id}-${i}`"
              class="group flex flex-col overflow-hidden transition-all"
            >
              <RouterLink
                :to="'/book/' + b.id"
                class="relative aspect-[3/4.2] overflow-hidden rounded-xl border border-border bg-muted shadow-sm transition-all group-hover:shadow-md"
              >
                <img
                  :src="b.cover"
                  :alt="b.title"
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <!-- 时间角标：改为左上角或右上角，或者保持底部但确保容器是 relative -->
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1.5 pt-4 text-[10px] text-white">
                  <span class="font-medium opacity-90">{{ b.lastReadTime }}</span>
                </div>
              </RouterLink>
              <div class="mt-3 flex flex-1 flex-col">
                <div class="mb-0.5">
                  <RouterLink :to="'/book/' + b.id" class="line-clamp-1 block text-sm font-bold text-foreground hover:text-primary transition-colors">
                    {{ b.title }}
                  </RouterLink>
                </div>
                <div class="mb-1.5 flex items-center justify-between gap-1">
                  <span class="truncate text-[11px] text-muted-foreground">{{ b.authorName }}</span>
                  <div v-if="b.dbRating" class="flex items-center gap-0.5 text-[10px] font-bold text-orange-500">
                    <Star class="h-2.5 w-2.5 fill-orange-500" />
                    {{ b.dbRating.toFixed(1) }}
                  </div>
                </div>
                <div class="mt-auto flex items-center gap-2">
                  <span class="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground uppercase tracking-wider">
                    {{ b.length ? Math.round(b.length / 1000) + 'K 字' : '连载' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="loadingMore" class="mt-12 flex items-center justify-center gap-3 py-6">
            <div class="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <div class="text-sm font-medium text-muted-foreground">正在加载更多历史...</div>
          </div>
          <div
            v-else-if="visibleCount >= total"
            class="mt-12 py-8 text-center"
          >
            <div class="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-xs text-muted-foreground">
              已经显示全部历史记录
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
