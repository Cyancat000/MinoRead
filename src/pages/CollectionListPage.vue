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
const pageSize = 10
const visibleCount = ref(pageSize)
const loadingMore = ref(false)

const total = computed(() => collection.value?.books?.length ?? 0)
const visibleBooks = computed(() => {
  const list = collection.value?.books ?? []
  return list.slice(0, visibleCount.value)
})

const title = computed(() => {
  if (collection.value?.name) return collection.value.name
  if (kind.value === 'author') return '作者'
  if (kind.value === 'series') return '系列'
  return '列表'
})

const endpoint = computed(() => {
  if (!id.value) return ''
  if (kind.value === 'author') return `/authors/${encodeURIComponent(id.value)}`
  if (kind.value === 'series') return `/series/${encodeURIComponent(id.value)}`
  return ''
})

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

const goBack = () => {
  router.back()
}

const load = async () => {
  if (!endpoint.value) return
  loading.value = true
  error.value = ''
  try {
    const res = await getMockData(endpoint.value, 80, true)
    collection.value = (res?.data as Collection) ?? null
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
  <div class="flex h-full w-full flex-col">
    <header
      class="sticky top-0 z-10 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background transition-colors transition-transform active:scale-[0.98] active:bg-accent active:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="返回上一级"
            title="返回上一级"
            @click="goBack"
          >
            <ArrowLeft class="h-5 w-5" />
          </button>
          <div class="grid">
            <h1 class="text-lg font-semibold tracking-tight">{{ title }}</h1>
            <div v-if="total > 0" class="text-[11px] text-muted-foreground">共 {{ total }} 本</div>
          </div>
        </div>
      </div>
    </header>

    <main ref="mainEl" class="min-h-0 flex-1 overflow-auto p-4" @scroll="onScroll">
      <div v-if="loading" class="text-sm text-muted-foreground">加载中...</div>
      <div v-else-if="error" class="text-sm text-destructive">{{ error }}</div>
      <div v-else class="grid gap-2">
        <BookListItem v-for="b in visibleBooks" :key="b.id" :book="b" />

        <div v-if="total === 0" class="py-2 text-center text-xs text-muted-foreground">暂无内容</div>
        <div v-else-if="loadingMore" class="flex items-center justify-center gap-2 py-3">
          <div class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
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
