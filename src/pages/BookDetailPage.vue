<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Home, Layers, UserRound, Trophy, ThumbsUp, Star } from 'lucide-vue-next'
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
const relatedBooks = ref<Book[]>([])

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

const loadRelated = async () => {
  try {
    const res = await getMockData('/books', 0, true)
    const allBooks = (res?.data as Book[]) ?? []
    // 随机选 4 本作为相关推荐
    relatedBooks.value = allBooks
      .filter(b => b.id !== Number(id.value))
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
  } catch (_e) {
    relatedBooks.value = []
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
    await loadRelated()
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
  <div class="min-h-full w-full bg-muted/30">
    <header
      class="sticky top-0 z-20 border-b bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div class="mx-auto flex max-w-[1200px] items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            type="button"
            class="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
            @click="router.back()"
          >
            返回
          </button>
          <div class="h-4 w-px bg-border"></div>
          <p class="text-sm text-muted-foreground">{{ book?.title ?? '书籍详情' }}</p>
        </div>
        <RouterLink
          to="/"
          class="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
        >
          <Home class="h-4 w-4" />
          返回首页
        </RouterLink>
      </div>
    </header>

    <main class="mx-auto max-w-[1200px] px-6 py-8">
      <div v-if="loading" class="flex h-64 items-center justify-center">
        <div class="flex flex-col items-center gap-3 text-muted-foreground">
          <div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          加载中...
        </div>
      </div>
      <div v-else-if="error" class="flex h-64 items-center justify-center text-destructive">{{ error }}</div>
      <div v-else-if="book" class="flex flex-col gap-8">
        <!-- Hero Section -->
        <section class="rounded-3xl border border-border bg-background p-8 shadow-sm">
          <div class="flex flex-col gap-8 md:flex-row md:items-start">
            <!-- Cover -->
            <div class="relative h-[320px] w-[240px] flex-none overflow-hidden rounded-2xl border border-border bg-muted shadow-lg">
              <img
                :src="book.cover"
                :alt="book.title"
                class="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            
            <!-- Book Info -->
            <div class="flex min-w-0 flex-1 flex-col pt-2">
              <div class="space-y-4">
                <h2 class="text-4xl font-bold tracking-tight text-foreground">{{ book.title }}</h2>
                
                <div class="flex flex-wrap items-center gap-3">
                  <RouterLink
                    :to="`/author/${book.authorId}`"
                    class="inline-flex h-8 items-center gap-2 rounded-full border border-border bg-muted px-4 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary active:scale-[0.98]"
                  >
                    <UserRound class="h-4 w-4" />
                    {{ book.authorName || '未知作者' }}
                  </RouterLink>
                  <RouterLink
                    v-if="book.seriesId && book.seriesName"
                    :to="`/series/${book.seriesId}`"
                    class="inline-flex h-8 items-center gap-2 rounded-full border border-border bg-muted px-4 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary active:scale-[0.98]"
                  >
                    <Layers class="h-4 w-4" />
                    {{ book.seriesName }}
                  </RouterLink>
                </div>

                <div class="flex items-center gap-6">
                  <div class="flex flex-col">
                    <span class="text-xs text-muted-foreground uppercase tracking-wider">豆瓣评分</span>
                    <span class="text-2xl font-bold text-orange-500">
                      {{ typeof book.dbRating === 'number' ? book.dbRating.toFixed(1) : '暂无' }}
                    </span>
                  </div>
                  <div class="h-8 w-px bg-border"></div>
                  <div class="flex flex-col">
                    <span class="text-xs text-muted-foreground uppercase tracking-wider">字数</span>
                    <span class="text-2xl font-bold text-foreground">
                      {{ typeof book.length === 'number' && Number.isFinite(book.length) ? (book.length / 10000).toFixed(1) + '万' : '未知' }}
                    </span>
                  </div>
                </div>

                <div v-if="book.award && book.award.length > 0" class="mt-2 flex flex-wrap gap-2">
                  <div
                    v-for="(a, i) in book.award"
                    :key="i"
                    class="inline-flex h-6 items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 px-3 text-[11px] font-medium text-orange-600"
                  >
                    <Trophy class="h-3 w-3" />
                    {{ a.title }} <span v-if="a.edtion" class="ml-1 opacity-70"> · {{ a.edtion }}</span>
                  </div>
                </div>
              </div>

              <!-- Primary Actions -->
              <div class="mt-auto flex flex-wrap gap-4 pt-8">
                <RouterLink
                  :to="`/reader/${book.id}/1`"
                  class="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl active:scale-[0.98]"
                >
                  立即开始阅读
                </RouterLink>
                <button
                  type="button"
                  class="inline-flex h-12 items-center justify-center rounded-xl border border-input bg-background px-8 text-base font-bold transition-all hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
                  @click="inShelf = !inShelf"
                >
                  {{ inShelf ? '已在书架中' : '加入我的书架' }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Details Section -->
        <div class="flex flex-col gap-8 lg:flex-row">
          <!-- Main Content -->
          <div class="flex-1 space-y-8">
            <!-- Description -->
            <section class="rounded-3xl border border-border bg-background p-8 shadow-sm">
              <h3 class="mb-6 text-xl font-bold text-foreground">内容简介</h3>
              <div class="relative">
                <div 
                  class="text-base leading-relaxed text-muted-foreground" 
                  :style="descStyle"
                >
                  {{ book.desc }}
                </div>
                <button
                  v-if="descShowToggle"
                  type="button"
                  class="mt-4 inline-flex items-center text-sm font-bold text-primary hover:underline"
                  @click="descExpanded = !descExpanded"
                >
                  {{ descExpanded ? '收起简介' : '展开阅读完整简介' }}
                </button>
              </div>
            </section>

            <!-- Tabs (Toc / Comments) -->
            <section class="rounded-3xl border border-border bg-background p-8 shadow-sm">
              <div class="mb-8 border-b border-border">
                <div class="flex gap-8">
                  <button
                    v-for="t in ['toc', 'comments']"
                    :key="t"
                    class="relative pb-4 text-base font-bold transition-colors"
                    :class="tab === t ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
                    @click="router.replace({ query: { ...route.query, tab: t } })"
                  >
                    {{ t === 'toc' ? '目录' : '书评' }}
                    <div 
                      v-if="tab === t" 
                      class="absolute bottom-0 left-0 h-1 w-full rounded-full bg-primary"
                    ></div>
                  </button>
                </div>
              </div>

              <!-- TOC -->
              <div v-if="tab === 'toc'" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div v-if="!book.chapters || book.chapters.length === 0" class="py-12 text-center text-muted-foreground">
                  暂无目录
                </div>
                <button
                  v-for="c in book.chapters"
                  :key="c.id"
                  type="button"
                  class="flex items-center gap-4 rounded-xl border border-transparent bg-muted/30 px-5 py-4 text-left transition-all hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98]"
                  @click="router.push(`/reader/${book.id}/${c.id}`)"
                >
                  <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-xs font-bold text-muted-foreground shadow-sm">
                    {{ c.id }}
                  </span>
                  <div class="min-w-0 flex-1">
                    <div class="truncate text-sm font-bold text-foreground">{{ c.title }}</div>
                    <div class="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground opacity-60">第 {{ c.id }} 章</div>
                  </div>
                </button>
              </div>

              <!-- Comments -->
              <div v-else class="space-y-6">
                <div v-if="commentsLoading" class="flex justify-center py-12">
                  <div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
                <div v-else-if="commentsError" class="py-12 text-center text-destructive">{{ commentsError }}</div>
                <div v-else-if="comments.length === 0" class="py-12 text-center text-muted-foreground">
                  暂无书评，来当第一个吧
                </div>
                <div v-else class="space-y-6">
                  <div
                    v-for="c in comments"
                    :key="c.id"
                    class="flex gap-4 border-b border-border/50 pb-6 last:border-0"
                  >
                    <div class="relative h-12 w-12 flex-none overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
                      <img :src="c.userAvatar" :alt="c.userName" class="absolute inset-0 h-full w-full object-cover" />
                    </div>
                    <div class="min-w-0 flex-1 space-y-2">
                      <div class="flex items-center justify-between gap-2">
                        <div class="text-base font-bold text-foreground">{{ c.userName }}</div>
                        <div class="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
                          <ThumbsUp class="h-3 w-3" />
                          {{ c.likeCount }}
                        </div>
                      </div>
                      <div class="text-base leading-relaxed text-muted-foreground">
                        {{ c.content }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Sidebar -->
          <aside class="w-full space-y-8 lg:w-[320px]">
            <!-- Recommendation -->
            <section class="rounded-3xl border border-border bg-background p-6 shadow-sm">
              <h3 class="mb-6 text-lg font-bold text-foreground">同类推荐</h3>
              <div class="space-y-6">
                <RouterLink
                  v-for="rb in relatedBooks"
                  :key="rb.id"
                  :to="`/book/${rb.id}`"
                  class="group flex gap-4 transition-transform active:scale-[0.98]"
                >
                  <div class="h-24 w-16 flex-none overflow-hidden rounded-xl border border-border bg-muted shadow-sm group-hover:shadow-md">
                    <img :src="rb.cover" :alt="rb.title" class="h-full w-full object-cover" />
                  </div>
                  <div class="flex min-w-0 flex-col justify-center py-1">
                    <h4 class="truncate text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {{ rb.title }}
                    </h4>
                    <p class="mt-1 truncate text-xs text-muted-foreground">{{ rb.authorName }}</p>
                    <div class="mt-2 flex items-center gap-1 text-[10px] font-bold text-orange-500">
                      <Star class="h-2.5 w-2.5 fill-orange-500" />
                      {{ rb.dbRating?.toFixed(1) }}
                    </div>
                  </div>
                </RouterLink>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  </div>
</template>
