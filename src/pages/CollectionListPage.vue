<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Star, Heart, Bookmark } from 'lucide-vue-next'
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

type Collection = {
  id: number
  name: string
  books: Book[]
}

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const collection = ref<Collection | null>(null)

const kind = computed(() => String(route.meta.kind ?? '').trim())
const id = computed(() => String(route.params.id ?? '').trim())

const mainEl = ref<HTMLElement | null>(null)
const pageSize = 12
const visibleCount = ref(pageSize)
const loadingMore = ref(false)

const total = computed(() => collection.value?.books?.length ?? 0)
const visibleBooks = computed(() => {
  const list = collection.value?.books ?? []
  return list.slice(0, visibleCount.value)
})

const title = computed(() => {
  if (kind.value === 'favorite') return '我的收藏'
  if (collection.value?.name) return collection.value.name
  if (kind.value === 'author') return '作者作品'
  if (kind.value === 'series') return '系列丛书'
  return '书籍列表'
})

const subtitle = computed(() => {
  if (kind.value === 'favorite') return '您收藏的所有精彩好书'
  if (kind.value === 'author') return `收录了该作者的所有相关作品`
  if (kind.value === 'series') return `该系列下的所有关联书籍`
  return '探索更多精彩内容'
})

const endpoint = computed(() => {
  if (kind.value === 'favorite') return '/user/favorites'
  if (!id.value) return ''
  if (kind.value === 'author') return `/authors/${encodeURIComponent(id.value)}`
  if (kind.value === 'series') return `/series/${encodeURIComponent(id.value)}`
  return ''
})

const loadMore = async () => {
  if (loadingMore.value) return
  if (visibleCount.value >= total.value) return
  loadingMore.value = true
  await new Promise((r) => setTimeout(r, 800))
  visibleCount.value = Math.min(total.value, visibleCount.value + pageSize)
  loadingMore.value = false
}

const onScroll = async () => {
  const el = mainEl.value
  if (!el) return
  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100
  if (nearBottom) await loadMore()
}

const goBack = () => {
  router.back()
}

const load = async () => {
  if (!endpoint.value) return
  loading.value = true
  error.value = ''
  try {
    const res = await getMockData(endpoint.value, 80, true)
    if (kind.value === 'favorite') {
      collection.value = {
        id: 0,
        name: '我的收藏',
        books: Array.isArray(res?.data) ? (res.data as Book[]) : []
      }
    } else {
      collection.value = (res?.data as Collection) ?? null
    }
    visibleCount.value = pageSize
    loadingMore.value = false
    if (mainEl.value) mainEl.value.scrollTop = 0
  } catch (_e) {
    error.value = '加载失败'
    collection.value = null
  } finally {
    loading.value = false
  }
}

watch(
  () => [route.params.id, route.meta.kind],
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
          <div class="flex flex-col">
            <h1 class="text-xl font-bold tracking-tight text-foreground">{{ title }}</h1>
            <p class="text-[11px] text-muted-foreground">{{ subtitle }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          共 <span class="font-bold text-foreground">{{ total }}</span> 本书籍
        </div>
      </div>
    </header>

    <main ref="mainEl" class="min-h-0 flex-1 overflow-auto" @scroll="onScroll">
      <div class="mx-auto max-w-[1200px] px-6 py-8">
        <!-- Loading State -->
        <div v-if="loading && collection === null" class="flex h-64 items-center justify-center">
          <div class="flex flex-col items-center gap-3 text-muted-foreground">
            <div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            正在加载列表...
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex h-64 items-center justify-center text-destructive">
          {{ error }}
        </div>

        <!-- Empty State -->
        <div v-else-if="total === 0" class="flex h-64 flex-col items-center justify-center gap-4 text-muted-foreground">
          <Bookmark class="h-12 w-12 opacity-20" />
          <p>暂无相关书籍内容</p>
          <button class="text-sm font-bold text-primary hover:underline" @click="goBack">返回上一页</button>
        </div>

        <!-- Content -->
        <div v-else>
          <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            <div
              v-for="b in visibleBooks"
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
                <div v-if="kind === 'favorite'" class="absolute right-2 top-2 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm">
                  <Heart class="h-3 w-3 fill-rose-500 text-rose-500" />
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

          <!-- Loading More -->
          <div v-if="loadingMore" class="mt-12 flex items-center justify-center gap-3 py-6">
            <div class="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <div class="text-sm font-medium text-muted-foreground">正在加载更多...</div>
          </div>
          <div
            v-else-if="visibleCount >= total"
            class="mt-12 py-8 text-center"
          >
            <div class="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-xs text-muted-foreground">
              已经显示全部内容
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
