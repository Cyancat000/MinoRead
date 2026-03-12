<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Home } from 'lucide-vue-next'
import { getMockData } from '@/lib/mock'

type Book = {
  id: number
  title: string
  cover: string
  authorName?: string
  seriesName?: string
  dbRating?: number
  length?: number
  desc?: string
}

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const book = ref<Book | null>(null)

const id = computed(() => String(route.params.id ?? '').trim())

const load = async () => {
  if (!id.value) return
  loading.value = true
  error.value = ''
  try {
    const res = await getMockData(`/books/${encodeURIComponent(id.value)}`, 80, true)
    const data = (res?.data as Book) ?? null
    if (!data) {
      router.replace('/404')
      return
    }
    book.value = data
  } catch (_e) {
    error.value = '加载失败'
  } finally {
    loading.value = false
  }
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
  <div class="flex h-full w-full flex-col">
    <header
      class="sticky top-0 z-10 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div class="flex items-center justify-between gap-3">
        <h1 class="text-lg font-semibold tracking-tight">书籍详情</h1>
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
      <div v-if="loading" class="text-sm text-muted-foreground">加载中...</div>
      <div v-else-if="error" class="text-sm text-destructive">{{ error }}</div>
      <div v-else-if="book" class="grid gap-4">
        <div class="flex gap-3">
          <div class="relative h-28 w-20 flex-none overflow-hidden rounded-md border border-border bg-muted">
            <img
              :src="book.cover"
              :alt="book.title"
              class="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-base font-semibold text-foreground">{{ book.title }}</div>
            <div class="mt-1 text-sm text-muted-foreground">
              {{ book.authorName || '未知作者' }}<span v-if="book.seriesName"> · {{ book.seriesName }}</span>
            </div>
            <div class="mt-2 text-xs text-muted-foreground">
              <span v-if="typeof book.dbRating === 'number'">豆瓣 {{ book.dbRating.toFixed(1) }}</span>
              <span v-if="typeof book.length === 'number' && Number.isFinite(book.length)">
                <span v-if="typeof book.dbRating === 'number'"> · </span>{{ book.length }} 字
              </span>
            </div>
          </div>
        </div>

        <div v-if="book.desc" class="text-sm leading-relaxed text-muted-foreground">
          {{ book.desc }}
        </div>

        <div class="grid gap-2">
          <RouterLink
            :to="`/reader/${book.id}/1`"
            class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors transition-transform active:scale-[0.98] active:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            立即阅读
          </RouterLink>
          <RouterLink
            :to="`/toc/${book.id}`"
            class="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors transition-transform active:scale-[0.98] active:bg-accent active:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            查看目录
          </RouterLink>
          <RouterLink
            :to="`/comments/${book.id}`"
            class="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors transition-transform active:scale-[0.98] active:bg-accent active:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            查看评论
          </RouterLink>
        </div>
      </div>
    </main>
  </div>
</template>
