<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
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

type Category = {
  id: number
  name: string
  books: Book[]
  description?: string
}

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const category = ref<Category | null>(null)

// 模拟筛选数据
const currentFilter = ref('all')
const filters = [
  { label: '全部', value: 'all' },
  { label: '高分', value: 'rating' },
  { label: '长篇', value: 'long' },
  { label: '新书', value: 'new' },
]

const mainEl = ref<HTMLElement | null>(null)
const pageSize = 12
const visibleCount = ref(pageSize)
const loadingMore = ref(false)

const total = computed(() => category.value?.books?.length ?? 0)
const visibleBooks = computed(() => {
  let list = category.value?.books ?? []
  
  // 模拟前端筛选逻辑
  if (currentFilter.value === 'rating') {
    list = [...list].sort((a, b) => (b.dbRating ?? 0) - (a.dbRating ?? 0))
  } else if (currentFilter.value === 'long') {
    list = list.filter(b => (b.length ?? 0) > 300000)
  }
  
  return list.slice(0, visibleCount.value)
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

const load = async () => {
  const id = String(route.params.id ?? '')
  if (!id) return

  loading.value = true
  error.value = ''
  try {
    const res = await getMockData(`/categories/${encodeURIComponent(id)}`, 80, true)
    const data = (res?.data as Category) ?? null
    if (data) {
      category.value = {
        ...data,
        description: `探索 ${data.name} 领域的精彩书籍，发现属于你的阅读之旅。`,
      }
    }
    visibleCount.value = pageSize
    loadingMore.value = false
    if (mainEl.value) mainEl.value.scrollTop = 0
  } catch (_e) {
    error.value = '加载失败'
    category.value = null
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/categories')
}

watch(
  () => route.params.id,
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
          <h1 class="text-xl font-bold tracking-tight text-foreground">{{ category?.name ?? '分类详情' }}</h1>
        </div>

        <div class="flex items-center gap-2">
          <button
            v-for="f in filters"
            :key="f.value"
            type="button"
            class="rounded-full px-4 py-1.5 text-xs font-medium transition-all"
            :class="[
              currentFilter === f.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-background border border-border text-muted-foreground hover:border-primary/50 hover:text-primary'
            ]"
            @click="currentFilter = f.value"
          >
            {{ f.label }}
          </button>
        </div>
      </div>
    </header>

    <main ref="mainEl" class="min-h-0 flex-1 overflow-auto" @scroll="onScroll">
      <div class="mx-auto max-w-[1200px] px-6 py-8">
        <!-- Category Header Info -->
        <div v-if="category" class="mb-8 rounded-2xl border border-border bg-background p-8 shadow-sm">
          <div class="flex flex-col gap-6 md:flex-row md:items-center">
            <div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <span class="text-3xl font-bold">{{ category.name.charAt(0) }}</span>
            </div>
            <div class="flex-1 space-y-2">
              <div class="flex items-center gap-3">
                <h2 class="text-3xl font-bold text-foreground">{{ category.name }}</h2>
                <span class="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {{ total }} 本书籍
                </span>
              </div>
              <p class="max-w-2xl text-muted-foreground">{{ category.description }}</p>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex h-64 items-center justify-center">
          <div class="flex flex-col items-center gap-3 text-muted-foreground">
            <div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            加载中...
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex h-64 items-center justify-center text-destructive">
          {{ error }}
        </div>

        <!-- Book Grid -->
        <div v-else>
          <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            <div
              v-for="b in visibleBooks"
              :key="b.id"
              class="group relative flex flex-col overflow-hidden transition-all"
            >
              <RouterLink :to="'/book/' + b.id" class="aspect-[3/4.2] overflow-hidden rounded-xl border border-border bg-muted shadow-sm group-hover:shadow-md">
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
                  <div v-if="b.dbRating" class="flex-shrink-0 text-[10px] font-bold text-orange-500">
                    ★ {{ b.dbRating.toFixed(1) }}
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

          <!-- Loading More -->
          <div v-if="loadingMore" class="mt-12 flex items-center justify-center gap-3 py-6">
            <div class="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <div class="text-sm font-medium text-muted-foreground">正在加载更多书籍...</div>
          </div>
          <div
            v-else-if="total > 0 && visibleCount >= total"
            class="mt-12 py-8 text-center"
          >
            <div class="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-xs text-muted-foreground">
              <span class="h-1 w-1 rounded-full bg-muted-foreground"></span>
              已经到底啦，共 {{ total }} 本书籍
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
