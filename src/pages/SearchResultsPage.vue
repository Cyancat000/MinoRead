<script setup lang="ts">
import { ArrowLeft, Search, Star, AlertCircle } from 'lucide-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMockData } from '@/lib/mock'

type Book = {
  id: number
  title: string
  cover: string
  authorName?: string
  seriesName?: string
  dbRating?: number
  length?: number
}

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const list = ref<Book[]>([])

const q = computed(() => String(route.query.q ?? '').trim())
const from = computed(() => String(route.query.from ?? '').trim())

const mainEl = ref<HTMLElement | null>(null)
const pageSize = 18
const visibleCount = ref(pageSize)
const loadingMore = ref(false)
const total = computed(() => list.value.length)
const visibleList = computed(() => list.value.slice(0, visibleCount.value))

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

const load = async () => {
  if (!q.value) {
    list.value = []
    visibleCount.value = pageSize
    loadingMore.value = false
    return
  }

  loading.value = true
  error.value = ''
  try {
    const res = await getMockData(`/search?q=${encodeURIComponent(q.value)}`, 80, true)
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

const goBack = () => {
  const raw = from.value
  if (raw.startsWith('/')) {
    router.replace(raw)
    return
  }
  router.replace('/')
}

watch(
  () => route.query.q,
  async () => {
    await load()
  }
)

onMounted(load)
</script>

<template>
  <div class="flex h-full w-full flex-col bg-muted/30">
    <header
      class="sticky top-0 z-20 border-b bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div class="mx-auto flex max-w-[1200px] items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            type="button"
            class="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
            @click="goBack"
          >
            <ArrowLeft class="h-4 w-4" />
            返回
          </button>
          <div class="h-4 w-px bg-border"></div>
          <h1 class="text-xl font-bold tracking-tight text-foreground">搜索结果</h1>
        </div>
        <div class="text-sm text-muted-foreground">
          找到 <span class="font-bold text-foreground">{{ total }}</span> 条相关书籍
        </div>
      </div>
    </header>

    <main ref="mainEl" class="min-h-0 flex-1 overflow-auto" @scroll="onScroll">
      <div class="mx-auto max-w-[1200px] px-6 py-8">
        <div v-if="!q" class="flex h-64 flex-col items-center justify-center gap-4 text-muted-foreground">
          <Search class="h-12 w-12 opacity-20" />
          <p>请输入关键词进行搜索</p>
        </div>
        <div v-else-if="loading" class="flex h-64 items-center justify-center">
          <div class="flex flex-col items-center gap-3 text-muted-foreground">
            <div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            正在搜索中...
          </div>
        </div>
        <div v-else-if="error" class="flex h-64 items-center justify-center text-destructive">
          {{ error }}
        </div>
        <div v-else-if="total === 0" class="flex h-64 flex-col items-center justify-center gap-4 text-muted-foreground">
          <AlertCircle class="h-12 w-12 opacity-20" />
          <p>未找到与 “<span class="font-bold text-foreground">{{ q }}</span>” 相关的书籍</p>
          <button class="text-sm font-bold text-primary hover:underline" @click="goBack">尝试其他关键词</button>
        </div>
        <div v-else>
          <div class="mb-6 flex items-center justify-between">
            <div class="text-sm text-muted-foreground">
              关键词 “<span class="font-bold text-foreground">{{ q }}</span>” 的搜索结果：
            </div>
          </div>

          <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            <div
              v-for="b in visibleList"
              :key="b.id"
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
            <div class="text-sm font-medium text-muted-foreground">正在加载更多结果...</div>
          </div>
          <div
            v-else-if="visibleCount >= total"
            class="mt-12 py-8 text-center"
          >
            <div class="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-xs text-muted-foreground">
              搜索结果已全部加载
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
