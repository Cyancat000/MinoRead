<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { 
  Home, 
  Flame, 
  Trophy, 
  TrendingUp, 
  ChevronRight, 
  Star,
  BookOpen
} from 'lucide-vue-next'
import SearchBar from '@/components/SearchBar.vue'
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

type RankingEntry = {
  rank: number
  book: Book
  trend?: 'up' | 'down' | 'stable'
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

const tabs = [
  { id: 'hot', label: '热门榜', icon: Flame, desc: '大家都在看的近期热门好书' },
  { id: 'finished', label: '高分榜', icon: Star, desc: '口碑爆表，不容错过的经典之作' },
  { id: 'potential', label: '畅销榜', icon: Trophy, desc: '销量领先，广大读者的共同选择' },
] as const

const currentTabInfo = computed(() => tabs.find(t => t.id === tab.value))

const list = computed(() => {
  if (!rankings.value) return []
  return (rankings.value[tab.value] ?? []).map(item => ({
    ...item,
    // 模拟趋势数据
    trend: item.rank <= 3 ? 'up' : (Math.random() > 0.7 ? 'down' : 'stable')
  }))
})

const mainEl = ref<HTMLElement | null>(null)
const pageSize = 12
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
  <div class="flex h-full w-full flex-col bg-muted/30">
    <header
      class="sticky top-0 z-20 border-b bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div class="mx-auto flex max-w-[1200px] items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold tracking-tight text-foreground">排行榜</h1>
          <div class="h-4 w-px bg-border"></div>
          <p class="text-sm text-muted-foreground">探索全站最受欢迎的精品书籍</p>
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

    <main ref="mainEl" class="min-h-0 flex-1 overflow-auto" @scroll="onScroll">
      <div class="mx-auto max-w-[1200px] px-6 py-8">
        <div class="flex flex-col gap-8 lg:flex-row">
          <!-- Sidebar Navigation -->
          <aside class="w-full space-y-4 lg:w-[280px]">
            <SearchBar class="mb-6 shadow-sm" />
            
            <div class="space-y-1">
              <button
                v-for="t in tabs"
                :key="t.id"
                type="button"
                class="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all active:scale-[0.98]"
                :class="[
                  tab === t.id 
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                    : 'bg-background border border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:shadow-sm'
                ]"
                @click="setTab(t.id)"
              >
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-current/10">
                  <component :is="t.icon" class="h-4 w-4" />
                </div>
                <div class="flex-1">
                  <div class="text-sm font-bold">{{ t.label }}</div>
                </div>
                <ChevronRight class="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <!-- Ranking Info Card -->
            <div class="mt-8 rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div class="flex items-center gap-2 text-primary">
                <TrendingUp class="h-5 w-5" />
                <h3 class="font-bold">当前榜单</h3>
              </div>
              <div class="mt-4 space-y-2">
                <div class="text-lg font-bold text-foreground">{{ currentTabInfo?.label }}</div>
                <p class="text-xs leading-relaxed text-muted-foreground">{{ currentTabInfo?.desc }}</p>
              </div>
              <div class="mt-6 border-t border-border pt-6">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-muted-foreground">榜单书籍</span>
                  <span class="font-bold text-foreground">{{ total }} 本</span>
                </div>
              </div>
            </div>
          </aside>

          <!-- Ranking List -->
          <div class="flex-1 space-y-6">
            <div v-if="loading" class="flex h-64 items-center justify-center">
              <div class="flex flex-col items-center gap-3 text-muted-foreground">
                <div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                加载中...
              </div>
            </div>
            <div v-else-if="error" class="flex h-64 items-center justify-center text-destructive">{{ error }}</div>
            <div v-else class="space-y-4">
              <!-- Ranking Card -->
              <div 
                v-for="item in visibleList" 
                :key="item.book.id"
                class="group relative flex items-stretch gap-6 overflow-hidden rounded-2xl border border-border bg-background p-4 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <!-- Rank Number -->
                <div class="flex w-12 flex-none flex-col items-center justify-center border-r border-border/50 pr-2">
                  <span 
                    class="text-3xl font-black italic tracking-tighter"
                    :class="[
                      item.rank === 1 ? 'text-orange-500' : 
                      item.rank === 2 ? 'text-blue-500' : 
                      item.rank === 3 ? 'text-green-500' : 'text-muted-foreground/30'
                    ]"
                  >
                    {{ item.rank.toString().padStart(2, '0') }}
                  </span>
                  <div class="mt-1 flex items-center gap-0.5">
                    <component 
                      :is="TrendingUp" 
                      class="h-3 w-3" 
                      :class="[
                        item.trend === 'up' ? 'text-red-500' : 
                        item.trend === 'down' ? 'text-blue-500 rotate-180' : 'text-muted-foreground opacity-30'
                      ]" 
                    />
                  </div>
                </div>

                <!-- Cover -->
                <RouterLink :to="'/book/' + item.book.id" class="relative h-32 w-24 flex-none overflow-hidden rounded-xl border border-border bg-muted shadow-sm transition-transform group-hover:scale-[1.02]">
                  <img :src="item.book.cover" :alt="item.book.title" class="h-full w-full object-cover" loading="lazy" />
                </RouterLink>

                <!-- Info -->
                <div class="flex min-w-0 flex-1 flex-col py-1">
                  <div class="flex items-start justify-between gap-4">
                    <div class="min-w-0 flex-1">
                      <RouterLink :to="'/book/' + item.book.id" class="truncate text-xl font-bold text-foreground hover:text-primary transition-colors">
                        {{ item.book.title }}
                      </RouterLink>
                      <div class="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                        <span class="font-medium text-foreground/80">{{ item.book.authorName }}</span>
                        <div v-if="item.book.seriesName" class="flex items-center gap-1">
                          <div class="h-1 w-1 rounded-full bg-border"></div>
                          <span>{{ item.book.seriesName }}</span>
                        </div>
                      </div>
                    </div>
                    <div v-if="item.book.dbRating" class="flex flex-col items-end">
                      <div class="flex items-center gap-1 text-orange-500">
                        <Star class="h-4 w-4 fill-orange-500" />
                        <span class="text-lg font-black">{{ item.book.dbRating.toFixed(1) }}</span>
                      </div>
                      <span class="text-[10px] uppercase tracking-wider text-muted-foreground">豆瓣评分</span>
                    </div>
                  </div>

                  <div class="mt-4 flex flex-wrap items-center gap-4">
                    <div class="flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                      <BookOpen class="h-3.5 w-3.5" />
                      {{ item.book.length ? (item.book.length / 10000).toFixed(1) + '万字' : '连载中' }}
                    </div>
                    <!-- 模拟热度值 -->
                    <div class="flex items-center gap-1.5 rounded-full bg-orange-500/5 px-3 py-1 text-xs font-medium text-orange-600">
                      <Flame class="h-3.5 w-3.5" />
                      {{ (Math.random() * 1000).toFixed(0) }} 热度
                    </div>
                  </div>

                  <div class="mt-auto">
                    <RouterLink 
                      :to="'/book/' + item.book.id"
                      class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      查看详情
                      <ChevronRight class="h-3 w-3" />
                    </RouterLink>
                  </div>
                </div>
              </div>

              <!-- Loading More -->
              <div v-if="loadingMore" class="flex items-center justify-center gap-3 py-8">
                <div class="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <div class="text-sm font-medium text-muted-foreground">加载更多精彩书籍...</div>
              </div>
              <div
                v-else-if="total > 0 && visibleCount >= total"
                class="py-12 text-center"
              >
                <div class="inline-flex items-center gap-2 rounded-full bg-muted px-6 py-2 text-xs text-muted-foreground">
                  <div class="h-1 w-1 rounded-full bg-muted-foreground/50"></div>
                  榜单已到底，共 {{ total }} 本书籍
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
