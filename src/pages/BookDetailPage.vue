<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Home, Layers, UserRound } from 'lucide-vue-next'
import { getMockData } from '@/lib/mock'

type Book = {
  id: number
  title: string
  cover: string
  authorId: number
  authorName?: string
  seriesId?: number | null
  seriesName?: string
  dbRating?: number
  length?: number
  desc?: string
  award?: { title: string; edtion?: string }[]
  chapters?: { id: number; title: string }[]
}

type CommentItem = {
  id: number
  bookId: number
  userId: number
  userName: string
  userAvatar: string
  content: string
  likeCount: number
  liked: boolean
  createdAt: number
}

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const book = ref<Book | null>(null)
const inShelf = ref(false)
const descExpanded = ref(false)
const tab = ref<'toc' | 'comments'>('toc')

const commentsLoading = ref(false)
const commentsError = ref('')
const comments = ref<CommentItem[]>([])

const id = computed(() => String(route.params.id ?? '').trim())
const tabQuery = computed(() => String(route.query.tab ?? '').trim())

const descShowToggle = computed(() => {
  const text = String(book.value?.desc ?? '')
  return text.length >= 160
})

const descStyle = computed(() => {
  if (descExpanded.value) return undefined
  return {
    display: '-webkit-box',
    WebkitLineClamp: '4',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  } as Record<string, string>
})

const setTabFromQuery = () => {
  const v = tabQuery.value
  if (v === 'comments' || v === 'toc') tab.value = v
  else tab.value = 'toc'
}

const loadComments = async () => {
  if (!book.value) return
  if (commentsLoading.value) return
  commentsLoading.value = true
  commentsError.value = ''
  try {
    const res = await getMockData(`/comments/${book.value.id}`, 80, true)
    comments.value = Array.isArray(res?.data) ? (res.data as CommentItem[]) : []
  } catch (_e) {
    commentsError.value = '加载失败'
    comments.value = []
  } finally {
    commentsLoading.value = false
  }
}

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
    descExpanded.value = false
    inShelf.value = false
    comments.value = []
    setTabFromQuery()
    if (tab.value === 'comments') await loadComments()
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

watch(
  () => route.query.tab,
  async () => {
    setTabFromQuery()
    if (tab.value === 'comments' && comments.value.length === 0) await loadComments()
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
          <div class="relative h-40 w-28 flex-none overflow-hidden rounded-md border border-border bg-muted">
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
              <RouterLink
                :to="`/author/${book.authorId}`"
                class="inline-flex h-6 items-center gap-1 rounded-full border border-border bg-muted px-2 text-[11px] text-muted-foreground transition-transform active:scale-[0.98]"
                :title="book.authorName || '未知作者'"
              >
                <UserRound class="h-3.5 w-3.5" />
                <span class="max-w-44 truncate">{{ book.authorName || '未知作者' }}</span>
              </RouterLink>
              <span v-if="book.seriesId && book.seriesName" class="w-0.5 h-1 inline-block"> </span>
              <RouterLink
                v-if="book.seriesId && book.seriesName"
                :to="`/series/${book.seriesId}`"
                class="inline-flex h-6 items-center gap-1 rounded-full border border-border bg-muted px-2 text-[11px] text-muted-foreground transition-transform active:scale-[0.98]"
                :title="book.seriesName"
              >
                <Layers class="h-3.5 w-3.5" />
                <span class="max-w-44 truncate">{{ book.seriesName }}</span>
              </RouterLink>
            </div>
            <div class="mt-2 text-xs text-muted-foreground">
              <span v-if="typeof book.dbRating === 'number'">豆瓣 {{ book.dbRating.toFixed(1) }}</span>
              <span v-if="typeof book.length === 'number' && Number.isFinite(book.length)">
                <span v-if="typeof book.dbRating === 'number'"> · </span>{{ book.length }} 字
              </span>
            </div>
            <div v-if="book.award && book.award.length > 0" class="mt-2 flex flex-wrap gap-2">
              <div
                v-for="(a, i) in book.award"
                :key="i"
                class="inline-flex h-5 items-center rounded-full border border-border bg-muted px-1.5 text-[10px] text-muted-foreground"
              >
                <span class="truncate">{{ a.title }}</span>
                <span v-if="a.edtion" class="truncate"> · {{ a.edtion }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="book.desc" class="grid gap-2">
          <div class="text-sm leading-relaxed text-muted-foreground" :style="descStyle">
            {{ book.desc }}
          </div>
          <button
            v-if="descShowToggle"
            type="button"
            class="w-fit text-xs font-medium text-primary transition-transform active:scale-[0.98]"
            @click="descExpanded = !descExpanded"
          >
            {{ descExpanded ? '收起' : '展开全部' }}
          </button>
        </div>

        <div class="grid gap-2">
          <div class="grid grid-cols-2 gap-2">
            <RouterLink
              :to="`/reader/${book.id}/1`"
              class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors transition-transform active:scale-[0.98] active:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              立即阅读
            </RouterLink>
            <button
              type="button"
              class="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors transition-transform active:scale-[0.98] active:bg-accent active:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              @click="inShelf = !inShelf"
            >
              {{ inShelf ? '已加入书架' : '加入书架' }}
            </button>
          </div>
        </div>

        <div class="rounded-xl border border-border bg-background p-2">
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              class="inline-flex h-9 items-center justify-center rounded-lg text-sm font-medium transition-transform active:scale-[0.98]"
              :class="tab === 'toc' ? 'bg-muted text-foreground' : 'text-muted-foreground'"
              @click="router.replace({ query: { ...route.query, tab: 'toc' } })"
            >
              目录
            </button>
            <button
              type="button"
              class="inline-flex h-9 items-center justify-center rounded-lg text-sm font-medium transition-transform active:scale-[0.98]"
              :class="tab === 'comments' ? 'bg-muted text-foreground' : 'text-muted-foreground'"
              @click="router.replace({ query: { ...route.query, tab: 'comments' } })"
            >
              评论
            </button>
          </div>
        </div>

        <div v-if="tab === 'toc'" class="grid gap-2">
          <div v-if="!book.chapters || book.chapters.length === 0" class="text-xs text-muted-foreground">
            暂无目录
          </div>
          <button
            v-for="c in book.chapters"
            :key="c.id"
            type="button"
            class="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 py-3 text-left transition-transform active:scale-[0.98]"
            @click="router.push(`/reader/${book.id}/${c.id}`)"
          >
            <div class="min-w-0 flex-1">
              <div class="truncate text-sm text-foreground">{{ c.title }}</div>
              <div class="mt-0.5 text-[11px] text-muted-foreground">第 {{ c.id }} 章</div>
            </div>
            <div class="text-xs text-muted-foreground">阅读</div>
          </button>
        </div>

        <div v-else class="grid gap-3">
          <div v-if="commentsLoading" class="text-sm text-muted-foreground">加载中...</div>
          <div v-else-if="commentsError" class="text-sm text-destructive">{{ commentsError }}</div>
          <div v-else-if="comments.length === 0" class="text-xs text-muted-foreground">还没有评论</div>
          <div v-else class="grid gap-2">
            <div
              v-for="c in comments"
              :key="c.id"
              class="flex gap-3 rounded-xl border border-border bg-background p-3"
            >
              <div class="relative h-9 w-9 flex-none overflow-hidden rounded-full border border-border bg-muted">
                <img :src="c.userAvatar" :alt="c.userName" class="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <div class="truncate text-sm font-medium text-foreground">{{ c.userName }}</div>
                  <div class="text-[11px] text-muted-foreground tabular-nums">{{ c.likeCount }}</div>
                </div>
                <div class="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {{ c.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
